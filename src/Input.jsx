import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Element from './Element';
import wait from './utils/wait';

function fixUncontrolledValue(value) {
  return (typeof value === 'undefined' || value === null) ? '' : value;
}

export default class Input extends Element {
  static propTypes = {
    ...Element.propTypes,
    className: PropTypes.string,
    style: PropTypes.object,
    autoComplete: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    debounce: PropTypes.number,
  };

  static defaultProps = {
    autoComplete: 'off',
    type: 'text',
  };

  static contextTypes = {
    ...Element.contextTypes,
  };

  getValue() {
    return fixUncontrolledValue(super.getValue());
  }

  @autobind
  onKeyPress(evn) {
    if (evn.key === 'Enter') {
      this.clearTimeout(true);
    }
  }

  @autobind
  onChange(evn) {
    const { target } = evn;

    let value = target.value;

    if (target.type === 'checkbox') {
      value = !!target.checked;
    } else if (target.type === 'radio' && target.checked) {
      value = this.props.value;
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

    const { type } = this.props;

    if (type === 'checkbox' || type === 'radio') {
      setTimeout(() => {
        this.setValue(value);
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
          onChange(evn);
        }
      }, 0);
    } else {
      this.setValue(value);
      const { onChange } = this.props;
      if (typeof onChange === 'function') {
        onChange(evn);
      }
    }
  }

  componentWillReceiveProps() {
    this.clearTimeout();
  }

  clearTimeout(sendValue) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // TODO validate this
    if (sendValue && this.props.value !== this.getValue()) {
      this.notifyParent(this.getValue(), this, sendValue);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.clearTimeout();
  }

  notifyParent(value, component, force) {
    const { type } = this.props;
    const debounce = this.getDebounce();

    if (!this.focused || !debounce || type === 'checkbox' || type === 'radio') {
      super.notifyParent(value, component);
      return;
    }

    this.clearTimeout();

    if (force) {
      super.notifyParent(value, component, force);
      return;
    }

    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      super.notifyParent(value, component);
    }, debounce);
  }

  @autobind
  onFocus(...args) {
    const { onFocus } = this.props;

    this.focused = true;

    if (onFocus) {
      onFocus(...args);
    }
  }

  @autobind
  onBlur(...args) {
    const { onBlur } = this.props;

    this.focused = false;
    this.clearTimeout(true);

    if (onBlur) {
      onBlur(...args);
    }
  }

  getClassName() {
    return this.props.className;
  }

  getDebounce() {
    const { debounce } = this.props;
    if (typeof debounce !== 'undefined') {
      return debounce;
    }

    return this.getForm().props.debounce;
  }

  render() {
    const {
      type,
      debounce,
      value: originalValue,
      ...rest
    } = this.props;

    let value = this.getValue();

    const checked = (type === 'checkbox' && value)
      || (type === 'radio' && value === originalValue);

    if (type === 'radio' && originalValue) {
      value = originalValue;
    }

    const isCheckbox = type === 'checkbox' || type === 'radio';

    return (
      <input
        {...rest}
        className={this.getClassName()}
        type={type}
        value={value}
        checked={isCheckbox ? checked : undefined}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyPress={this.onKeyPress}
      />
    );
  }
}
