import { setupTest } from 'ember-qunit';

import LoadingBar from '<%= modulePrefix %>/services/loading-bar';
import { module, test } from 'qunit';

module('Unit | Service | loading-bar', function (hooks) {
    setupTest(hooks);

    test('Show/Hide work', function (assert) {
        const service: LoadingBar = this.owner.lookup('service:loading-bar');

        service.show();
        assert.equal(service.isShown, true);

        service.hide();
        assert.equal(service.isShown, false);
    });
});
