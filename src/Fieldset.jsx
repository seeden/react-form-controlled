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
import extendChild from './utils/extendChild';

function isEmpty(value) {
  return typeof value === 'undefined' || value === null || value === '';
}

export default class Fieldset extends Element {
  static isElement = Element.isElement;

  static propTypes = {
    ...Element.propTypes,
    onChange: PropTypes.func,
    map: PropTypes.bool.isRequired,
    index: PropTypes.number,
    children: PropTypes.node,
  };

  static defaultProps = {
    map: true,
  };

  constructor(props, context) {
    super(props, context);
  }

  shouldComponentUpdate(nextProps) {
    const props = this.props;

    return (!this.smartUpdate
      || props.name !== nextProps.name
      || props.className !== nextProps.className
      || props.value !== nextProps.value
      || props.map !== nextProps.map
      || props.index !== nextProps.index);
  }

  remove(index) {
    const hasIndex = typeof this.props.index !== 'undefined';
    if (hasIndex) {
      return this.props.parent.remove(index);
    }

    const value = this.props.value;
    if (!isArray(value) || index < 0 || value.length <= index) {
      return false;
    }

    this.props.onChange([
      ...value.slice(0, index),
      ...value.slice(index + 1),
    ], this);
  }

  up(index) {
    const hasIndex = typeof this.props.index !== 'undefined';
    if (hasIndex) {
      return this.props.parent.up(index);
    }

    const value = this.props.value;
    if (!isArray(value) || index <= 0 || value.length <= index) {
      return false;
    }

    this.props.onChange([
      ...value.slice(0, index - 1),
      value[index],
      value[index - 1],
      ...value.slice(index + 1),
    ], this);
  }

  down(index) {
    return this.up(index + 1);
  }

  resolveByPath(path, callback) {
    if (path && path[0] === '.') {
      const { parent, index } = this.props;
      if (!parent) {
        return callback(new Error('Parent is undefined'));
      }

      const isIndex = typeof index !== 'undefined';
      const realParent = isIndex ? parent.props.parent : parent;

      let subPath = path.substr(1);
      if (isEmpty(subPath)) {
        subPath = `${parent.props.name}.${index}`;
      }

      if (!realParent) {
        return callback(new Error('Parent is undefined'));
      }

      return realParent.resolveByPath(subPath, callback);
    }

    return callback(null, this, path);
  }

  getValue(path) {
    if (isEmpty(path)) {
      return this.props.value;
    }

    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        return void 0;
      }

      const { value } = current.props;

      return !isEmpty(subPath) ? get(value, subPath) : value;
    });
  }

  setValue(path, value, component) {
    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        return;
      }

      const val = current.props.value;
      const newState = isArray(val) ? [...val] : {...val};

      set(newState, subPath, value);

      current.props.onChange(newState, component);
    });
  }

  buildPath(path) {
    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        return void 0;
      }

      if (isEmpty(subPath)) {
        return void 0;
      }

      const currentPath = current.props.path;
      return currentPath ? `${currentPath}.${subPath}` : subPath;
    });
  }

  getFormProps() {
    return this.props.form.props;
  }

  disableSmartUpdate(name) {
    if (!name || name[0] !== '.') {
      return;
    }

    this.smartUpdate = false;

    const { parent, index } = this.props;
    if (!parent) {
      return;
    }

    const hasIndex = typeof index !== 'undefined';
    parent.disableSmartUpdate(hasIndex ? name : name.substr(1));
  }

  _registerChildren(children, topLevel) {
    this.smartUpdate = true;

    const { value, map, index } = this.props;

    if (topLevel && map && isArray(value)) {
      return value.map((val, index) => {
        return this._registerChildren((
          <Fieldset name={index} key={index} index={index}>
            {children}
          </Fieldset>
        ));
      });
    }

    let indexes = this.props.indexes || [];

    return traverse(children, (child) => {
      if (!isFunction(child.type) || !child.type.isElement) {
        return void 0;
      }

      const { name, valueIndex, skipArray, childTransform } = child.props;
      const currentPath = this.buildPath(name);

      this.disableSmartUpdate(name);

      if (typeof child.props.index !== 'undefined') {
        indexes = [...indexes, child.props.index];
      }

      const newProps = {
        originalProps: child.props,
        value: this.getValue(name),
        originalValue: valueIndex ? this.props.index : child.props.value,
        form: this.props.form || this,
        parent: this,
        path: currentPath,
        indexes,
        onChange: (value, component) => this.setValue(name, value, component),
      };

      return childTransform
        ? cloneElement(child, newProps, this._registerChildren(child.props.children))
        : cloneElement(child, newProps);

    }, (child) => {
      const updatedChild = extendChild(child, this);
      if (updatedChild !== child) {
        return updatedChild;
      }

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
    const { className } = this.props;

    return (
      <fieldset className={className} path={this.props.path}>
        {children}
      </fieldset>
    );
  }
}
