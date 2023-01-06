import { validateConfirmation, validatePresence } from 'ember-changeset-validations/validators';

export const PASSWORD_RESET_VALIDATIONS = {
    password: [validatePresence({ presence: true, allowBlank: false })],
    passwordConfirmation: [validateConfirmation({ on: 'password' })]
};
