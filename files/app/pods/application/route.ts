import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import FastbootService from 'ember-cli-fastboot/services/fastboot';
import IntlService from 'ember-intl/services/intl';
import SessionService from 'ember-simple-auth/services/session';

import CurrentUserService from '<%= modulePrefix %>/services/current-user';

export default class Application extends Route {
    routeAfterAuthentication = 'dashboard';
    @service declare currentUser: CurrentUserService;
    @service declare session: SessionService;
    @service declare intl: IntlService;
    @service declare fastboot: FastbootService;

    async beforeModel(transition: Transition) {
        super.beforeModel(transition);
        this.intl.setLocale('en-us');
        if (this.session.isAuthenticated) {
            try {
                await this.currentUser.load();
            } catch (err) {
                this.replaceWith('five-hundred');
            }
        }
    }

    async sessionAuthenticated() {
        try {
            //get the current user's model before transitioning from the login page
            const currentUser = await this.currentUser.load();
            //@ts-ignore TODO we need a way to inform TS about class members coming from Ember-style mixins
            super.sessionAuthenticated(...arguments);
            return currentUser;
        } catch (err) {
            //handle failures of fetching the current user here (e.g. display error notification toast, etc)
            //since current user fetch failed, the user should probably not stay logged in
            this.session.invalidate();
            throw err;
        }
    }

    @action
    error(error?: any) {
        if (this.fastboot.isFastBoot) {
            this.fastboot.response.statusCode = error?.errors?.firstObject?.status ?? 200;
        }
        if (error?.errors?.length > 0) {
            const status = error.errors.firstObject.status;
            if (status === '403') {
                this.replaceWith('four-oh-three');
                //marks error as being handled
                return false;
            } else if (status === '401') {
                this.replaceWith('login');
                //marks error as being handled
                return false;
            } else if (status === '404') {
                this.replaceWith('four-oh-four', '404');
                //marks error as being handled
                return false;
            }
        }
        return true;
    }
}
