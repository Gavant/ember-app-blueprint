import { get, set } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import DS from 'ember-data';
import SessionService from 'ember-simple-auth/services/session';

import User from '<%= modulePrefix %>/pods/user/model';
import { reject } from 'rsvp';

export default class CurrentUserService extends Service {
    @service declare store: DS.Store;
    @service declare session: SessionService;

    @tracked user?: User;

    /**
     * Loads the current user from the API
     * @return Promise<User>
     */
    load(): Promise<User> {
        return this.fetchUser();
    }

    /**
     * Refreshes the current user if logged in
     * @return {Promise}
     */
    refresh(): Promise<User> {
        //only attempt to refresh the user if there is a logged in user
        if (this.session.isAuthenticated) {
            return this.fetchUser();
        }
        return reject();
    }

    /**
     * Fetches the current user model
     * @returns Promise<User>
     */
    async fetchUser(): Promise<User> {
        const userArray = await this.store.query('user', { filter: { me: true } });
        const user = userArray.firstObject as User;
        // TODO can we improve this at all so we dont need to ts-ignore it?
        // @ts-ignore allow setting a non-standard property `user` on the session service instance
        set(this.session, 'user', user);
        this.user = user;
        return user;
    }
}
