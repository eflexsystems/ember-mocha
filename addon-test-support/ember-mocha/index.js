/* globals mocha */

import { loadTests } from './test-loader';
import setupTest from 'ember-mocha/setup-test';
import setupRenderingTest from 'ember-mocha/setup-rendering-test';
import setupApplicationTest from 'ember-mocha/setup-application-test';
import { setResolver, resetOnerror } from '@ember/test-helpers';
import Ember from 'ember';

/**
  Ensures that `Ember.testing` is set to `true` before each test begins
  (including `before` / `beforeEach`), and reset to `false` after each test is
  completed. This is done via `beforeEach` and `afterEach`.
 */
export function setupEmberTesting() {
  beforeEach(function() {
    Ember.testing = true;
  });

  afterEach(function() {
    Ember.testing = false;
  });
}

function setupMocha(options) {
  mocha.setup(options || {});
}

/**
 * Instruct Mocha to start the tests.
 */
export function startTests() {
  mocha.run();
}

export function setupTestContainer() {
  let currentLocation = new URL(document.location);
  let params = currentLocation.searchParams;
  if (params.has('container_hidden')) {
    document.querySelector('#hide-container').checked = true;
    document.querySelector('#ember-testing-container').classList.add('hidden');
  }
  if (params.has('container_zoomed')) {
    document.querySelector('#zoom-container').checked = true;
    document.querySelector('#ember-testing-container').classList.add('zoomed');
  }
  document.querySelector('#hide-container').addEventListener('change', ({ target }) => {
    document.querySelector('#ember-testing-container').classList.toggle('hidden');
    if (target.checked) {
      params.set('container_hidden', 'true');
    } else {
      params.delete('container_hidden');
    }
    window.history.replaceState('', document.title, currentLocation.toString())
  });
  document.querySelector('#zoom-container').addEventListener('change', ({ target }) => {
    document.querySelector('#ember-testing-container').classList.toggle('zoomed');
    if (target.checked) {
      params.set('container_zoomed', 'true');
    } else {
      params.delete('container_zoomed');
    }
    window.history.replaceState('', document.title, currentLocation.toString())
  });
}

/**
 * @method start
 * @param {Object} [options] Options to be used for enabling/disabling behaviors
 * @param {Boolean} [options.loadTests] If `false` tests will not be loaded automatically.
 * @param {Boolean} [options.startTests] If `false` tests will not be automatically started
 * (you must run `startTests()` to kick them off).
 */
export function start(options = {}) {
  setupMocha('bdd');

  afterEach(function() {
    resetOnerror();
  });

  if (options.loadTests !== false) {
    loadTests();
  }

  if (options.setupTestContainer !== false) {
    setupTestContainer();
  }

  if (options.startTests !== false) {
    startTests();
  }
}

export {
  setupTest,
  setupRenderingTest,
  setupApplicationTest,
  setResolver,
};
