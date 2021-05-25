import Model, { attr } from '@ember-data/model';

import { unsendable } from '<%= modulePrefix %>/decorators/models';

export default class User extends Model {
    @attr('string') declare email: string;
    @attr('string') declare firstName: string;
    @attr('string') declare lastName: string;
    @attr('string') declare password: string;
    @attr('string') declare passwordConfirmation: string;
    @unsendable @attr('date') declare registeredOn: Date;
    @attr('string') declare username: string;

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        user: User;
    }
}
