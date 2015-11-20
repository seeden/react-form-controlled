import React, { PropTypes } from 'react';
import Element from './Element';
import isArray from 'lodash/lang/isArray';
import isFunction from 'lodash/lang/isFunction';

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export default class FormObject extends Element {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  getValue(name) {
    const value = this.props.value || {};
    return value[name];
  }

  setValue(name, value) {
    const currentValue = this.props.value;
    const newState = isArray(currentValue)
      ? [...this.props.value]
      : {...this.props.value};

    newState[name] = value;

    this.props.onChange(newState);
  }

  _registerChild(child) {
    if (!child || typeof child === 'string') {
      return child;
    }

    if (!isFunction(child.type) || !child.type.isElement) {
      if (child.props && child.props.children) {
        const children = this._registerChildren(child.props.children);
        return React.cloneElement(child, {}, children);
      }

      return child;
    }

    if (!child.props.name && child.props.name !== 0) {
      throw new Error('Form element has no name property');
    }

    const currentValue = this.getValue(child.props.name);

    return React.cloneElement(child, {
      value: typeof child.props.value !== 'undefined' ? child.props.value : currentValue,
      currentValue: currentValue,
      onChange: value => this.setValue(child.props.name, value),
    });
  }

  _registerChildren(children) {
    if (!isArray(children)) {
      return this._registerChild(children);
    }

    return React.Children.map(children, child => {
      return this._registerChild(child);
    });
  }

  render() {
    const children = this._registerChildren(this.props.children);

    return (
      <div onChange={this.handleChange.bind(this)}>
        {children}
      </div>
    );
  }

  handleChange(evn) {
    const target = evn.target;
    if (!target || !target.name) {
      return;
    }

    // IE < 10 bug catcher
    try {
      evn.stopPropagation();
    } catch (err) {
      console.log(err.message);
    }


    let value = target.type === 'checkbox'
      ? !!target.checked
      : target.value;

    if (target.type === 'number' && isNumeric(value)) {
      value = Number(value);
    }

    this.setValue(target.name, value);
  }
}
