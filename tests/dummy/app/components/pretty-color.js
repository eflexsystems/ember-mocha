import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class PrettyColor extends Component {
  @tracked _name;

  get name() {
    return this._name ?? this.args.name;
  }

  get style() {
    return 'color: ' + this.name + ';';
  }

  @action paintItBlack() {
    this._name = 'black';
    if (this.args.onPainted) {
      this.args.onPainted('black');
    }
  }
}
