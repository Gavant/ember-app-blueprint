import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import IntlService from 'ember-intl/services/intl';

import PasswordForgotRoute, { ForgotPasswordChangeset } from '<%= modulePrefix %>/pods/password/forgot/route';
import AjaxService from '<%= modulePrefix %>/services/ajax';
import Notification from '<%= modulePrefix %>/services/notification';
import { RouteModel } from '<%= modulePrefix %>/utils/typescript';

export default class ForgotPasswordController extends Controller {
    @service declare notification: Notification;
    @service declare ajax: AjaxService;
    @service declare intl: IntlService;

    declare model: RouteModel<PasswordForgotRoute>;

    /**
     * Submits password forgot form
     *
     * @param {ForgotPasswordChangeset} changeset
     * @return {Promise}
     */
    @action
    async submit(changeset: ForgotPasswordChangeset) {
        try {
            const emailAddress = changeset.emailAddress;
            const result = await this.ajax.request('/oauth2/initiate-forgot-password', {
                method: 'POST',
                body: JSON.stringify({ username: emailAddress })
            });
            this.notification.success(
                this.intl.t('password.forgot.success', {
                    email: emailAddress
                })
            );

            return result;
        } catch (err) {
            this.notification.errors(err.payload);
            throw err;
        }
    }
}
