import React, { PropTypes, cloneElement } from 'react';
import Element from './Element';

export default class ProvideProps extends Element {
  static propTypes = {
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  getProps() {
    throw new Error('You need to override get props');
  }

  renderEmptyChildren(newProps) {
    return null;
  }

  render() {
    const { children, render } = this.props;
    const newProps = this.getProps();

    if (typeof children === 'function') {
      return this.replaceChildren(children(newProps));
    } if (typeof render === 'function') {
      return this.replaceChildren(render(newProps));
    }

    if (!children) {
      return this.renderEmptyChildren(newProps);
    }

    return this.replaceChildren(cloneElement(children, newProps));
  }
}
