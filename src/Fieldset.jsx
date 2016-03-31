import React, { PropTypes, cloneElement, createElement } from 'react';
import Element from './Element';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import set from 'lodash/set';
import get from 'lodash/get';
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
    tagName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    map: true,
    tagName: 'fieldset',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this;

    return (!this.smartUpdate
      || props.errors !== nextState.errors
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

  registerChildren(children, topLevel) {
    this.smartUpdate = true;

    const { value, map } = this.props;

    if (topLevel && map && isArray(value)) {
      const { tagName, childTagName } = this.props;
      const childTag = tagName === 'tbody' ? 'tr' : childTagName;

      const subChildren = childTag === 'tr' && children && children.type === 'tr'
        ? children.props.children
        : children;

      return value.map((val, itemIndex) => {
        return this.registerChildren((
          <Fieldset name={itemIndex} key={itemIndex} index={itemIndex} tagName={childTag}>
            {subChildren}
          </Fieldset>
        ));
      });
    }

    let indexes = this.props.indexes || [];

    return traverse(children, (child) => {
      // support for extend
      if (child && child.type && child.props && child.props.name && child.props.extend) {
        const { name, valueIndex } = child.props;
        const currentPath = this.buildPath(name);

        this.disableSmartUpdate(name);

        if (typeof child.props.index !== 'undefined') {
          indexes = [...indexes, child.props.index];
        }

        return cloneElement(child, {
          extend: {
            originalProps: child.props,
            value: this.getValue(name),
            originalValue: valueIndex ? this.props.index : child.props.value,
            form: this.props.form || this,
            errors: this.props.errors,
            parent: this,
            path: currentPath,
            indexes,
            onChange: (newValue, component) => this.setValue(name, newValue, component),
          },
        });
      }

      if (!isFunction(child.type) || !child.type.isElement) {
        return void 0;
      }

      const { name, valueIndex, childTransform } = child.props;
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
        errors: this.props.errors,
        parent: this,
        path: currentPath,
        indexes,
        onChange: (newValue, component) => this.setValue(name, newValue, component),
      };

      return childTransform
        ? cloneElement(child, newProps, this.registerChildren(child.props.children))
        : cloneElement(child, newProps);
    }, (child) => {
      const updatedChild = extendChild(child, this);
      if (updatedChild !== child) {
        return updatedChild;
      }

      const { replace } = this.getFormProps();
      if (!replace || (child.props && child.props.replace === false)) {
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
      } else if (child.type === 'tbody' && child.props.name) {
        return <Fieldset tagName="tbody" {...child.props} />;
      }
    });
  }

  render() {
    const children = this.registerChildren(this.props.children, true);
    const { tagName, className, style, path } = this.props;

    return createElement(tagName, {
      className,
      style,
      path,
    }, children);
  }
}
