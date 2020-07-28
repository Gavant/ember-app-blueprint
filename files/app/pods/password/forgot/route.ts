// REMOVE COMMENTS TO USE WITH EMBER-VALIDATIONS/CHANGESET ADDONS
import Route from '@ember/routing/route';
// import ChangesetRoute from '@gavant/ember-validations/mixins/changeset-route';
import PasswordForgotController from './controller';
// import Validations from '<%= modulePrefix %>/validations/password/forgot';

// export default class PasswordForgot extends ChangesetRoute(Route)
export default class PasswordForgot extends Route {
    // validations = Validations;

    model() {
        return {
            email: null
        };
    }

    /**
     * Reset controller state when leaving the route
     * @param {Controller}  controller
     * @param {Boolean} isExiting
     * @param {any} transition
     * @return {Void}
     */
    resetController(controller: PasswordForgotController, isExiting: boolean, transition: any) {
        super.resetController(controller, isExiting, transition);
        // if (isExiting) {
        //     controller.submitSuccess = false;
        // }
    }
}
