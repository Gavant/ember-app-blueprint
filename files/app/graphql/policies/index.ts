/**
 * Root Apollo field policies object
 *
 * When creating field policies for new top-level fields, they must be imported and added to this
 * object, which is applied to the Apollo cache configuration on app init in app/apollo.ts
 * @see https://www.apollographql.com/docs/react/pagination/core-api/#defining-a-field-policy
 */
export default {
    Query: {
        fields: {}
    }
};
