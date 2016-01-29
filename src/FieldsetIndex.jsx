import React, { PropTypes } from 'react';
import Element from './Element';

export default class FieldsetIndex extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
    name: PropTypes.string,
  };

  render() {
    const { fieldset, value, className } = this.props;
    const index = fieldset.props.index;

    if (typeof value === 'function') {
      return <span className={className}>{value(index)}</span>;
    }

    return <span className={className}>{value ? value : `${index + 1}.`}</span>;
  }
}
