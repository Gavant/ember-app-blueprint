import { createServer } from 'miragejs';
import { createGraphQLHandler } from '@miragejs/graphql';

import ENV from '<%= modulePrefix %>/config/environment';
import graphQLSchema from '<%= modulePrefix %>/graphql/schema/schema.graphql';

interface GraphQLHandlerConfigs {
    [environment: string]: {
        root: any;
        context: any;
        resolvers: any;
    };
}

const graphQLHandlerConfigs: GraphQLHandlerConfigs = {
    all: {
        root: undefined,
        context: undefined,
        resolvers: {
            Query: {
                // Add your GraphQL resolvers here to customize query logic and responses
                // @see https://github.com/miragejs/graphql#part-2-sorting
                /*
                    // for example, to just have a resolver return all records given any
                    //  query params, you can do:
                    users(obj, args, context, info) {
                        delete args.filters;
                        delete args.paging;
                        delete args.sort;
                        return mirageGraphQLFieldResolver(obj, args, context, info);
                    },
                */
            }
        }
    }
};

function routes() {
    // These comments are here to help you get started. Feel free to delete them.
    /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */
    // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
    // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
    // this.timing = 400;      // delay for each request, automatically set to 0 during testing
    /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://miragejs.com/docs/getting-started/overview/
  */
    // @ts-ignore
    const server = this as any;
    const handlerConfig = { ...graphQLHandlerConfigs.all, ...(graphQLHandlerConfigs[ENV.environment] ?? {}) };
    const graphQlHandler = createGraphQLHandler(graphQLSchema, server.schema, handlerConfig);
    server.post(ENV.graphql?.uri, graphQlHandler);
}

export default function (config: any) {
    const finalConfig = {
        ...config,
        routes
    };

    return createServer(finalConfig);
}