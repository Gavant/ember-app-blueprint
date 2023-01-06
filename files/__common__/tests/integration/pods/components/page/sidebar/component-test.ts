import { render, TestContext } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import { PageSidebarArgs } from '<%= modulePrefix %>/pods/components/page/sidebar/component';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

type Context = TestContext & PageSidebarArgs;

module('Integration | Component | page/sidebar', function (hooks) {
    setupRenderingTest(hooks);

    test<Context>('it renders', async function (assert) {
        this.document = window.document;

        await render(hbs`
        <Page::Sidebar @document={{this.document}}>
            <:initial>Test</:initial>
        </Page::Sidebar>`);

        assert.strictEqual(this.element.textContent?.trim(), 'Test');

        // Template block usage:
        await render(hbs`
        <div id="application-sidebar" />
        <Page::Sidebar @document={{this.document}}>
            Test
        </Page::Sidebar>
        `);

        assert.strictEqual(this.element.textContent?.trim(), 'Test');
    });
});
