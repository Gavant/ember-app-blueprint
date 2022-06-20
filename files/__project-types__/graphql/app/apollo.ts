import { setContext } from '@apollo/client/link/context';
import { ApolloClient, InMemoryCache, createHttpLink, from, ServerError } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import ApplicationInstance from '@ember/application/instance';

import SessionService from 'ember-simple-auth/services/session';
import FastbootService from 'ember-cli-fastboot/services/fastboot';
import fetch from 'fetch';
import { setClient } from 'glimmer-apollo';

import ENV from '<%= modulePrefix %>/config/environment';
import typePolicies from '<%= modulePrefix %>/graphql/policies/index';
import { guard } from '<%= modulePrefix %>/utils/types';

const DEFAULT_SSR_FORCE_FETCH_DELAY = 100;

/**
 * Glimmer Apollo client configuration
 *
 * @see https://glimmer-apollo.com/docs/getting-started#setup-the-client
 */
export default function setupApolloClient(context: ApplicationInstance): void {
    // http connection to the api
    // @see https://www.apollographql.com/docs/react/api/link/introduction/
    const httpLink = createHttpLink({
        uri: ENV.graphql?.uri,
        fetch,
    });

    // TODO once we have a separate @gavant/ember-auth-graphql addon, move the
    // authLink and errorLink (for unauthorized errors handling) into it
    // and then update this to import the links from the addon

    // authentication headers
    // @see https://www.apollographql.com/docs/react/networking/authentication/
    const authLink = setContext((_, { headers }) => {
        const session = context.lookup('service:session') as SessionService;
        const token = session?.data?.authenticated?.access_token;
        const authData = { headers: headers ?? {} };

        if (token) {
            authData.headers.Authorization = `Bearer ${token}`;
        }

        return authData;
    });

    // global network error handling
    // @see https://www.apollographql.com/docs/react/api/link/apollo-link-error/
    const errorLink = onError((err) => {
        const { networkError } = err;

        if (networkError) {
            if (guard<ServerError>(networkError, 'statusCode') && networkError.statusCode === 401) {
                const session = context.lookup('service:session') as SessionService;
                if (session?.isAuthenticated) {
                    session?.invalidate?.();
                }
            }
        }
    });

    // SSR mode
    // @see https://www.apollographql.com/docs/react/performance/server-side-rendering/#initializing-apollo-client
    const fastboot = context.lookup('service:fastboot') as FastbootService;
    const ssrMode = fastboot?.isFastBoot ?? false;

    // cache implementation
    // @see https://www.apollographql.com/docs/react/caching/cache-configuration/
    const cache = new InMemoryCache({
        typePolicies,
    });

    // create the apollo client
    const clientOptions = {
        cache,
        ssrMode,
        // `ssrForceFetchDelay` is a delay (in ms) on app boot before `fetchPolicy`'s that bypass
        // the cache (like `no-cache`, `network-only`, or `cache-and-network`) are applied. This
        // allows SSR cache rehydration to fufill even those queries directly from the cache
        // so that double/redundant fetches are avoided on client-side initialization
        // @see https://www.apollographql.com/docs/react/performance/server-side-rendering/#overriding-fetch-policies-during-initialization
        // TODO replace this timeout with logic in our useQuery() that checks if the initial page render is completed or not
        ssrForceFetchDelay: ENV.graphql?.ssrForceFetchDelay ?? DEFAULT_SSR_FORCE_FETCH_DELAY,
        name: ENV.modulePrefix,
        version: ENV.APP.VERSION,
    };

    const apolloClient = new ApolloClient({
        link: from([errorLink, authLink, httpLink]),
        ...clientOptions,
    });

    // set default apollo client for glimmer apollo
    setClient(context, apolloClient);
}
