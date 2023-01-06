declare module 'ember-simple-auth/services/session' {
    import Evented from '@ember/object/evented';
    import Transition from '@ember/routing/-private/transition';
    import Service from '@ember/service';

    interface SessionAuthenticatedData {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        expires_at: number | null;
    }

    interface SessionData {
        authenticated: SessionAuthenticatedData;
    }

    export default class session extends Service.extend(Evented) {
        /**
         * Triggered whenever the session is successfully authenticated. This happens
         * when the session gets authenticated via
         * {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}} but also
         * when the session is authenticated in another tab or window of the same
         * application and the session state gets synchronized across tabs or windows
         * via the store (see
         * {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).
         * When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
         * event will automatically get handled (see
         * {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).
         * @event authenticationSucceeded
         * @public
         */

        /**
         * Triggered whenever the session is successfully invalidated. This happens
         * when the session gets invalidated via
         * {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}} but also
         * when the session is invalidated in another tab or window of the same
         * application and the session state gets synchronized across tabs or windows
         * via the store (see
         * {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).
         * When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
         * event will automatically get handled (see
         * {{#crossLink "ApplicationRouteMixin/sessionInvalidated:method"}}{{/crossLink}}).
         * @event invalidationSucceeded
         * @public
         */

        isAuthenticated: boolean;
        isAuthenticating: boolean;
        data: SessionData | null;
        store: any;
        attemptedTransition: any;
        session: any;

        set<K extends keyof this>(key: K, value: this[K]): this[K];
        authenticate(...args: any[]): PromiseLike<SessionAuthenticatedData>;
        invalidate(...args: any): PromiseLike<Record<string, unknown>>;
        authorize(...args: any[]): PromiseLike<Record<string, unknown>>;
        requireAuthentication(transition: Transition, routeOrCallback: string | (() => void)): boolean;
        prohibitAuthentication(routeOrCallback: string | (() => void)): boolean;
        handleAuthentication(routeAfterAuth: string): void;
        handleInvalidation(routeAfterInvalid: string): void;
        setup(): Promise<SessionAuthenticatedData>;
    }
}
