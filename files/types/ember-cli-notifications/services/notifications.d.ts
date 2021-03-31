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
        addNotification(options: NotificationOptions): Object;
        success(message: string, options?: NotificationOptions): Object;
        error(message: string, options?: NotificationOptions): Object;
        info(message: string, options?: NotificationOptions): Object;
        warning(message: string, options?: NotificationOptions): Object;
        removeNotification(notification: Notification): void;
        setupAutoClear(notification: Notification): void;
        pauseAutoClear(notification: Notification): void;
        clearAll(): NotificationService;
        setDefaultAutoClear(autoClear: boolean): void;
        setDefaultClearDuration(clearDuration: number): void;
    }
}
