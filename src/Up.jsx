import Button from './Button';

export default class Up extends Button {
  static defaultProps = {
    text: 'Up',
  };

  async process() {
    return this.getParent().up();
  }
}
