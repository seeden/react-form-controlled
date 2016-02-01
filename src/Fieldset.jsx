import React, { PropTypes, cloneElement } from 'react';
import Element from './Element';
import isArray from 'lodash/lang/isArray';
import isFunction from 'lodash/lang/isFunction';
import set from 'lodash/object/set';
import get from 'lodash/object/get';
import forOwn from 'lodash/object/forOwn';
import traverse from './utils/traverse';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';

function extendCallbacks(child, index) {
  const props = child.props;

  if (typeof index === 'undefined' || props['data-extended']) {
    return child;
  }

  const newProps = {};
  let extendedCount = 0;

  forOwn(props, (fn, key) => {
    if (typeof fn !== 'function' || fn._extended) {
      return;
    }

    extendedCount++;

    const newFn = (...args) => fn(...args, index);
    newFn._extended = true;

    newProps[key] = newFn;
  });

  if (extendedCount) {
    newProps['data-extended'] = true;
    const newChild = cloneElement(child, newProps);
    return newChild;
  }

  return child;
}

export default class Fieldset extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
    onChange: PropTypes.func,
    map: PropTypes.bool.isRequired,
    index: PropTypes.number,
    extend: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    map: true,
    extend: false,
  };

  getValue(name) {
    const { value = {} } = this.props;

    if (typeof name === 'undefined' || name === null) {
      return value;
    }

    return get(value, name);
  }

  setValue(name, value, component) {
    const currentValue = this.props.value;
    const newState = isArray(currentValue)
      ? [...this.props.value]
      : {...this.props.value};

    set(newState, name, value);

    this.props.onChange(newState, component);
  }

  buildPath(name) {
    if (typeof name === 'undefined' || name === null) {
      return void 0;
    }

    const parentPath = this.props.path || '';

    return parentPath ? `${parentPath}.${name}` : name;
  }

  getFormProps() {
    return this.props.form.props;
  }

  _registerChildren(children, topLevel) {
    const { value, map, index, extend } = this.props;

    if (topLevel && map && isArray(value)) {
      return value.map((currentValue, index) => {
        return this._registerChildren((
          <Fieldset name={index} key={index} index={index} extend={extend}>
            {children}
          </Fieldset>
        ));
      });
    }

    const hasIndex = typeof index !== 'undefined';

    return traverse(children, (child) => {
      if (!isFunction(child.type) || !child.type.isElement) {
        return void 0;
      }

      const currentValue = this.getValue(child.props.name);
      const currentPath = this.buildPath(child.props.name);

      return cloneElement(child, {
        originalProps: child.props,
        value: typeof child.props.value !== 'undefined' ? child.props.value : currentValue,
        currentValue,
        form: this.props.form || this,
        fieldset: this,
        path: currentPath,
        onChange: (value, component) => this.setValue(child.props.name, value, component),
      });
    }, (child) => {
      const { replace, extend: formExtend } = this.getFormProps();
      if (hasIndex && extend && formExtend) {
        const updatedChild = extendCallbacks(child, index);
        if (updatedChild !== child) {
          return updatedChild;
        }
      }

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
      <fieldset name={this.props.name}>
        {children}
      </fieldset>
    );
  }
}
