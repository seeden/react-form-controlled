import React, { PropTypes, cloneElement } from 'react';
import { autobind } from 'core-decorators';
import Element from './Element';

export default class Remove extends Element {
  static propTypes = {
    render: PropTypes.func,
    text: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  static defaultProps = {
    text: 'Remove',
  };

  @autobind
  onClick() {
    this.getParent().remove();
  }

  render() {
    const { children, render, text } = this.props;
    const newProps = {
      onClick: this.onClick,
    };

    if (typeof children === 'function') {
      return this.replaceChildren(children(newProps));
    } if (typeof render === 'function') {
      return this.replaceChildren(render(newProps));
    }

    if (!children) {
      return (
        <button type="button">{text}</button>
      );
    }

    return this.replaceChildren(cloneElement(children, newProps));
  }
}
