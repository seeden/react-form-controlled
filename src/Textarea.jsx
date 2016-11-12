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

  getClassName() {
    const { className } = this.props;
    return className;
  }

  render() {
    const { path } = this.props;

    return (
      <textarea
        {...this.props}
        className={this.getClassName()}
        name={path}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyPress={this.onKeyPress}
        value={this.state.value}
      />
    );
  }
}
