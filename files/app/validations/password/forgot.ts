import { validateFormat, validatePresence } from 'ember-changeset-validations/validators';

export const PASSWORD_FORGOT_VALIDATIONS = {
    emailAddress: [validatePresence({ presence: true, ignoreBlank: true }), validateFormat({ type: 'email' })]
};
