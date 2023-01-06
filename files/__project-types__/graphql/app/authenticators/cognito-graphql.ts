import { getOwner } from '@ember/application';
import { warn } from '@ember/debug';
import { cancel, later } from '@ember/runloop';
import { isEmpty } from '@ember/utils';

import Oauth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import { SessionAuthenticatedData } from 'ember-simple-auth/services/session';
import isFastBoot from 'ember-simple-auth/utils/is-fastboot';
import { useMutation } from 'glimmer-apollo';

import { LOGIN, LOGOUT, REFRESH_TOKEN } from '<%= modulePrefix %>/graphql/mutations/auth';
import {
    LoginMutation,
    LoginMutationVariables,
    LogoutMutation,
    LogoutMutationVariables,
    RefreshTokenMutation,
    RefreshTokenMutationVariables,
} from '<%= modulePrefix %>/types/graphql.generated';

// TODO this should eventually be moved into an addon, e.g. @gavant/ember-auth-graphql
export default class CognitoGraphqlAuthenticator extends Oauth2PasswordGrantAuthenticator {
    loginMutation = useMutation<LoginMutation, LoginMutationVariables>(this, () => [
        LOGIN,
        { fetchPolicy: 'no-cache' },
    ]);

    logoutMutation = useMutation<LogoutMutation, LogoutMutationVariables>(this, () => [
        LOGOUT,
        { fetchPolicy: 'no-cache' },
    ]);

    refreshTokenMutation = useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(this, () => [
        REFRESH_TOKEN,
        { fetchPolicy: 'no-cache' },
    ]);

    /**
     * Authenticates the user session using Cognito
     *
     * @param {String} username
     * @param {String} password
     * @returns Promise<AuthenticatedSessionData>
     */
    async authenticate(username: string, password: string): Promise<SessionAuthenticatedData> {
        const input = { username, password };
        const response = await this.loginMutation.mutate({ input });
        const responseData = response?.login;
        const sessionData: SessionAuthenticatedData = {
            access_token: responseData?.AccessToken ?? '',
            refresh_token: responseData?.RefreshToken ?? '',
            expires_in: responseData?.ExpiresIn ?? 0,
            expires_at: this._absolutizeExpirationTime(responseData?.ExpiresIn) ?? null,
        };

        if (!this._validate(sessionData)) {
            throw new Error('access_token is missing in server response');
        }

        // schedule a token refresh based on the token's expiration time
        // @see https://github.com/simplabs/ember-simple-auth/blob/3.0.0/addon/authenticators/oauth2-password-grant.js#L228
        this._scheduleAccessTokenRefresh(sessionData.expires_in, sessionData.expires_at, sessionData.refresh_token);

        return sessionData;
    }

    /**
     * Restores the session, and refreshes it if needed
     *
     * @param {SessionAuthenticatedData} data
     */
    async restore(data: SessionAuthenticatedData): Promise<SessionAuthenticatedData> {
        const now = new Date().getTime();
        const refreshAccessTokens = this.refreshAccessTokens;

        if (data.expires_at && data.expires_at < now) {
            if (refreshAccessTokens) {
                const result = await this._refreshAccessToken(data.expires_in, data.refresh_token);
                return result;
            } else {
                throw new Error('session refresh is not enabled');
            }
        } else {
            if (!this._validate(data)) {
                throw new Error('access_token is missing in data');
            } else {
                this._scheduleAccessTokenRefresh(data.expires_in, data.expires_at, data.refresh_token);
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
        try {
            const { refresh_token: refreshToken } = data;
            await this.logoutMutation.mutate({ refreshToken });
        } finally {
            cancel(this._refreshTokenTimeout);
            delete this._refreshTokenTimeout;
        }
    }

    /**
     * Refreshes OAuth am access token
     *
     * @param {number} prevExpiresIn
     * @param {string} refreshToken
     */
    async _refreshAccessToken(prevExpiresIn: number, refreshToken: string): Promise<SessionAuthenticatedData> {
        try {
            const response = await this.refreshTokenMutation.mutate({ refreshToken });
            const responseData = response?.refreshToken;
            const expiresIn = responseData?.ExpiresIn || prevExpiresIn;
            const sessionData: SessionAuthenticatedData = {
                access_token: responseData?.AccessToken ?? '',
                refresh_token: refreshToken,
                expires_in: expiresIn,
                expires_at: this._absolutizeExpirationTime(expiresIn) ?? null,
            };

            this._scheduleAccessTokenRefresh(expiresIn, null, refreshToken);
            this.trigger('sessionDataUpdated', sessionData);
            return sessionData;
        } catch (err) {
            warn(`ID token could not be refreshed - server responded with ${err.toString()}.`, false, {
                id: 'ember-simple-auth.failedOAuth2TokenRefresh',
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
     */
    _scheduleAccessTokenRefresh(expiresIn: number, expiresAt: number | null, refreshToken: string) {
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
