/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (env) {
    return {
        clientAllowedKeys: ['ROOT_URL', 'API_BASE_URL', 'ASSETS_BASE_URL', 'FASTBOOT_WHITELIST_DOMAIN'],
        fastbootAllowedKeys: ['ROOT_URL', 'API_BASE_URL', 'ASSETS_BASE_URL', 'FASTBOOT_WHITELIST_DOMAIN'],
        failOnMissingKey: false,
        path: path.join(path.dirname(__dirname), `../.env-${process.env.DEPLOY_TYPE || env}`)
    };
};
