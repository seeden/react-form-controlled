import React from 'react';
import Element from './Element';

export default class SelectPro extends Element {
  static isElement = Element.isElement;

  static propTypes = {
    ...Element.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value, items) {
    if (!this.props.multi) {
      this.props.onChange(value, this);
      return;
    }

    const values = items.map((item) => item.value);
    this.props.onChange(values, this);
  }

  getReactSelect() {
    const creator = require('react-select');
    return creator.default ? creator.default : creator;
  }

  render() {
    const ReactSelect = this.getReactSelect();

    return (
      <ReactSelect {...this.props} onChange={this.handleChange} />
    );
  }
}
