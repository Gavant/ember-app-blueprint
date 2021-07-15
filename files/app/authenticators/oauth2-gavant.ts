import { getOwner } from '@ember/application';
import { warn } from '@ember/debug';
import { assign } from '@ember/polyfills';
import { cancel, later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { cached } from '@glimmer/tracking';

import Oauth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import { SessionAuthenticatedData } from 'ember-simple-auth/services/session';
import isFastBoot from 'ember-simple-auth/utils/is-fastboot';

import ENV from '<%= modulePrefix %>/config/environment';
import AjaxService from '<%= modulePrefix %>/services/ajax';
import { fastbootSafeBtoa } from '<%= modulePrefix %>/utils/encoding';

export default class Oauth2GavantAuthenticator extends Oauth2PasswordGrantAuthenticator {
    @service declare ajax: AjaxService;

    serverTokenEndpoint = `${ENV.apiBaseUrl}/oauth2/token`;
    serverTokenRevocationEndpoint = `${ENV.apiBaseUrl}/oauth2/logout`;
    serverTokenRefreshEndpoint = `${ENV.apiBaseUrl}/oauth2/refresh`;

    @cached
    get serverBasicAuthorization() {
        return `Basic ${fastbootSafeBtoa(`${ENV.clientId}:${ENV.clientSecret}`)}`;
    }

    get headers() {
        const headers = {} as { Authorization?: string };
        headers['Authorization'] = this.serverBasicAuthorization;
        return headers;
    }

    /**
     * Authenticates the user session using a OAuth2 Password Grant flow
     *
     * @param {String} username
     * @param {String} password
     * @returns Promise<AuthenticatedSessionData>
     */
    async authenticate(
        username: string,
        password: string,
        scope: string[] | string = [],
        headers: { Authorization?: string } = this.headers
    ): Promise<SessionAuthenticatedData> {
        const data: {
            grant_type: string;
            username: string;
            password: string;
            scope?: string;
        } = {
            grant_type: 'gavant_oauth',
            username,
            password
        };

        const scopesString = Array.isArray(scope) ? scope.join(' ') : scope;
        if (!isEmpty(scopesString)) {
            data.scope = scopesString;
        }
        try {
            let response = (await this.makeRequest(
                this.serverTokenEndpoint,
                data,
                headers
            )) as SessionAuthenticatedData;

            if (!this._validate(response)) {
                throw new Error('access_token is missing in server response');
            }

            // schedule a token refresh based on the token's expiration time
            // @see https://github.com/simplabs/ember-simple-auth/blob/3.0.0/addon/authenticators/oauth2-password-grant.js#L228
            const expiresAt = this._absolutizeExpirationTime(response.expires_in);
            this._scheduleAccessTokenRefresh(
                response.expires_in,
                expiresAt,
                response.refresh_token,
                response.access_token
            );
            if (!isEmpty(expiresAt)) {
                response = assign(response, { expires_at: expiresAt });
            }

            return response;
        } catch (err) {
            const response = err.responseJSON as ApiServerErrorResponse;
            throw response;
        }
    }

    /**
     * Restores the session, and refreshes it if needed
     *
     * @param {SessionAuthenticatedData} data
     */
    async restore(data: SessionAuthenticatedData) {
        const now = new Date().getTime();
        const refreshAccessTokens = this.refreshAccessTokens;
        if (!isEmpty(data.expires_at) && data.expires_at < now) {
            if (refreshAccessTokens) {
                try {
                    const result = await this._refreshAccessToken(data.expires_in, data.refresh_token);
                    return result;
                } catch (err) {
                    throw err;
                }
            } else {
                throw new Error('access_token refresh is not enabled');
            }
        } else {
            if (!this._validate(data)) {
                throw new Error('access_token is missing in data');
            } else {
                this._scheduleAccessTokenRefresh(
                    data.expires_in,
                    data.expires_at,
                    data.refresh_token,
                    data.access_token
                );
                return data;
            }
        }
    }

    /**
     * Invalidates the session on the server/Cognito
     *
     * @param {SessionAuthenticatedData} data
     * @returns {Promise}
     */
    async invalidate(data: SessionAuthenticatedData) {
        if (this.serverTokenRevocationEndpoint) {
            const { access_token } = data;
            await this.makeRequest(this.serverTokenRevocationEndpoint, { token: access_token }, this.headers);
            cancel(this._refreshTokenTimeout);
            delete this._refreshTokenTimeout;
        }
    }

    /**
     * Refreshes OAuth am access token
     *
     * @param {number} expiresIn
     * @param {string} refreshToken
     * @param {string} idToken
     */
    async _refreshAccessToken(expiresIn: number, refreshToken: string) {
        try {
            const body = {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            };

            let response = (await this.makeRequest(
                this.serverTokenRefreshEndpoint,
                body,
                this.headers
            )) as SessionAuthenticatedData;

            expiresIn = response.expires_in || expiresIn;
            refreshToken = response.refresh_token || refreshToken;

            const expiresAt = this._absolutizeExpirationTime(expiresIn);
            const data = assign(response, {
                expires_in: expiresIn,
                expires_at: expiresAt,
                refresh_token: refreshToken
            });

            this._scheduleAccessTokenRefresh(expiresIn, null, refreshToken, response.access_token);
            this.trigger('sessionDataUpdated', data);
            return data;
        } catch (err) {
            warn(`Access token could not be refreshed - server responded with ${err.responseJSON}.`, false, {
                id: 'ember-simple-auth.failedOAuth2TokenRefresh'
            });
            throw err;
        }
    }

    /**
     * Schedules an access token refresh to occur right before it will expire
     *
     * @param {number} expiresIn
     * @param {number | null} expiresAt
     * @param {string} refreshToken
     * @param {string} idToken
     */
    _scheduleAccessTokenRefresh(
        expiresIn: number,
        expiresAt: number | null,
        refreshToken: string,
        accessToken: string
    ) {
        const refreshAccessTokens = this.refreshAccessTokens && !isFastBoot(getOwner(this));
        if (refreshAccessTokens) {
            const now = new Date().getTime();
            if (isEmpty(expiresAt) && !isEmpty(expiresIn)) {
                expiresAt = new Date(now + expiresIn * 1000).getTime();
            }
            const offset = this.tokenRefreshOffset;
            if (!isEmpty(refreshToken) && !isEmpty(expiresAt) && expiresAt !== null && expiresAt > now - offset) {
                cancel(this._refreshTokenTimeout);
                delete this._refreshTokenTimeout;
                this._refreshTokenTimeout = later(
                    this,
                    this._refreshAccessToken,
                    expiresIn,
                    refreshToken,
                    accessToken,
                    expiresAt - now - offset
                );
            }
        }
    }

    /**
     * Validate the returned session data
     *
     * @param {AuthenticatedSessionData} data
     */
    _validate(data: SessionAuthenticatedData) {
        return !isEmpty(data.access_token);
    }
}
