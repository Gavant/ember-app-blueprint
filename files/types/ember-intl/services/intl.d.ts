import Evented from '@ember/object/evented';
import Service from '@ember/service';

interface Data {
    authenticated: {
        id: string;
    };
}
declare module 'ember-intl/services/intl' {
    export default class intl extends Service.extend(Evented) {
        locale: any;
        primaryLocale: any;

        formatRelative(name: string): any;
        formatMessage(name: string): any;
        formatNumber(name: string): any;
        formatTime(name: string): any;
        formatDate(name: string): any;

        init(): () => void;
        willDestroy(): () => void;

        lookup(key: string, localeName: string, options: Record<string, unknown>): Record<string, unknown>;
        t(key: string, options?: Record<string, unknown>): string;
        setLocale(name: string): () => void;
    }
}
