import React, { PropTypes } from 'react';
import Element from './Element';
import { autobind } from 'core-decorators';

function fixUncontrolledValue(value) {
  return (typeof value === 'undefined' || value === null) ? '' : value;
}

function clearProps(props) {
  const newProps = {
    ...props,
  };

  delete newProps.debaunce;
  delete newProps.parent;
  delete newProps.originalValue;
  delete newProps.valueIndex;

  return newProps;
}

export default class Input extends Element {
  static propTypes = {
    ...Element.propTypes,
    autoComplete: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    debaunce: PropTypes.number,
  };

  static defaultProps = {
    autoComplete: 'off',
    type: 'text',
    debaunce: 500,
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

  componentWillReceiveProps(props) {
    this.clearTimeout();
    super.componentWillReceiveProps(props);
  }

  clearTimeout(sendValue) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (sendValue && this.props.value !== this.state.value) {
      this.notifiyParent(this.state.value, this, sendValue);
    }
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  notifiyParent(value, component, force) {
    const { type, debaunce } = this.props;

    if (!this.focused || !debaunce || type === 'checkbox' || type === 'radio') {
      super.notifiyParent(value, component);
      return;
    }

    this.clearTimeout();

    if (force) {
      super.notifiyParent(value, component, force);
      return;
    }

    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      super.notifiyParent(value, component);
    }, debaunce);
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
    const { className } = this.props;
    return className;
  }

  render() {
    const value = this.getValue();
    const { type, path, originalValue } = this.props;
    const checked = (type === 'checkbox' && value)
      || (type === 'radio' && value === originalValue);

    const inputProps = clearProps(this.props);

    return (
      <input
        {...inputProps}
        className={this.getClassName()}
        name={path}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyPress={this.onKeyPress}
        checked={checked || void 0}
        value={value}
      />
    );
  }
}
