import { run } from '@ember/runloop';
import {
  mocha,
  describe,
  context,
  it,
  before,
  after,
  beforeEach,
  afterEach
} from 'mocha';

import { expect } from 'chai';

describe('mocha-shim', function() {

  describe('beforeEach and afterEach', function() {
    beforeEach(function() {
      this.beforeEachRunLoop = run.currentRunLoop;
    });

    afterEach(function() {
      expect(run.currentRunLoop).to.be.ok;
    });

    it('does use the runloop', function() {
      expect(this.beforeEachRunLoop).to.be.ok;
    });
  });

  describe('before and after', function() {
    before(function() {
      this.beforeRunLoop = run.currentRunLoop;
    });

    after(function() {
      expect(run.currentRunLoop).to.be.null;
    });

    it('do not use the runloop', function() {
      expect(this.beforeRunLoop).to.be.null;
    });
  });

  it('should export global variables defined by mocha', function() {
    expect(mocha).to.equal(window.mocha);
    expect(describe).to.equal(window.describe);
    expect(context).to.equal(window.context);
    expect(it).to.equal(window.it);
    expect(before).to.equal(window.before);
    expect(after).to.equal(window.after);
    expect(beforeEach.withoutEmberRun).to.equal(window.beforeEach);
    expect(afterEach.withoutEmberRun).to.equal(window.afterEach);
  });
});
