import { render, TestContext } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import { PageLayoutArgs } from '<%= modulePrefix %>/pods/components/page/layout/component';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

type Context = TestContext & PageLayoutArgs;

module('Integration | Component | page/layout', function (hooks) {
    setupRenderingTest(hooks);

    test<Context>('it renders', async function (assert) {
        this.id = 'page-layout';
        this.empty = false;
        this.document = window.document;

        await render(hbs`<Page::Layout @id={{this.id}} @empty={{this.empty}} @document={{this.document}}/>`);

        assert.strictEqual(this.element.textContent?.trim(), '');

        // Template block usage:
        await render(hbs`
        <div id="page-layout"/>
        <Page::Layout @id={{this.id}} @empty={{this.empty}} @document={{this.document}}>
            template block text
        </Page::Layout>
    `);

        assert.strictEqual(this.element.textContent?.trim(), 'template block text');
    });
});
