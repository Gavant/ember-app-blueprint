import { render, TestContext } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import { PageHeaderArgs } from '<%= modulePrefix %>/pods/components/page/header/component';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

type Context = TestContext & PageHeaderArgs;

module('Integration | Component | page/header', function (hooks) {
    setupRenderingTest(hooks);

    test<Context>('it renders', async function (assert) {
        this.document = window.document;

        await render(hbs`
        <Page::Header @document={{this.document}}>
            <:initial>Test</:initial>
        </Page::Header>`);

        assert.strictEqual(this.element.textContent?.trim(), 'Test');

        // Template block usage:
        await render(hbs`
        <div id="application-header" />
        <Page::Header @document={{this.document}}>
            Test
        </Page::Header>
        `);

        assert.strictEqual(this.element.textContent?.trim(), 'Test');
    });
});
