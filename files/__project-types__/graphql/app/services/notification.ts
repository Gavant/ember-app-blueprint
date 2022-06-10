import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

import NotificationService from 'ember-cli-notifications/services/notifications';
import IntlService from 'ember-intl/services/intl';

// TODO update this file w/the graphql version once error handling is completed
interface ServerError {
    // TODO
}

interface ServerErrorPayload {
    // TODO
} 

export default class Notifications extends NotificationService {
    @service declare intl: IntlService;

    /**
     * Displays toast notifications for the given server errors
     * @param {ServerErrorPayload} payload
     * @param {Object} options
     */
    errors(payload?: ServerErrorPayload, options?: Record<string, unknown>) {
        const errors = payload?.errors ?? ([{ code: 'unknown.unexpected' }] as ServerError[]);

        errors.forEach((error) => {
            const message = this.intl.t(`serverErrors.${error.code}`, {
                meta: error.meta,
                defaultMessage: error.message?.detail || error.detail
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
     * Displays a single grouped toast notification for the given server errors
     * @param {ServerErrorPayload} payload
     * @param {Object} options
     */
    groupErrors(payload: ServerErrorPayload, options?: Record<string, unknown>) {
        if (!payload || isEmpty(payload.errors)) {
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
                        `${prev}<li>${this.intl.t(`serverErrors.${e.code}`, {
                            meta: e.meta,
                            defaultMessage: (e.message && e.message.detail) || e.detail
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
