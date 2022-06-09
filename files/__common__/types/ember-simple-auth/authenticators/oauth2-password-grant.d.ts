declare module 'ember-simple-auth/authenticators/oauth2-password-grant' {
    export default class Oauth2PasswordGrantAuthenticator {
        clientId?: string;
        refreshAccessTokens: boolean;
        tokenRefreshOffset: number;
        _refreshTokenTimeout: any;
        trigger(event: string, data: any): void;
        makeRequest(url: string, data: any, headers?: any): Promise<any>;
        _validate(data: any): boolean;
        _absolutizeExpirationTime(expiresIn?: number): number;
        _scheduleAccessTokenRefresh(
            expiresIn: number,
            expiresAt: number | null,
            refreshToken: string,
            accessToken: string
        ): void;
    }
}
