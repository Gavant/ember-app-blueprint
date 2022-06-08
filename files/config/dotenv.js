/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (env) {
    return {
        clientAllowedKeys: ['ROOT_URL', 'ASSETS_BASE_URL', 'GRAPHQL_URI', 'SCHEMA_PATH', 'FASTBOOT_WHITELIST_DOMAIN'],
        fastbootAllowedKeys: ['ROOT_URL', 'ASSETS_BASE_URL', 'GRAPHQL_URI', 'SCHEMA_PATH', 'FASTBOOT_WHITELIST_DOMAIN'],
        failOnMissingKey: false,
        path: path.join(path.dirname(__dirname), `../.env-${process.env.DEPLOY_TYPE || env}`)
    };
};
