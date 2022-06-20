import { FieldMergeFunction } from '@apollo/client/cache';
import type { OperationVariables } from '@apollo/client/core';
import ApplicationInstance from '@ember/application/instance';

import FastbootService from 'ember-cli-fastboot/services/fastboot';
import { getClient, QueryPositionalArgs, useQuery as apolloQuery } from 'glimmer-apollo';

import { InputMaybe, Page } from '<%= modulePrefix %>/types/graphql.generated';

export type DefaultQueryArgs = OperationVariables & {
    variables?: {
        filters: unknown;
        paging?: InputMaybe<Page>;
        sort?: InputMaybe<Array<unknown>>;
    };
};

export const defaultPaging = {
    offset: 0,
    limit: 10,
};

export const defaultQueryOptions = {
    // how the client handles responses that contain errors (default is 'none')
    // @see https://www.apollographql.com/docs/react/data/error-handling/#graphql-error-policies
    errorPolicy: 'all',
    // 'network-only' somewhat analogous to store.query's reload=true ('cache-first' is the default)
    // @see https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
    fetchPolicy: 'cache-first',
    // allows you to react to updates to query resource properties like `loading`, `networkStatus` etc.
    // @see https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states
    notifyOnNetworkStatusChange: true,
    // enables running the query in server-side rendering/fastboot (this is the default value),
    // @see https://www.apollographql.com/docs/react/performance/server-side-rendering/#skipping-a-query
    ssr: true,
};

/**
 * generic cache merge function that should satisfy the needs of most paginated query field policies
 * it expects the query to have a paging.offset variable which it uses to merge the new results into
 * the correct spot of the list, rather than the more naive approach of just always appending incoming
 * results at the end of the array
 * @see https://www.apollographql.com/docs/react/pagination/core-api#merging-paginated-results
 */
export const paginationMerge: FieldMergeFunction = (existing: any[], incoming: any[], options) => {
    const offset = options?.args?.paging?.offset ?? 0;
    const merged = existing ? existing.slice(0) : [];
    for (let i = 0; i < incoming.length; ++i) {
        merged[offset + i] = incoming[i];
    }
    return merged;
};

/**
 * Wrapper for glimmer-apollo's `useQuery()`, applying default configs
 *
 * @param context any
 * @param args () => QueryPositionalArgs<TData, TVariables>
 * @returns QueryResource<TData, DefaultQueryArgs>
 */
export function useQuery<TData = unknown, TVariables = OperationVariables>(
    context: any,
    args: () => QueryPositionalArgs<TData, TVariables>
) {
    const customArgs: () => QueryPositionalArgs<TData, TVariables> = function () {
        const passedArgs = args();
        const options = Object.assign({} as Partial<TVariables>, defaultQueryOptions, passedArgs[1]);
        return [passedArgs[0], options];
    };

    const graphqlQuery = apolloQuery<TData, DefaultQueryArgs>(
        context as unknown as Record<string, unknown>,
        customArgs
    );
    return graphqlQuery;
}

/**
 * A simple helper for fetching a query once and "on-demand", (e.g. inside of a function block)
 * instead of initializing it on a separate property when it's parent/owner class is first
 * instantianted.
 *
 * Has the exact same signature as `useQuery()`, but returns a Promise instead which resolves
 * once the initial query call has completed.
 * @param context any
 * @param args () => QueryPositionalArgs<TData, TVariables>
 * @returns Promise<QueryResource<TData, DefaultQueryArgs>>
 */
export async function useAwaitedQuery<TData = unknown, TVariables = OperationVariables>(
    context: any,
    args: () => QueryPositionalArgs<TData, TVariables>
) {
    const query = useQuery<TData, TVariables>(context, args);

    try {
        await query.promise;
        return query;
    } catch {
        return query;
    }
}

/**
 * Decorator to wait for a query to finish
 *
 * @param {*} _target
 * @param {string} _key
 * @param {*} descriptor
 */
export function waitForQuery(_target: any, _key: string, descriptor: any) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        const result = await originalMethod.apply(this, args);
        await result.promise;
        return result;
    };
}

/**
 * Paging function to handle loading more and checking if there are more to load after results are loaded
 *
 * @export
 * @param {{ data: string; hasMore: string }} keys
 * @return {*}
 */
export function pagination(keys: { data: string; hasMore: string }) {
    return function (this: any, _target: any, _key: string | symbol, descriptor: PropertyDescriptor) {
        const childFunction = descriptor.value;

        descriptor.value = async function (this: any, ...args: any[]) {
            const splitTarget = keys.data.split('.');
            const queryResult = splitTarget.reduce((prev, curr) => prev && prev[curr], this);
            if (queryResult) {
                const param = {
                    variables: {
                        paging: { ...this.defaultPaging, offset: queryResult.length },
                    },
                } as any;
                const result = await childFunction.apply(this, [param, ...args]);
                const hasMoreKey = splitTarget[splitTarget.length - 1];
                const hasMore = (result?.data?.[hasMoreKey]?.length ?? 0) >= defaultPaging.limit;
                this[keys.hasMore] = hasMore;
            }
        };
        return descriptor;
    };
}

/**
 * When run on application initialization, this will extract Apollo's current cache data
 * into the FastBoot Shoebox when run in FastBoot, and will restore Apollo's cache with
 * the data stored in the Shoebox when run on the client-side.
 * @param context ApplicationInstance
 */
export function setupApolloCacheShoebox(context: ApplicationInstance): void {
    const fastboot = context.lookup('service:fastboot') as FastbootService;
    const apolloCache = getClient(context).cache;
    const shoebox = fastboot.get('shoebox');

    if (fastboot.isFastBoot) {
        // create a shoebox entry with a getter, so that the cache isn't actually
        // extracted until fastboot serializes the shoebox contents into the page
        // AFTER all the apollo queries have resolved.
        shoebox.put('apollo-cache', {
            get cache(): unknown {
                return apolloCache.extract();
            },
        });
    } else {
        const cacheContents = shoebox.retrieve('apollo-cache') as unknown as { cache: unknown };
        if (cacheContents?.cache) {
            apolloCache.restore(cacheContents.cache);
        }
    }
}
