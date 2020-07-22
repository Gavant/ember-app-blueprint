// REMOVE COMMENTS TO USE WITH EMBER-VALIDATIONS/CHANGESET ADDONS

import Controller from '@ember/controller';
// import { action, get } from '@ember/object';
// import { inject as service } from '@ember/service';
// import { inject as controller } from '@ember/controller';
// import { BufferedChangeset } from 'ember-changeset/types';
// import SessionService from 'ember-simple-auth/services/session';
// import LoadingBar from '<%= modulePrefix %>/services/loading-bar';
// import Notifications from '<%= modulePrefix %>/services/notifications';
// import PasswordCreateController from '<%= modulePrefix %>/pods/password/create/controller';
// import { ApiServerErrorResponse } from '../application/adapter';

class LoginController extends Controller {
    // @service loadingBar!: LoadingBar;
    // @service notifications!: Notifications;
    // @service session!: SessionService;
    //
    // @controller('password/create') passwordCreateController!: PasswordCreateController;
    //
    // @action
    // async authenticate(changeset: BufferedChangeset) {
    //     const username = get(changeset, 'emailAddress') as string;
    //     const password = get(changeset, 'password') as string;
    //
    //     try {
    //         this.loadingBar.show();
    //         this.session.set('isAuthenticating', true);
    //         let response = await this.session.authenticate('authenticator:oauth2-gavant', username, password);
    //         return response;
    //     } catch (err) {
    //         const response = err as ApiServerErrorResponse;
    //         this.loadingBar.hide();
    //         this.session.set('isAuthenticating', false);
    //         if (response?.errors?.[0]?.code === 'ForceChangePassword') {
    //             this.passwordCreateController.username = username;
    //             this.passwordCreateController.password = password;
    //             return this.transitionToRoute('password.create');
    //         }
    //
    //         this.notifications.errors(response);
    //         throw err;
    //     }
    // }
}

export default LoginController;

declare module '@ember/controller' {
    interface Registry {
        login: LoginController;
    }
}
