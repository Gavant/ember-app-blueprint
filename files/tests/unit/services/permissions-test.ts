import { setupTest } from 'ember-qunit';

import PermissionsService from '<%= modulePrefix %>/services/permissions';
import { module, test } from 'qunit';

module('Unit | Service | permissions', function (hooks) {
    setupTest(hooks);

    test('Custom parse works', function (assert) {
        const service = this.owner.lookup('service:permissions') as PermissionsService;
        const abilityName = 'user';
        const propertyName = 'edit';
        const test = service.parse(`${abilityName}.${propertyName}`);
        assert.deepEqual(test, { abilityName, propertyName });
    });
});
