import ReactSelect from 'react-select';
import React from 'react';
import Element from './Element';

export default class Select extends Element {
  static isElement = true;
  static propTypes = {
    name: React.PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  handleChange(value, items) {
    if (!this.props.multi) {
      this.props.onChange(value);
      return;
    }

    const values = items.map(function(item) {
      return item.value;
    });

    this.props.onChange(values);
  }

  render() {
    return (
      <ReactSelect
        name={this.props.name}
        value={this.props.value}
        multi={!!this.props.multi}
        options={this.props.options}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}
        onChange={this.handleChange.bind(this)} />
    );
  }
}
