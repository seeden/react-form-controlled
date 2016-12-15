import Button from './Button';

export default class Remove extends Button {
  static defaultProps = {
    text: 'Remove',
  };

  async process() {
    return await this.getParent().remove();
  }
}
