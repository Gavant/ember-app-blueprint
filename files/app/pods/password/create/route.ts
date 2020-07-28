// REMOVE COMMENTS TO USE WITH EMBER-VALIDATIONS/CHANGESET ADDONS
import Route from '@ember/routing/route';
import Transition from '@ember/routing/-private/transition';
// import ChangesetRoute from '@gavant/ember-validations/mixins/changeset-route';
// import Validations from '<%= modulePrefix %>/validations/account/create-password';
import PasswordCreateController from './controller';

// export default class PasswordCreate extends ChangesetRoute(Route) {
export default class PasswordCreate extends Route {
    // validations = Validations;

    /**
     * Password create form model
     */
    model() {
        return {
            password: null,
            passwordConfirmation: null
        };
    }

    /**
     * if there is no username/password set on the controller,
     * i.e. user refreshed or navigated directly to this page,
     * then redirect to /login
     *
     * @param {object} model
     * @param {Transition} transition
     */
    afterModel(model: object, transition: Transition) {
        super.afterModel(model, transition);
        // const controller = this.controllerFor('password.create') as PasswordCreateController;
        // if (!controller.username || !controller.password) {
        //     this.transitionTo('login');
        // }
    }

    /**
     * Clear the passed in username and password when leaving the route
     *
     * @param {PasswordCreateController} controller
     * @param {boolean} isExiting
     * @param {any} transition
     */
    resetController(controller: PasswordCreateController, isExiting: boolean, transition: any) {
        super.resetController(controller, isExiting, transition);
        // controller.username = '';
        // controller.password = '';
    }
}
