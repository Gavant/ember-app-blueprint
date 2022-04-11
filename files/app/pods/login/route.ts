import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import SessionService from 'ember-simple-auth/services/session';

import createChangeset, { GenericChangeset } from '@gavant/ember-validations/utilities/create-changeset';

import LoginController from '<%= modulePrefix %>/pods/login/controller';
import { LOGIN_VALIDATIONS } from '<%= modulePrefix %>/validations/login';

export type LoginChangeset = GenericChangeset<{ emailAddress?: string; password?: string }>;
export default class Login extends Route {
    @service declare session: SessionService;
    classNames = ['unauthenticated login'];
    routeIfAlreadyAuthenticated = 'landing-route-here';

    /**
     * Redirect if authenticated
     *
     * @memberof Login
     */
    beforeModel() {
        this.session.prohibitAuthentication('index');
    }


    /**
     * Creates a POJO for the login form changeset
     *
     * @return {Object}
     */
     model(): LoginChangeset {
        const changeset = createChangeset({}, LOGIN_VALIDATIONS);
        return changeset;
    }


    /**
     * Reset controller state when leaving the route
     *
     * @param {LoginController} controller
     * @param {boolean} isExiting
     * @param {any} transition
     */
    resetController(controller: LoginController, isExiting: boolean, transition: Transition): void {
        super.resetController(controller, isExiting, transition);
        if (isExiting) {
            this.session.set('isAuthenticating', false);
        }
    }
}
