import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import createChangeset, { GenericChangeset } from '@gavant/ember-validations/utilities/create-changeset';

import PasswordResetController from '<%= modulePrefix %>/pods/password/reset/controller';
import AjaxService from '<%= modulePrefix %>/services/ajax';
import { PASSWORD_RESET_VALIDATIONS } from '<%= modulePrefix %>/validations/password/reset';

export type ResetPasswordChangeset = GenericChangeset<{ password?: string; passwordConfirmation?: string }>;

export default class PasswordReset extends Route {
    @service declare ajax: AjaxService;

    model() {
        return createChangeset({}, PASSWORD_RESET_VALIDATIONS);
    }

    resetController(controller: PasswordResetController, isExiting: boolean, transition: any) {
        super.resetController(controller, isExiting, transition);
        if (isExiting) {
            controller.code = '';
            controller.email = '';
        }
    }
}
