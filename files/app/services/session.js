import { inject as service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';

export default class Session extends SessionService {
    @service currentUser;

    async handleAuthentication(routeAfterAuth) {
        try {
            //get the current user's model before transitioning from the login page
            await this.currentUser.load();
            super.handleAuthentication(routeAfterAuth);
        } catch (error) {
            //handle failures of fetching the current user here (e.g. display error notification toast, etc)
            //since current user fetch failed, the user should probably not stay logged in
            this.invalidate();
        }
    }
}
