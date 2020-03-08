'use strict';

module.exports = function(environment) {
    let ENV = {
        modulePrefix: '<%= modulePrefix %>',
        podModulePrefix: '<%= modulePrefix %>/pods',
        environment,
        //@see https://blog.emberjs.com/2016/04/28/baseurl ("Configuring the Router" section)
        rootURL: '/',
        routerRootURL: process.env.ROOT_URL,
        locationType: 'auto',
        EmberENV: {
            LOG_STACKTRACE_ON_DEPRECATION: false,
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
            },
            EXTEND_PROTOTYPES: {
                // Prevent Ember Data from overriding Date.parse.
                Date: false
            }
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },

        fontawesome: {
            defaultPrefix: 'fal' // light icons
        },

        'ember-cli-notifications': {
            autoClear: true,
            clearDuration: 3500
        },

        'ember-error-tracker': {
            maxLogStackSize: 10,
            events: false,
            listeners: {
                window: true,
                ember: {
                    rsvp: true,
                    ember: true,
                    actions: true
                }
            },
            consumers: {
                console: true,
                api: false
            }
        },

        fastboot: {
            hostWhitelist: [new RegExp(process.env.FASTBOOT_WHITELIST_DOMAIN), /^localhost:\d+$/]
        },

        //deployment environment-specific variables
        apiBaseUrl: process.env.API_BASE_URL,
        cognito: {
            userPoolWebClientId: process.env.COGNITO_POOL_CLIENT_ID,
            userPoolId: process.env.COGNITO_POOL_ID,
            region: process.env.COGNITO_REGION,
            cookieStorage: {
                //TODO we could probably eventually set these cookie configs dynamically
                //using `window.location` in the browser, and `fastboot.request` in fastboot
                domain: process.env.COGNITO_COOKIE_DOMAIN,
                path: process.env.COGNITO_COOKIE_PATH,
                expires: 365,
                secure: false
            }
        }
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
        ENV.APP.autoboot = false;
    }

    if (environment === 'production') {
        // here you can enable a production-specific feature

        //error logging
        ENV['ember-error-tracker'].consumers.console = false;
        ENV['ember-error-tracker'].consumers.api = {
            endPoint: `${process.env.API_BASE_URL}/${process.env.API_ERRORS_ENDPOINT}`
        };

        //candidate/prod should ALWAYS be on https, so hard-code that
        ENV.cognito.cookieStorage.secure = true;
    }

    return ENV;
};
