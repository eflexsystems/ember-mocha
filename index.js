/* eslint-disable no-console, n/no-process-exit */
'use strict';

const path = require('path');
const resolvePackagePath = require('resolve-package-path');

module.exports = {
  name: require('./package').name,
  options: {
    autoImport: {
      exclude: ['mocha'],
    },
  },

  init() {
    this._super.init && this._super.init.apply(this, arguments);

    this.overrideTestCommandFilter();
    this.setTestGenerator();
  },

  postBuild() {
    this.checkPackages();
  },

  checkPackages() {
    const packages = Object.keys(this.project.addonPackages);
    if (packages.indexOf('ember-qunit') !== -1) {
      console.warn(
        '\nIt looks like you are using "ember-qunit" which can cause issues with "@eflexsystems/ember-mocha", please remove this package.\n',
      );
      process.exit(1);
    }
  },

  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/mocha/mocha.js', { type: 'test' });
    this.import('vendor/mocha/mocha.css', { type: 'test' });

    let addonOptions = this.targetOptions();
    let explicitlyDisabledStyles = addonOptions.disableContainerStyles === true;
    if (!explicitlyDisabledStyles) {
      this.import('vendor/test-container-styles.css', {
        type: 'test',
      });
    }
  },

  targetOptions() {
    if (!this._targetOptions) {
      // 1. check this.parent.options['ember-mocha']
      let targetOptions =
        this.parent.options && this.parent.options['ember-mocha'];
      // 2. check this.app.options['ember-mocha']
      targetOptions =
        targetOptions ||
        (this.app && this.app.options && this.app.options['ember-mocha']);
      this._targetOptions = targetOptions || {};
    }

    return this._targetOptions;
  },

  treeForVendor(tree) {
    const MergeTrees = require('broccoli-merge-trees');
    const Funnel = require('broccoli-funnel');
    let mochaPackagePath = resolvePackagePath('mocha', this.parent.root);
    let mochaPath = path.dirname(mochaPackagePath);

    let mochaTree = new Funnel(this.treeGenerator(mochaPath), {
      destDir: 'mocha',
      annotation: 'ember-mocha#treeForVendor',
    });

    return new MergeTrees([mochaTree, tree]);
  },

  treeForAddonTestSupport(tree) {
    // intentionally not calling _super here
    // so that can have our `import`'s be
    // import { ... } from 'ember-mocha';

    const Funnel = require('broccoli-funnel');

    let scopedInputTree = new Funnel(tree, {
      destDir: '@eflexsystems/ember-mocha',
    });

    return this.preprocessJs(scopedInputTree, '/', this.name, {
      annotation: `ember-mocha - treeForAddonTestSupport`,
      registry: this.registry,
      treeType: 'addon-test-support',
    });
  },

  overrideTestCommandFilter() {
    let TestCommand = this.project.require('ember-cli/lib/commands/test');

    TestCommand.prototype.buildTestPageQueryString = function (options) {
      let params = [];

      if (options.filter) {
        params.push(`grep=${options.filter}`);

        if (options.invert) {
          params.push('invert=1');
        }
      }

      if (options.query) {
        params.push(options.query);
      }

      return params.join('&');
    };

    TestCommand.prototype.availableOptions.push({
      name: 'invert',
      type: Boolean,
      default: false,
      description: 'Invert the filter specified by the --filter argument',
      aliases: ['i'],
    });
  },

  setTestGenerator() {
    this.project.generateTestFile = function (moduleName, tests) {
      let output = `describe('${moduleName}', function() {\n`;

      tests.forEach(function (test) {
        output += `  it('${test.name}', function() {\n`;
        if (test.passed) {
          output += '    // precompiled test passed\n';
        } else {
          output +=
            '    // precompiled test failed\n' +
            `    const error = new chai.AssertionError('${test.errorMessage}');\n` +
            '    error.stack = undefined;\n' +
            '    throw error;\n';
        }
        output += '  });\n';
      });

      output += '});\n';

      return output;
    };
  },
};
