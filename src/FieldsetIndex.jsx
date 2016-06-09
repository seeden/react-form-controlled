import React, { PropTypes } from 'react';
import Element from './Element';

export default class FieldsetIndex extends Element {
  static propTypes = {
    ...Element.propTypes,
    format: PropTypes.func,
  };

  static defaultProps = {
    name: '.',
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { props } = this;

    const oldFormat = props.format;
    const oldIndex = props.parent.props.index;

    const newFormat = nextProps.format;
    const newIndex = nextProps.parent.props.index;

    if (!!oldFormat !== !!newFormat) {
      return true;
    }

    if (oldFormat && newFormat && oldFormat(oldIndex) !== newFormat(newIndex)) {
      return true;
    }

    return super.shouldComponentUpdate(nextProps, nextState);
  }

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
