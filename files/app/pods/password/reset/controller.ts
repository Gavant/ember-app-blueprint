// REMOVE COMMENTS TO USE WITH EMBER-VALIDATIONS/CHANGESET ADDONS
import Controller from '@ember/controller';

// import { action } from '@ember/object';
// import { inject as service } from '@ember/service';
// import { tracked } from '@glimmer/tracking';
// import { BufferedChangeset } from 'ember-changeset/types';
// import IntlService from 'ember-intl/services/intl';
// import Notification from '<%= modulePrefix %>/services/notification';
// import AjaxService from '<%= modulePrefix %>/services/ajax';

export default class PasswordResetController extends Controller {
    // @service declare intl: IntlService;
    // @service declare notification: Notification;
    // @service declare ajax: AjaxService;
    //
    // queryParams: string[] = ['code', 'email'];
    //
    // @tracked code!: string;
    // @tracked email!: string;
    //
    // @action
    // async submit(changeset: BufferedChangeset) {
    //     try {
    //         const result = await this.ajax.request('/oauth2/confirm-forgot-password', {
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 username: this.email,
    //                 confirmation_code: this.code,
    //                 new_password: changeset.password
    //             })
    //         });
    //
    //         this.transitionToRoute('login');
    //         this.notification.success(this.intl.t('password.reset.success'));
    //         return result;
    //     } catch (err) {
    //         this.notification.errors(err.payload);
    //         throw err;
    //     }
    // }
}
