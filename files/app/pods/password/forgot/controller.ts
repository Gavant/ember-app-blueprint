// REMOVE COMMENTS TO USE WITH EMBER-VALIDATIONS/CHANGESET ADDONS
import Controller from '@ember/controller';

// import { action } from '@ember/object';
// import { inject as service } from '@ember/service';
// import { tracked } from '@glimmer/tracking';
// import { BufferedChangeset } from 'ember-changeset/types';
// import Notification from '<%= modulePrefix %>/services/notification';
// import AjaxService from '<%= modulePrefix %>/services/ajax';

export default class ForgotPasswordController extends Controller {
    // @service declare notification: Notification;
    // @service declare ajax: AjaxService;
    //
    // @tracked submitSuccess: boolean = false;
    //
    // /**
    //  * Submits password forgot form
    //  *
    //  * @param {Changeset} changeset
    //  * @return {Promise}
    //  */
    // @action
    // async submit(changeset: BufferedChangeset) {
    //     try {
    //         const username = changeset.email;
    //         const result = await this.ajax.request('/oauth2/initiate-forgot-password', {
    //             method: 'POST',
    //             body: JSON.stringify({ username })
    //         });
    //
    //         this.submitSuccess = true;
    //         return result;
    //     } catch (err) {
    //         this.notification.errors(err.payload);
    //         throw err;
    //     }
    // }
}
