import React, { PropTypes, cloneElement } from 'react';
import Element from './Element';
import wait from './utils/wait';

export default class Button extends Element {
  static propTypes = {
    render: PropTypes.func,
    text: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  static defaultProps = {
    text: 'Button',
  };

  async process() {
    throw new Error('You need to implement process');
  }

  onClick = async (...args) => {
    const result = await this.process();
    if (typeof result === 'undefined') {
      return;
    }

    const { onClick } = this.props;
    if (onClick) {
      await wait(0);
      onClick(...args, result);
    }
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
