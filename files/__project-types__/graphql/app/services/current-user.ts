
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import SessionService from 'ember-simple-auth/services/session';
import { reject } from 'rsvp';

import { GetCurrentUserQuery, GetCurrentUserQueryVariables } from '<%= modulePrefix %>/types/graphql.generated';
import { GET_CURRENT_USER } from '<%= modulePrefix %>/graphql/queries/user';
import { useAwaitedQuery } from '<%= modulePrefix %>/utils/graphql';

export type CurrentUser = GetCurrentUserQuery['currentUser'];

export default class CurrentUserService extends Service {
    @service declare session: SessionService;

    @tracked user?: CurrentUser;

    /**
     * Loads the current user from the API
     * @return Promise<CurrentUser | undefined>
     */
    load(): Promise<CurrentUser | undefined> {
        return this.fetchUser();
    }

    /**
     * Refreshes the current user if logged in
     * @return Promise<CurrentUser | undefined>
     */
    refresh(): Promise<CurrentUser | undefined> {
        //only attempt to refresh the user if there is a logged in user
        if (this.session.isAuthenticated) {
            return this.fetchUser();
        }

        return reject();
    }

    /**
     * Fetches the current user model
     * @returns Promise<CurrentUser | undefined>
     */
    async fetchUser(): Promise<CurrentUser | undefined> {
        const currentUserQuery = await useAwaitedQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(this, () => [
            GET_CURRENT_USER,
            {},
        ]);

        this.user = currentUserQuery?.data?.currentUser;

        return this.user;
    }
}
