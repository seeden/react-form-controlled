import React from 'react';
import Input from './Input';

export default class Textarea extends Input {
  static isElement = true;
  static propTypes = {
    name: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <textarea
        onChange={this.handleChange.bind(this)}
        disabled={this.props.disabled}
        className={this.props.className}
        name={this.props.name}
        id={this.props.id}
        rows={this.props.rows}
        required={this.props.required}
        placeholder={this.props.placeholder}
        value={this.state.value} />
    );
  }
}
