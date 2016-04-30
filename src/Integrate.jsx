import React, { PropTypes, cloneElement } from 'react';
import Element from './Element';

export default class Integrate extends Element {
  static isElement = Element.isElement;

  static propTypes = {
    ...Element.propTypes,
    children: PropTypes.node,
    // todo remove originalProps and add new props as additional variable
    /*
    onChange: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    value: PropTypes.string,*/
  };

  static defaultProps = {
    onChange: true,
  };

  render() {
    const { children, originalProps = {}, onChange, value } = this.props;
    const { onChange: onChangeOriginal, value: originalValue } = originalProps;

    const newProps = {};

    if (onChangeOriginal !== false) {
      const onChangePropName = onChangeOriginal === 'string'
        ? onChangeOriginal
        : 'onChange';

      newProps[onChangePropName] = (newValue) => onChange(newValue, this);
    }

    if (originalValue) {
      newProps[originalValue] = value;
    }

    return cloneElement(children, newProps);
  }
}
