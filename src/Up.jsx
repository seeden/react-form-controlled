import { autobind } from 'core-decorators';
import Remove from './Remove';

export default class Up extends Remove {
  static defaultProps = {
    text: 'Down',
  };

  @autobind
  onClick() {
    this.getParent().up();
  }
}
