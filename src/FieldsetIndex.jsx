import React, { PropTypes } from 'react';
import Element from './Element';

export default class FieldsetIndex extends Element {
  static contextTypes = {
    ...Element.contextTypes,
  };

  static isElement = Element.isElement;

  static propTypes = {
    ...Element.propTypes,
    format: PropTypes.func,
  };

  static defaultProps = {
    name: '.',
  };

  render() {
    const parent = this.getParent();
    const index = parent.props.index;
    const { format, className } = this.props;

    if (typeof format === 'function') {
      return <span className={className}>{format(index)}</span>;
    }

    return <span className={className}>{`${index + 1}.`}</span>;
  }
}
