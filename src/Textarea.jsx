import React, { PropTypes } from 'react';
import Input from './Input';

export default class Textarea extends Input {
  static propTypes = {
    ...Input.propTypes,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  render() {
    const { path, debounce, type, ...rest } = this.props;
    const value = this.getValue();

    return (
      <textarea
        {...rest}
        className={this.getClassName()}
        name={path}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyPress={this.onKeyPress}
        value={value}
      />
    );
  }
}
