// REMOVE COMMENTS TO USE WITH EMBER-VALIDATIONS/CHANGESET ADDONS
// import ChangesetRoute from '@gavant/ember-validations/mixins/changeset-route';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import SessionService from 'ember-simple-auth/services/session';

import PageLayout from '<%= modulePrefix %>/mixins/page-layout';
import LoginController from '<%= modulePrefix %>/pods/login/controller';

// import Validations from 'rudie/validations/login';

// export default class Login extends PageLayout(ChangesetRoute(Route.extend(UnauthenticatedRouteMixin))) {
export default class Login extends PageLayout(Route.extend(UnauthenticatedRouteMixin)) {
    @service declare session: SessionService;
    classNames = ['login'];
    routeIfAlreadyAuthenticated = 'landing-route-here';
    // validations = Validations;

    /**
     * Creates a POJO for the login form changeset
     *
     * @return {Object}
     */
    model() {
        return {
            emailAddress: null,
            password: null
        };
    }

    /**
     * Reset controller state when leaving the route
     *
     * @param {Controller} controller
     * @param {boolean} isExiting
     * @param {any} transition
     */
    resetController(controller: LoginController, isExiting: boolean, transition: any): void {
        super.resetController(controller, isExiting, transition);
        if (isExiting) {
            this.session.set('isAuthenticating', false);
        }
    }
}
