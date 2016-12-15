import React from 'react';
import ProvideProps from './ProvideProps';

export default class Value extends ProvideProps {
  getProps() {
    return {
      value: this.getValue(),
    };
  }

  renderEmptyChildren({ value }) {
    return (
      <span>{value}</span>
    );
  }
}
