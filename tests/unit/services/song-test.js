import { module, test } from 'qunit';
import { setupTest } from 'music-app/tests/helpers';

module('Unit | Service | song', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:song');
    assert.ok(service);
  });
});
