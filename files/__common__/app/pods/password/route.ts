import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import SessionService from 'ember-simple-auth/services/session';

export default class Password extends Route {
    @service declare session: SessionService;
    classNames = ['unauthenticated forgot-password'];

    /**
     * Redirect if authenticated
     *
     * @memberof Password
     */
    beforeModel() {
        this.session.prohibitAuthentication('authenticated');
    }
}
