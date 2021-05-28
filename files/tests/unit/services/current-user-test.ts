import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupTest } from 'ember-qunit';

import CurrentUserService from '<%= modulePrefix %>/services/current-user';
import { module, test } from 'qunit';

module('Unit | Service | current-user', function (hooks) {
    setupTest(hooks);
    setupMirage(hooks);

    test('Loading the current user works', async function (assert) {
        this.server.create('user', { id: '1', firstName: 'Emma', lastName: 'Baker' });
        const service: CurrentUserService = this.owner.lookup('service:current-user');
        await service.load();
        assert.ok(service.user);
    });
});
