import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Element from './Element';

export default class Integrate extends Element {
  static propTypes = {
    ...Element.propTypes,
    render: PropTypes.func,
  };

  static defaultProps = {
    render: undefined,
  };

  handleChange = (...args) => {
    this.setValue(...args);
  }

  render() {
    const { children, name, render } = this.props;
    const currentValue = this.getValue();
    const newProps = {
      name,
      value: currentValue,
      onChange: this.handleChange,
    };

    if (typeof render === 'function') {
      return render(newProps);
    } else if (typeof children === 'function') {
      return children(newProps);
    }

    throw new Error('You need to set property render or children as function');
  }
}
