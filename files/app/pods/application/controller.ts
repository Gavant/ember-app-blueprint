import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import SessionService from 'ember-simple-auth/services/session';

import CurrentUserService from '<%= modulePrefix %>/services/current-user';

export default class Application extends Controller {
    @service declare session: SessionService;
    @service declare currentUser: CurrentUserService;

    @tracked notificationPosition = 'top-right'

    /**
     * Invalidate the session and log out
     *
     * @memberof Application
     */
    @action
    logout() {
        this.session.invalidate();
    }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
    interface Registry {
        application: Application;
    }
}
