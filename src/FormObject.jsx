import React from 'react';
import Element from './Element';
import _ from 'lodash';
import extend from 'node.extend';

export default class FormObject extends Element {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired
  };

  getValue(name) {
    const value = this.props.value || {};
    return value[name];
  }

  setValue(name, value) {
    const newState = extend({}, this.props.value);
    newState[name] = value;

    this.props.onChange(newState);
  }

  _registerChild(child) {
    if (!child || typeof child === 'string') {
      return child;
    }

    if (!_.isFunction(child.type) || !child.type.isElement) {
      if (child.props && child.props.children) {
        const children = this._registerChildren(child.props.children);
        return React.cloneElement(child, {}, children);
      }

      return child;
    }

    if (!child.props.name) {
      throw new Error('Form element has no name property');
    }

    const currentValue = this.getValue(child.props.name);

    return React.cloneElement(child, {
      value: typeof child.props.value !== 'undefined' ? child.props.value : currentValue,
      currentValue: currentValue,
      onChange: value => this.setValue(child.props.name, value)
    });
  }

  _registerChildren(children) {
    if (!_.isArray(children)) {
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

  handleChange(e) {
    const target = e.target;
    if (!target || !target.name) {
      return;
    }

    e.stopPropagation();

    const value = target.type === 'checkbox'
      ? !!target.checked
      : target.value;

    this.setValue(target.name, value);
  }
}
