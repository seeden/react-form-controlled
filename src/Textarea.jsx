import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

export default class Textarea extends Input {
  static propTypes = {
    ...Input.propTypes,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  render() {
    const { path, debounce, type, group, ...rest } = this.props;
    const value = this.getValue();

    return (
      <textarea
        {...rest}
        className={this.getClassName()}
        name={path}
        onChange={(...args) => this.onChange(...args)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyPress={this.onKeyPress}
        value={value}
      />
    );
  }
}
