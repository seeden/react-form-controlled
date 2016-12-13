import React, { PropTypes, cloneElement } from 'react';
import Element from './Element';

export default class Path extends Element {
  static propTypes = {
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  render() {
    const { children, render } = this.props;
    const parent = this.getParent();
    const newProps = {
      path: parent.getPath(),
    };

    if (typeof children === 'function') {
      return this.replaceChildren(children(newProps));
    } if (typeof render === 'function') {
      return this.replaceChildren(render(newProps));
    }

    if (!children) {
      return null;
    }

    return this.replaceChildren(cloneElement(children, newProps));
  }
}
