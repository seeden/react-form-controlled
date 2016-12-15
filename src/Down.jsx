import Button from './Button';

export default class Down extends Button {
  static defaultProps = {
    text: 'Remove',
  };

  async process() {
    return await this.getParent().down();
  }
}
