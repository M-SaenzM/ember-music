import { module, test } from 'qunit';
import { setupRenderingTest } from 'music-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | card-result-artist', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CardResultArtist />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <CardResultArtist>
        template block text
      </CardResultArtist>
    `);

    assert.dom().hasText('template block text');
  });
});
