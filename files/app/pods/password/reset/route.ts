// REMOVE COMMENTS TO USE WITH EMBER-VALIDATIONS/CHANGESET ADDONS
// import ChangesetRoute from '@gavant/ember-validations/mixins/changeset-route';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import PasswordResetController from '<%= modulePrefix %>/pods/password/reset/controller';
import AjaxService from '<%= modulePrefix %>/services/ajax';

// import Validations from '<%= modulePrefix %>/validations/password/reset';

export interface RouteParams {
    code: string;
    email: string;
}

// export default class PasswordReset extends ChangesetRoute(Route) {
export default class PasswordReset extends Route {
    @service declare ajax: AjaxService;
    // validations = Validations;

    model() {
        return {
            password: null,
            passwordConfirmation: null
        };
    }

    resetController(controller: PasswordResetController, isExiting: boolean, transition: any) {
        super.resetController(controller, isExiting, transition);
        // if (isExiting) {
        //     controller.code = '';
        //     controller.email = '';
        // }
    }
}
