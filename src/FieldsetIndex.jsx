import React from 'react';
import ProvideProps from './ProvideProps';

export default class ProvideIndexes extends ProvideProps {
  getProps() {
    const parent = this.getParent();
    const index = Number(parent.props.name);

    return {
      index,
    };
  }

  renderEmptyChildren({ index }) {
    return (
      <span>{`${index + 1}.`}</span>
    );
  }
}
