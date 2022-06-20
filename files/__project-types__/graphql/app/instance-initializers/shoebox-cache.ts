import { setupApolloCacheShoebox } from '<%= modulePrefix %>/utils/graphql';

export default {
    initialize: setupApolloCacheShoebox,
    after: 'apollo',
};
