import { expect } from 'chai';

function tryMochaSpecifier(fn) {
  try {
    fn();
    return null;
  } catch (e) {
    return e;
  }
}

///////////////////////////////////////////////////////////////////////////////

describe('it', function () {
  it('works with synchronous tests', function () {
    expect(true).to.equal(true);
  });

  it('works with asynchronous tests using callbacks', function (done) {
    setTimeout(function () {
      expect(true).to.equal(true);
      done();
    }, 10);
  });

  it('works with asynchronous tests using promises', function () {
    return new Promise(function (resolve) {
      setTimeout(function () {
        expect(true).to.equal(true);
        resolve();
      }, 10);
    });
  });

  const pendingError = tryMochaSpecifier(function () {
    it('is a pending spec');
  });

  it('does not throw errors when you mark a pending spec', function () {
    expect(pendingError).to.be.null;
    const pendingSpec = window.mocha.suite.suites.find(function (suite) {
      return suite.tests.find(function (test) {
        return test.title === 'is a pending spec';
      });
    });
    expect(pendingSpec).to.be.ok;
  });

  // it('correctly sets mocha grep options for runing a single test case with.only', function() {
  //   expect(mochaGrep).to.match(/it runs this test/);
  // });

  // const mochaGrep = grepFor(function() {
  //   it.only('runs this test');
  // });

  const skippedError = tryMochaSpecifier(function () {
    it.skip('is a skipped spec');
  });

  it('skips tests with the .skip modifier', function () {
    expect(skippedError).to.be.null;
    const pendingSpec = window.mocha.suite.suites.find(function (suite) {
      return suite.tests.find(function (test) {
        return test.title === 'is a skipped spec';
      });
    });
    expect(pendingSpec).to.exist;
  });

  const callback = function () {
    expect(callback.toString()).to.equal(wrapper.fn.toString());
  };

  const wrapper = it('testing test report string representation', callback);
});
