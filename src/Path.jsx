import React from 'react';
import ProvideProps from './ProvideProps';

export default class Path extends ProvideProps {
  getProps() {
    return {
      path: this.getPath(),
    };
  }

  renderEmptyChildren({ path }) {
    return (
      <span>{path}</span>
    );
  }
}
