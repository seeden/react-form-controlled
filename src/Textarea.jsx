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
    const { originalProps, path, name } = this.props;

    return (
      <textarea
        {...originalProps}
        name={path}
        data-property={name}
        onChange={this.handleChange.bind(this)}
        value={this.state.value} />
    );
  }
}
