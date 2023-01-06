import { setupTest } from 'ember-qunit';

import ApplicationController from '<%= modulePrefix %>/pods/application/controller';
import { module, test } from 'qunit';

module('Unit | Controller | application', function (hooks) {
    setupTest(hooks);

    test('Notification position is set', function (assert) {
        const controller = this.owner.lookup('controller:application') as ApplicationController;
        assert.ok(controller.notificationPosition);
    });
});
