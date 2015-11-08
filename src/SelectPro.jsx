import React, { PropTypes } from 'react';
import Element from './Element';

export default class Select extends Element {
  static isElement = true;
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  handleChange(value, items) {
    if (!this.props.multi) {
      this.props.onChange(value);
      return;
    }

    const values = items.map(function eachItem(item) {
      return item.value;
    });

    this.props.onChange(values);
  }

  render() {
    const { isMounted } = this.state;
    if (!isMounted) {
      return null;
    }

    const ReactSelect = require('react-select');

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
