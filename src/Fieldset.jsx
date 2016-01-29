import React, { PropTypes, cloneElement } from 'react';
import Element from './Element';
import isArray from 'lodash/lang/isArray';
import isFunction from 'lodash/lang/isFunction';
import set from 'lodash/object/set';
import get from 'lodash/object/get';
import traverse from './utils/traverse';

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
    map: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    map: true,
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

  getPath(name) {
    if (!name) {
      return void 0;
    }

    const parentPath = this.props.path || '';

    return parentPath ? `${parentPath}.${name}` : name;
  }

  getFormProps() {
    return this.props.form.props;
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

  _registerChildren(children, topLevel) {
    const { value, map } = this.props;

    if (topLevel && map && isArray(value)) {
      return value.map((value, index) => {
        return this._registerChildren((
          <Fieldset name={index} key={index} index={index}>
            {children}
          </Fieldset>
        ));
      });
    }

    return traverse(children, (child) => {
      if (!isFunction(child.type) || !child.type.isElement) {
        return void 0;
      }

      if (!child.props.name && child.props.name !== 0) {
        return cloneElement(child, {
          originalProps: child.props,
          form: this.props.form || this,
          fieldset: this,
        });
      }

      const currentValue = this.getValue(child.props.name);

      return cloneElement(child, {
        originalProps: child.props,
        value: typeof child.props.value !== 'undefined' ? child.props.value : currentValue,
        currentValue,
        form: this.props.form || this,
        fieldset: this,
        path: this.getPath(child.props.name),
        onChange: (value) => this.setValue(child.props.name, value),
      });
    }, (child) => {
      const { replace } = this.getFormProps();
      if (!replace) {
        return void 0;
      }

      if (child.type === 'input') {
        return <Input {...child.props} />;
      } else if (child.type === 'select') {
        return <Select {...child.props} />;
      } else if (child.type === 'textarea') {
        return <Textarea {...child.props} />;
      } else if (child.type === 'fieldset' && child.props.name) {
        return <Fieldset {...child.props} />;
      }
    });
  }

  render() {
    const children = this._registerChildren(this.props.children, true);

    return (
      <fieldset onChange={this.handleChange.bind(this)} name={this.props.name}>
        {children}
      </fieldset>
    );
  }
}
