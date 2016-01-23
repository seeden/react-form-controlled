import React, { PropTypes } from 'react';
import Element from './Element';
import isArray from 'lodash/lang/isArray';
import isFunction from 'lodash/lang/isFunction';
import set from 'lodash/object/set';
import get from 'lodash/object/get';

import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export default class Fieldset extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
    onChange: PropTypes.func,
  };

  getValue(name) {
    const value = this.props.value || {};
    return get(value, name);
  }

  setValue(name, value) {
    const currentValue = this.props.value;
    const newState = isArray(currentValue)
      ? [...this.props.value]
      : {...this.props.value};

    set(newState, name, value);

    this.props.onChange(newState);
  }

  getFormProps() {
    return this.props.form.props;
  }

  _registerChild(child) {
    const { replace } = this.getFormProps();

    if (!child || typeof child === 'string') {
      return child;
    }

    if (replace) {
      if (child.type === 'input') {
        return this._registerChild(<Input {...child.props} />);
      } else if (child.type === 'select') {
        return this._registerChild(<Select {...child.props} />);
      } else if (child.type === 'textarea') {
        return this._registerChild(<Textarea {...child.props} />);
      } else if (child.type === 'fieldset' && child.props.name) {
        return this._registerChild(<Fieldset {...child.props} />);
      }
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
      originalProps: child.props,
      value: typeof child.props.value !== 'undefined' ? child.props.value : currentValue,
      currentValue: currentValue,
      form: this.props.form || this,
      path: child.props.path || this.getPath(child.props.name),
      onChange: (value) => this.setValue(child.props.name, value),
    });
  }

  getPath(name) {
    if (!name) {
      return void 0;
    }

    const parentPath = this.props.path || '';

    return parentPath ? `${parentPath}.${name}` : name;
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
      <fieldset onChange={this.handleChange.bind(this)}>
        {children}
      </fieldset>
    );
  }

  handleChange(evn) {
    const target = evn.target;
    if (!target) {
      return;
    }

    const propertyName = target.getAttribute('data-property');
    if (!propertyName) {
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
      // fix decimal numbers
      const numberValue = Number(value);
      if (numberValue.toString() === value) {
        value = numberValue;
      }
    }

    this.setValue(propertyName, value);
  }
}
