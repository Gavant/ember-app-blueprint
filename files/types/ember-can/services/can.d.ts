import Service from '@ember/service';

declare module 'ember-can/services/can' {
    export default class can extends Service.extend() {
        parse(abilityString: string): Record<string, unknown>;
        abilityFor(abilityName: string, model: any, properties: Record<string, unknown>): any;
        valueFor(propertyName: string, abilityName: string, model: any, properties: Record<string, unknown>): any;
        can(abilityString: string, model: any, properties: Record<string, unknown>): boolean;
        cannot(abilityString: string, model: any, properties: Record<string, unknown>): boolean;
    }
}
