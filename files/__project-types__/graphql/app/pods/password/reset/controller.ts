import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import IntlService from 'ember-intl/services/intl';
import { useMutation } from 'glimmer-apollo';

import { CONFIRM_FORGOT_PASSWORD } from '<%= modulePrefix %>/graphql/mutations/auth';
import {
    ConfirmForgotPasswordMutation,
    ConfirmForgotPasswordMutationVariables,
} from '<%= modulePrefix %>/types/graphql.generated';
import { ResetPasswordChangeset } from '<%= modulePrefix %>/pods/password/reset/route';
import Notification from '<%= modulePrefix %>/services/notification';

export default class PasswordResetController extends Controller {
    @service declare intl: IntlService;
    @service declare notification: Notification;

    queryParams: string[] = ['code', 'email'];

    confirmForgotPasswordMutation = useMutation<ConfirmForgotPasswordMutation, ConfirmForgotPasswordMutationVariables>(
        this,
        () => [CONFIRM_FORGOT_PASSWORD, {}]
    );

    @tracked code?: string;
    @tracked email?: string;

    /**
     * Submits password reset form
     *
     * @param {ResetPasswordChangeset} changeset
     * @return {Promise}
     */
    @action
    async submit(changeset: ResetPasswordChangeset) {
        try {
            const input = {
                username: this.email,
                confirmationCode: this.code,
                newPassword: changeset.password
            };
            const result = await this.confirmForgotPasswordMutation.mutate({ input });

            if (!result?.confirmForgotPassword || this.confirmForgotPasswordMutation.error) {
                throw this.confirmForgotPasswordMutation.error;
            }

            this.transitionToRoute('login');
            this.notification.success(this.intl.t('password.reset.success'));
        } catch (err) {
            this.notification.errors(err);
            throw err;
        }
    }
}
