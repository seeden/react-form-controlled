import React, { PropTypes } from 'react';
import Element from './Element';
import { autobind } from 'core-decorators';

function fixUncontrolledValue(value) {
  return (typeof value === 'undefined' || value === null) ? '' : value;
}

export default class Input extends Element {
  static propTypes = {
    ...Element.propTypes,
    autoComplete: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    autoComplete: 'off',
    type: 'text',
  };

  getValue() {
    return fixUncontrolledValue(super.getValue());
  }

  @autobind
  onChange(evn) {
    const { target } = evn;

    let value = target.value;

    if (target.type === 'checkbox') {
      value = !!target.checked;
    } else if (target.type === 'radio' && target.checked) {
      value = this.props.originalValue;
    } else if (target.type === 'number') {
      const fixedValue = value
        .replace(',', '.')
        .replace(' ', '');

      // fix decimal numbers
      const numberValue = Number(fixedValue);
      if (numberValue.toString() === fixedValue) {
        value = numberValue;
      }
    }

    this.setValue(value);

    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(evn);
    }
  }

  render() {
    const value = this.getValue();
    const { type, path, originalValue } = this.props;
    const checked = (type === 'checkbox' && value)
      || (type === 'radio' && value === originalValue);

    return (
      <input
        {...this.props}
        name={path}
        onChange={this.onChange}
        checked={checked || void 0}
        value={value}
      />
    );
  }
}
