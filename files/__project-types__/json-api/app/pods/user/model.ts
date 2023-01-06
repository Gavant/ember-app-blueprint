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
    get initials() {
        if (this.firstName || this.lastName) {
            return `${this.firstName.charAt(0).toUpperCase() ?? ''} ${this.lastName.charAt(0).toUpperCase() ?? ''}`;
        } else {
            return this.email.charAt(0).toUpperCase();
        }
    }

}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        user: User;
    }
}
