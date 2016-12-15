import Button from './Button';

export default class Up extends Button {
  static defaultProps = {
    text: 'Up',
  };

  async process() {
    return await this.getParent().up();
  }
}
