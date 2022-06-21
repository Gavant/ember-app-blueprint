import { ApolloError } from '@apollo/client/errors';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

import NotificationService from 'ember-cli-notifications/services/notifications';
import IntlService from 'ember-intl/services/intl';

export default class Notifications extends NotificationService {
    @service declare intl: IntlService;

    /**
     * Displays toast notifications for the given Apollo graphql errors
     * @param {ApolloError} payload
     * @param {Object} options
     */
    errors(payload?: ApolloError, options?: Record<string, unknown>) {
        const errors = payload?.graphQLErrors ?? ([{ extensions: { code: 'unknown.unexpected' } }]);

        errors.forEach((error) => {
            const message = this.intl.t(`serverErrors.${error.extensions.code}`, {
                defaultMessage: error.message
            });
            this.addNotification(
                Object.assign(
                    {
                        message,
                        type: 'error'
                    },
                    options
                )
            );
        });
}

    /**
     * Displays a single grouped toast notification for the given Apollo graphql errors
     * @param {ApolloError} payload
     * @param {Object} options
     */
    groupErrors(payload?: ApolloError, options?: Record<string, unknown>) {
        if (!payload || isEmpty(payload.graphQLErrors)) {
            return this.errors(payload, options);
        }

        const errors = payload.errors;
        const heading = options?.groupHeading || this.intl.t('serverErrors.heading', { count: errors.length });
        const message = `
        <div>
            <p>${heading}</p>
            <ul>
                ${errors.reduce(
                    (prev, e) =>
                        `${prev}<li>${this.intl.t(`serverErrors.${e.extensions.code}`, {
                            meta: e.meta,
                            defaultMessage: e.message
                        })}</li>`,
                    ''
                )}
            </ul>
        </div>`;

        this.addNotification(
            Object.assign(
                {
                    message,
                    type: 'error',
                    htmlContent: true
                },
                options
            )
        );
    }
}

declare module '@ember/service' {
    interface Registry {
        notification: Notification;
    }
}
