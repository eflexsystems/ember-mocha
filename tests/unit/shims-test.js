import { mocha, describe, context, it, before, after, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

describe('mocha-shim', function() {
  it('should export global variables defined by mocha', function() {
    expect(mocha).to.equal(window.mocha);
    expect(describe).to.equal(window.describe);
    expect(context).to.equal(window.context);
    expect(it).to.equal(window.it);
    expect(before).to.equal(window.before);
    expect(after).to.equal(window.after);
    expect(beforeEach).to.equal(window.beforeEach);
    expect(afterEach).to.equal(window.afterEach);
  });
});
