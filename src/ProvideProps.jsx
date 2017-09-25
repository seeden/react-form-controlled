import PropTypes from 'prop-types';
import Element from './Element';

export default class ProvideProps extends Element {
  static propTypes = {
    render: PropTypes.func,
    children: PropTypes.func,
  };

  getProps() {
    throw new Error('You need to override get props');
  }

  render() {
    const { children, render } = this.props;
    const newProps = this.getProps();

    if (typeof children === 'function') {
      return this.replaceChildren(children(newProps));
    } if (typeof render === 'function') {
      return this.replaceChildren(render(newProps));
    }

    throw new Error('You need to set property render or children as function');
  }
}
