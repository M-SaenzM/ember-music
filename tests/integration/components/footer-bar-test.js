import { module, test } from 'qunit';
import { setupRenderingTest } from 'music-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | footer-bar', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<FooterBar />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <FooterBar>
        template block text
      </FooterBar>
    `);

    assert.dom().hasText('template block text');
  });
});
