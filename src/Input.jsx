import React, { PropTypes } from 'react';
import Element from './Element';

const DIFF_TIMEOUT = 100;

function fixUncontrolledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }

  return value;
}

export default class Input extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
    autoComplete: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    autoComplete: 'off',
    type: 'text',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: fixUncontrolledValue(props.value), // fix because null and undefined is uncontrolled
    };
  }

  _clearChangeTimeout() {
    if (!this.timeoutId) {
      return;
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  handleChange(evn) {
    const target = evn.target || {};
    const value = target.type === 'checkbox'
      ? !!target.checked
      : target.value;

    this._clearChangeTimeout();

    this.setState({
      value: value,
    });
  }

  componentWillReceiveProps(newProps) {
    const isDiff = this.state.value !== newProps.value;
    if (!isDiff) {
      return;
    }

    // wait for it
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;

      if (this.state.value === this.props.value) {
        return;
      }

      this.setState({
        value: fixUncontrolledValue(this.props.value),
      });
    }, DIFF_TIMEOUT);
  }

  componentWillUnmount() {
    this._clearChangeTimeout();
  }

  render() {
    const checked = (this.props.type === 'checkbox' && this.props.value)
      || (this.props.type === 'radio' && this.props.value === this.props.currentValue);

    return (
      <input
        autoComplete={this.props.autoComplete}
        onChange={this.handleChange.bind(this)}
        type={this.props.type}
        disabled={this.props.disabled}
        checked={checked ? checked : void 0}
        className={this.props.className}
        name={this.props.name}
        id={this.props.id}
        size={this.props.size}
        min={this.props.min}
        max={this.props.max}
        required={this.props.required}
        placeholder={this.props.placeholder}
        value={this.state.value} />
    );
  }
}
