import { Children } from 'react';
import PropTypes from 'prop-types';
import Element from './Element';

export default class If extends Element {
  static propTypes = {
    ...Element.propTypes,
    cond: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  render() {
    const value = this.getValue();
    const { cond, children } = this.props;
    const parent = this.getParent();
    if (typeof cond !== 'function' || !children) {
      return null;
    }

    const canShow = cond(value);
    if (!canShow) {
      return null;
    }

    return Children.only(parent.processChildren(children));
  }
}
