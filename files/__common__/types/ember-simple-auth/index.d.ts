declare module 'ember-simple-auth/utils/is-fastboot' {
    export function isFastBootCPM(): boolean;
    export default function isFastBoot(owner: any): boolean;
}

declare module 'ember-simple-auth/test-support' {
    import { SessionAuthenticatedData } from 'ember-simple-auth/services/session';
    export function authenticateSession(responseFromApi: SessionAuthenticatedData): void;
}
