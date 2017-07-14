import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Element from './Element';

export default class Integrate extends Element {
  static propTypes = {
    ...Element.propTypes,
    onChange: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    value: PropTypes.string,
    render: PropTypes.func,
  };

  static defaultProps = {
    onChange: 'onChange',
    value: 'value',
    render: undefined,
  };

  handleChange = (...args) => {
    this.setValue(...args);
  }

  render() {
    const { children, onChange, value, name, render } = this.props;
    const currentValue = this.getValue();

    if (typeof render === 'function') {
      return render({
        name,
        value: currentValue,
        onChange: this.handleChange,
      });
    }

    if (typeof children === 'function') {
      return children({
        name,
        value: currentValue,
        onChange: this.handleChange,
      });
    }

    const newProps = {
      name,
    };

    if (typeof onChange === 'string') {
      newProps[onChange] = this.handleChange;
    }

    if (typeof value === 'string') {
      newProps[value] = currentValue;
    }

    return cloneElement(children, newProps);
  }
}
