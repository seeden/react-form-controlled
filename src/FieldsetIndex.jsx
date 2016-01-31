import React, { PropTypes } from 'react';
import Element from './Element';

export default class FieldsetIndex extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
    format: PropTypes.func,
  };

  static omg = 123;

  render() {
    const { format, className, fieldset } = this.props;
    const index = fieldset.props.index;

    if (typeof format === 'function') {
      return <span className={className}>{format(index)}</span>;
    }

    return <span className={className}>{`${index + 1}.`}</span>;
  }
}
