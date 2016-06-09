import { PropTypes, Children } from 'react';
import Element from './Element';

export default class If extends Element {
  static contextTypes = {
    ...Element.contextTypes,
  };

  static propTypes = {
    ...Element.propTypes,
    cond: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  render() {
    const { value } = this.state;
    const { cond, children, parent } = this.props;
    if (typeof cond !== 'function' || !children) {
      return null;
    }

    const canShow = cond(value);
    if (!canShow) {
      return null;
    }

    return Children.only(parent.registerChildren(children));
  }
}
