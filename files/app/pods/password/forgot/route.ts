import Route from '@ember/routing/route';

import createChangeset, { GenericChangeset } from '@gavant/ember-validations/utilities/create-changeset';

import { PASSWORD_FORGOT_VALIDATIONS } from '<%= modulePrefix %>/validations/password/forgot';

export type ForgotPasswordChangeset = GenericChangeset<{ emailAddress?: string }>;
export default class PasswordForgot extends Route {
    model() {
        return createChangeset({}, PASSWORD_FORGOT_VALIDATIONS);
    }
}
