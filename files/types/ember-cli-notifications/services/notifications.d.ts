import Service from '@ember/service';

export interface NotificationItem {
    message: string;
    type: 'error' | 'info' | 'success' | 'warning';
    autoClear: boolean;
    clearDuration: number;
    onClick: () => void;
    htmlContent: string;
    cssClasses: string[];
}

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
        content: NotificationItem[];
        addNotification(options: NotificationOptions): NotificationItem;
        success(message: string, options?: NotificationOptions): NotificationItem;
        error(message: string, options?: NotificationOptions): NotificationItem;
        info(message: string, options?: NotificationOptions): NotificationItem;
        warning(message: string, options?: NotificationOptions): NotificationItem;
        removeNotification(notification: Notification): void;
        setupAutoClear(notification: Notification): void;
        pauseAutoClear(notification: Notification): void;
        clearAll(): NotificationService;
        setDefaultAutoClear(autoClear: boolean): void;
        setDefaultClearDuration(clearDuration: number): void;
    }
}
