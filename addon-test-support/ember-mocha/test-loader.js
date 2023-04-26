import AbstractTestLoader from 'ember-cli-test-loader/test-support/index';

export class TestLoader extends AbstractTestLoader {
  shouldLoadModule(moduleName) {
    return !moduleName.match(/^ember-mocha\//) && moduleName.match(/[-_]test$/);
  }

  moduleLoadFailure(moduleName, error) {
    describe('TestLoader Failures', function() {
      it(moduleName + ': could not be loaded', function() {
        throw error;
      });
    });
  }
}

/**
 * Load tests following the default patterns:
 *
 * - The module name ends with `-test` or `_test`
 */
export function loadTests() {
  new TestLoader().loadModules();
}
