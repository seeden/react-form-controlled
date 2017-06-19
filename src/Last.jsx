import PropTypes from 'prop-types';
import Element from './Element';

export default class Last extends Element {
  static propTypes = {
    render: PropTypes.func,
    children: PropTypes.node,
  };

  render() {
    const { children, render } = this.props;
    const [index] = this.getIndexes();
    const [total] = this.getTotals();

    if (total === undefined) {
      throw new Error('Total is not set for parent fieldset');
    }

    if (index < total - 1) {
      return null;
    }

    if (typeof render === 'function') {
      return this.replaceChildren(render({ index, total }));
    }

    return this.replaceChildren(children);
  }
}
