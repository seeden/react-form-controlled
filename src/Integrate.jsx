import { PropTypes, cloneElement } from 'react';
import Element from './Element';

export default class Integrate extends Element {
  static propTypes = {
    ...Element.propTypes,
    children: PropTypes.node,
    onChange: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    value: PropTypes.string,
  };

  static defaultProps = {
    onChange: 'onChange',
    value: 'value',
  };

  render() {
    const { children, onChange, originalValue, name } = this.props;
    const newProps = {
      name,
    };

    if (typeof onChange === 'string') {
      newProps[onChange] = this.setValue;
    }

    if (originalValue) {
      newProps[originalValue] = this.getValue();
    }

    return cloneElement(children, newProps);
  }
}
