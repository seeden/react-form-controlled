import React from 'react';
import PropTypes from 'prop-types';
import Element from './Element';

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
    group: PropTypes.string,
  };

  static defaultProps = {
    autoComplete: 'off',
    type: 'text',
    group: undefined,
  };

  static contextTypes = {
    ...Element.contextTypes,
  };

  getValue() {
    return fixUncontrolledValue(super.getValue());
  }

  onKeyPress = (evn) => {
    if (evn.key === 'Enter') {
      this.clearTimeout(true);
    }
  }

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

  onFocus = (...args) => {
    const { onFocus } = this.props;

    this.focused = true;

    if (onFocus) {
      onFocus(...args);
    }
  }

  onBlur = (...args) => {
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

  getGroupName(group) {
    if (!group) {
      return undefined;
    }

    return this.getPathByName(group);
  }

  render() {
    const {
      name, // radio button must be without name
      group, // group name of the radio button
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
    const isRadio = type === 'radio';
    const newName = isRadio ? this.getGroupName(group) : undefined;

    return (
      <input
        {...rest}
        name={newName}
        className={this.getClassName()}
        type={type}
        value={value}
        checked={isCheckbox ? checked : undefined}
        onChange={(...args) => this.onChange(...args)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyPress={this.onKeyPress}
      />
    );
  }
}
