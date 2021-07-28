/* eslint-disable no-useless-escape */
import { setupIntl } from 'ember-intl/test-support';
import { setupTest } from 'ember-qunit';

import Notification from '<%= modulePrefix %>/services/notification';
import { module, test } from 'qunit';

module('Unit | Service | notification', function (hooks) {
    setupTest(hooks);
    setupIntl(hooks);

    test('Errors with code works', function (assert) {
        const service: Notification = this.owner.lookup('service:notification');
        service.errors(
            {
                errors: [
                    {
                        code: 'test',
                        meta: {
                            entity: 'testing'
                        }
                    }
                ]
            },
            { clearDuration: 0 }
        );
        assert.equal(service.content[0].message, 't:serverErrors.test:("meta":())');
    });

    test('Errors returns unexpected error if nothing passed in', function (assert) {
        const service: Notification = this.owner.lookup('service:notification');
        service.errors(undefined, { clearDuration: 0 });
        assert.equal(service.content[0].message, 'Sorry, an unexpected error has occurred.');
    });

    test('Group Errors works', function (assert) {
        const service: Notification = this.owner.lookup('service:notification');
        service.groupErrors(
            {
                errors: [
                    {
                        code: 'test',
                        meta: {
                            entity: 'testing'
                        }
                    },
                    {
                        code: 'test1',
                        meta: {
                            entity: 'testing1'
                        }
                    }
                ]
            },
            { clearDuration: 0 }
        );
        assert.equal(
            service.content[0].message.replace(/\s+/g, ''),
            `<div>
        <p>The following errors occurred while attempting to process your request.</p>
        <ul>
            <li>t:serverErrors.test:(\"meta\":())</li><li>t:serverErrors.test1:(\"meta\":())</li>
        </ul>
    </div>`.replace(/\s+/g, '')
        );
    });
});
