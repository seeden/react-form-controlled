import React from 'react';
import Element from './Element';

export default class SelectPro extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
  };

  handleChange(value, items) {
    if (!this.props.multi) {
      this.props.onChange(value);
      return;
    }

    const values = items.map((item) => item.value);
    this.props.onChange(values);
  }

  getReactSelect() {
    const creator = require('react-select');
    return creator.default ? creator.default : creator;
  }

  render() {
    const ReactSelect = this.getReactSelect();

    return (
      <ReactSelect {...this.props} onChange={this.handleChange.bind(this)} />
    );
  }
}
