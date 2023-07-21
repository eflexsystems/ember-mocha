import { setupApplicationTest } from '@eflexsystems/ember-mocha';
import { expect } from 'chai';
import { setApplication, visit } from '@ember/test-helpers';
import Application from '../../app';
import config from '../../config/environment';

describe('setupApplicationTest', function () {
  setApplication(
    Application.create(Object.assign({}, config.APP, { autoboot: false })),
  );

  this.timeout(5000);

  describe('acceptance test', function () {
    setupApplicationTest();

    it('can visit subroutes', async function () {
      await visit('/');
      expect(this.element.querySelector('h1').textContent.trim()).to.equal(
        'test',
      );

      await visit('/foo');
      expect(this.element.querySelector('h2').textContent.trim()).to.be.equal(
        'this is an acceptance test',
      );
    });
  });

  describe('hooks API', function () {
    let hooks = setupApplicationTest();

    it('returns hooks API', function () {
      expect(hooks).to.respondTo('beforeEach').and.to.respondTo('afterEach');
    });
  });
});
