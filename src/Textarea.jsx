import React, { PropTypes } from 'react';
import Input from './Input';

export default class Textarea extends Input {
  static contextTypes = {
    ...Input.contextTypes,
  };

  static isElement = Input.isElement;

  static propTypes = {
    ...Input.propTypes,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  render() {
    const { path } = this.props;

    return (
      <textarea
        {...this.props}
        name={path}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        value={this.state.value}
      />
    );
  }
}
