import { PropTypes, Children } from 'react';
import Element from './Element';

export default class If extends Element {
  static isElement = Element.isElement;

  static propTypes = {
    ...Element.propTypes,
    cond: PropTypes.func.isRequired,
    children: PropTypes.node,
    childTransform: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    childTransform: true,
  };

  render() {
    const { cond, value, children } = this.props;
    if (typeof cond !== 'function' || !children) {
      return null;
    }

    const canShow = cond(value);
    if (!canShow) {
      return null;
    }

    return Children.only(children);
  }
}
