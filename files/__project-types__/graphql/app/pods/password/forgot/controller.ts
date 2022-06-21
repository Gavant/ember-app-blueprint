import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import IntlService from 'ember-intl/services/intl';
import { useMutation } from 'glimmer-apollo';

import { FORGOT_PASSWORD } from '<%= modulePrefix %>/graphql/mutations/auth';
import { ForgotPasswordMutation, ForgotPasswordMutationVariables } from '<%= modulePrefix %>/types/graphql.generated';
import PasswordForgotRoute, { ForgotPasswordChangeset } from '<%= modulePrefix %>/pods/password/forgot/route';
import Notification from '<%= modulePrefix %>/services/notification';
import { RouteModel } from '<%= modulePrefix %>/utils/typescript';

export default class ForgotPasswordController extends Controller {
    @service declare notification: Notification;
    @service declare intl: IntlService;

    declare model: RouteModel<PasswordForgotRoute>;

    forgotPasswordMutation = useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(this, () => [
        FORGOT_PASSWORD,
        {},
    ]);

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
            const result = await this.forgotPasswordMutation.mutate({ username: emailAddress });

            if (!result?.forgotPassword || this.forgotPasswordMutation.error) {
                throw this.forgotPasswordMutation.error;
            }

            this.notification.success(
                this.intl.t('password.forgot.success', {
                    email: emailAddress
                })
            );

            return result;
        } catch (err) {
            this.notification.errors(err);
            throw err;
        }
    }
}
