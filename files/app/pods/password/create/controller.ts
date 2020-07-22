// REMOVE COMMENTS TO USE WITH EMBER-VALIDATIONS/CHANGESET ADDONS
import Controller from '@ember/controller';
// import { action } from '@ember/object';
// import { inject as service } from '@ember/service';
// import { BufferedChangeset } from 'ember-changeset/types';
// import IntlService from 'ember-intl/services/intl';
// import SessionService from 'ember-simple-auth/services/session';
// import Notifications from '<%= modulePrefix %>/services/notifications';
// import AjaxService from '<%= modulePrefix %>/services/ajax';

class PasswordCreateController extends Controller {
    // @service session!: SessionService;
    // @service intl!: IntlService;
    // @service notifications!: Notifications;
    // @service ajax!: AjaxService;
    //
    // username: string = '';
    // password: string = '';
    //
    // @action
    // async submit(changeset: BufferedChangeset) {
    //     try {
    //         const username = this.username;
    //         const tempPassword = this.password;
    //         const newPassword = changeset.password;
    //
    //         await this.ajax.request('/oauth2/set-new-password', {
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 username,
    //                 temp_password: tempPassword,
    //                 new_password: newPassword
    //             })
    //         });
    //
    //         this.notifications.success(this.intl.t('password.create.success'));
    //         return this.session.authenticate('authenticator:oauth2-gavant', username, newPassword);
    //     } catch (err) {
    //         this.notifications.errors(err?.payload ?? err);
    //         throw err;
    //     }
    // }
}

export default PasswordCreateController;

declare module '@ember/controller' {
    interface Registry {
        'password/create': PasswordCreateController;
    }
}
