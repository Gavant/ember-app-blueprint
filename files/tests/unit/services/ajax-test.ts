import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupTest } from 'ember-qunit';
import SessionService from 'ember-simple-auth/services/session';
import { authenticateSession } from 'ember-simple-auth/test-support';

import AjaxService from '<%= modulePrefix %>/services/ajax';
import { module, test } from 'qunit';

module('Unit | Service | ajax', function (hooks) {
    setupTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:session', SessionService);
    });

    test('Authorization headers when not authenticated', function (assert) {
        const service: AjaxService = this.owner.lookup('service:ajax');
        assert.deepEqual(service.authorizationHeaders, {});
    });

    test('Authorization headers when authenticated', async function (assert) {
        await authenticateSession({
            id: '1',
            id_token: 'asdf',
            refresh_token: 'abcd',
            expires_in: 123,
            expires_at: 123
        });
        const service: AjaxService = this.owner.lookup('service:ajax');
        assert.deepEqual(service.authorizationHeaders, {
            Authorization: 'Bearer asdf'
        });
    });
});
