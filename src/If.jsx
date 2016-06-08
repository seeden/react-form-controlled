import { PropTypes, Children } from 'react';
import Element from './Element';

export default class If extends Element {
  static contextTypes = {
    ...Element.contextTypes,
  };

  static isElement = false; // need to process children

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
    const value = this.getValue();
    const { cond, children } = this.props;
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
