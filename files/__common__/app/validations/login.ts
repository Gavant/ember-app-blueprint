import { validateFormat, validatePresence } from 'ember-changeset-validations/validators';

export const LOGIN_VALIDATIONS = {
    emailAddress: [validatePresence({ presence: true, ignoreBlank: true }), validateFormat({ type: 'email' })],
    password: [validatePresence({ presence: true, ignoreBlank: false })]
};
