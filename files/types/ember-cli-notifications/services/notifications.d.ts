import Service from '@ember/service';

export interface NotificationOptions {
    message: string;
    type?: string;
    autoClear?: boolean;
    clearDuration?: number;
    onClick?(): any;
    htmlContent?: boolean;
    cssClasses?: string[];
    remaining?: number;
}

export interface Notification extends NotificationOptions {}

declare module 'ember-cli-notifications/services/notifications' {
    export default class NotificationService extends Service {
        addNotification(options: NotificationOptions): Record<string, unknown>;
        success(message: string, options?: NotificationOptions): Record<string, unknown>;
        error(message: string, options?: NotificationOptions): Record<string, unknown>;
        info(message: string, options?: NotificationOptions): Record<string, unknown>;
        warning(message: string, options?: NotificationOptions): Record<string, unknown>;
        removeNotification(notification: Notification): void;
        setupAutoClear(notification: Notification): void;
        pauseAutoClear(notification: Notification): void;
        clearAll(): NotificationService;
        setDefaultAutoClear(autoClear: boolean): void;
        setDefaultClearDuration(clearDuration: number): void;
    }
}
