import PropTypes from 'prop-types';
import Element from './Element';
import wait from './utils/wait';

export default class Button extends Element {
  static propTypes = {
    render: PropTypes.func,
    text: PropTypes.string,
    children: PropTypes.func,
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
    const { children, render } = this.props;
    const newProps = {
      onClick: this.onClick,
    };

    if (typeof children === 'function') {
      return this.replaceChildren(children(newProps));
    } if (typeof render === 'function') {
      return this.replaceChildren(render(newProps));
    }

    throw new Error('You need to set property render or children as function');
  }
}
