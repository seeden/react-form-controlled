import Button from './Button';

export default class Down extends Button {
  static defaultProps = {
    text: 'Remove',
  };

  async process() {
    return this.getParent().down();
  }
}
