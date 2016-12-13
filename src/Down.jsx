import { autobind } from 'core-decorators';
import Remove from './Remove';

export default class Down extends Remove {
  static defaultProps = {
    text: 'Down',
  };

  @autobind
  onClick() {
    this.getParent().down();
  }
}
