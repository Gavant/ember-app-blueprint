import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import FastbootService from 'ember-cli-fastboot/services/fastboot';
import IntlService from 'ember-intl/services/intl';
import SessionService from 'ember-simple-auth/services/session';

import CurrentUserService from '<%= modulePrefix %>/services/current-user';

export default class Application extends Route {
    @service declare currentUser: CurrentUserService;
    @service declare session: SessionService;
    @service declare intl: IntlService;
    @service declare fastboot: FastbootService;

    async beforeModel(transition: Transition) {
        super.beforeModel(transition);
        await this.session.setup();
        this.intl.setLocale('en-us');
        if (this.session.isAuthenticated) {
            try {
                await this.currentUser.load();
            } catch (err) {
                this.replaceWith('five-hundred');
            }
        }
    }

    @action
    error(error?: any) {
        if (this.fastboot.isFastBoot) {
            this.fastboot.response.statusCode = error?.errors?.firstObject?.status ?? 200;
        }

        // TODO update this to handle graphql/apollo errors instead of ember data
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
