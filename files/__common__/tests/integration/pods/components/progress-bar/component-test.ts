import Service from '@ember/service';
import { render } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import LoadingBar from '<%= modulePrefix %>/services/loading-bar';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

//Stub location service
class LoadingBarStub extends Service {}

module('Integration | Component | progress-bar', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:loading-bar', LoadingBarStub);
    });

    test('Hidden by default', async function (assert) {
        await render(hbs`<ProgressBar/>`);

        assert.dom('.app-progress-bar').hasNoClass('is-shown');
    });

    test('Visible if isShown is true', async function (assert) {
        const loadingBar = this.owner.lookup('service:loading-bar') as LoadingBar;
        loadingBar.isShown = true;
        await render(hbs`<ProgressBar/>`);

        assert.dom('.app-progress-bar').hasClass('is-shown');
    });

    test('Light progress bar works', async function (assert) {
        await render(hbs`<ProgressBar @light={{true}}/>`);

        assert.dom('.app-progress-bar').hasClass('light');
    });
});
