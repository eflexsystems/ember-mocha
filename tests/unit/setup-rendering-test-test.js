import { setupRenderingTest } from '@eflexsystems/ember-mocha';
import { expect } from 'chai';
import { hbs } from 'ember-cli-htmlbars';
import { click, render } from '@ember/test-helpers';

describe('setupRenderingTest', function () {
  describe('pretty-color', function () {
    setupRenderingTest();

    it('renders with color', async function () {
      this.set('name', 'green');
      await render(hbs`<PrettyColor @name={{this.name}} />`);
      expect(this.element.textContent.trim()).to.equal('Pretty Color: green');
    });

    it('renders when using standard setters', async function () {
      this.name = 'red';
      await render(hbs`<PrettyColor @name={{this.name}} />`);
      expect(this.element.textContent.trim()).to.equal('Pretty Color: red');
    });

    it('renders a second time without', async function () {
      await render(hbs`<PrettyColor @name={{this.name}} />`);
      expect(this.element.textContent.trim()).to.equal('Pretty Color:');
    });

    it('renders a third time with', async function () {
      this.set('name', 'blue');
      expect(this.name).to.equal('blue');
      await render(hbs`<PrettyColor @name={{this.name}} />`);
      expect(this.element.textContent.trim()).to.equal('Pretty Color: blue');
    });

    it('picks up changes to variables set on the context', async function () {
      this.set('name', 'pink');
      await render(
        hbs`<PrettyColor @name={{this.name}} @onPainted={{fn (mut this.name)}} />`,
      );
      await click('button');
      expect(this.element.textContent.trim()).to.equal('Pretty Color: black');
      expect(this.name).to.equal('black');
      expect(this.name).to.equal('black');
    });

    it('picks up changes to variables set on the context with a standard setter', async function () {
      this.name = 'pink';
      await render(
        hbs`<PrettyColor @name={{this.name}} @onPainted={{fn (mut this.name)}} />`,
      );
      await click('button');
      expect(this.element.textContent.trim()).to.equal('Pretty Color: black');
      expect(this.name).to.equal('black');
    });
  });

  describe('hooks API', function () {
    let hooks = setupRenderingTest();

    it('returns hooks API', function () {
      expect(hooks).to.respondTo('beforeEach').and.to.respondTo('afterEach');
    });
  });
});
