import React, { PropTypes } from 'react';
import Input from './Input';

export default class Textarea extends Input {
  static isElement = true;

  static propTypes = {
    ...Input.propTypes,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  render() {
    const { originalProps, path } = this.props;

    return (
      <textarea
        {...originalProps}
        name={path}
        onChange={this.handleChange}
        value={this.state.value} />
    );
  }
}
