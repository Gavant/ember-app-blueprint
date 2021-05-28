import { Request, Schema } from 'ember-cli-mirage';

import ENV from '<%= modulePrefix %>/config/environment';

export default function (this: any) {
    // These comments are here to help you get started. Feel free to delete them.
    /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */
    this.urlPrefix = ENV.apiBaseUrl; // make this `http://localhost:8080`, for example, if your API is on a different server
    // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
    // this.timing = 400;      // delay for each request, automatically set to 0 during testing
    /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */

    this.get('/users', function (schema: Schema, request: Request) {
        const isFindingCurrentUser = !!request.queryParams['filter[me]'];
        if (isFindingCurrentUser) {
            const me = schema.users.where((user) => {
                if (user.firstName === 'Emma' && user.lastName === 'Baker') {
                    return user;
                } else {
                    return;
                }
            });
            return me;
        } else {
            return schema.users.all();
        }
    });
}
