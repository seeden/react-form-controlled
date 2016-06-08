import React, { PropTypes, createElement } from 'react';
import Element from './Element';
import isArray from 'lodash/isArray';
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

  static childContextTypes = {
    parent: PropTypes.object.isRequired,
  };

  static contextTypes = {
    parent: PropTypes.object.isRequired,
  };

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

  getChildContext() {
    return {
      parent: this,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props } = this;

    if (!this.smartUpdate) {
      return false;
    }

    const value = this.getValue();
    if (value !== nextState.value) {
      return true;
    }

    if (props.name !== nextProps.name) {
      return true;
    } else if (props.className !== nextProps.className) {
      return true;
    } else if (props.map !== nextProps.map) {
      return true;
    } else if (props.index !== nextProps.index) {
      return true;
    }

    return false;
/*
    return (!this.smartUpdate
      || props.errors !== nextProps.errors
      || state.errors !== nextState.errors
      || props.name !== nextProps.name
      || props.className !== nextProps.className
      || props.value !== nextProps.value
      || props.map !== nextProps.map
      || props.index !== nextProps.index);*/
  }

  remove(index) {
    if (typeof index === 'undefined') {
      if (!this.isIndex()) {
        throw new Error('This is not an array');
      }

      const parent = this.getParent();
      return parent.remove(this.props.index);
    }

    const value = this.getValue();
    if (!isArray(value) || index < 0 || value.length <= index) {
      return false;
    }

    this.setValue(void 0, [
      ...value.slice(0, index),
      ...value.slice(index + 1),
    ]);

    return true;
  }

  up(index) {
    if (typeof index === 'undefined') {
      if (!this.isIndex()) {
        throw new Error('This is not an array');
      }

      const parent = this.getParent();
      return parent.up(this.props.index);
    }

    const value = this.getValue();
    if (!isArray(value) || index <= 0 || value.length <= index) {
      return false;
    }

    const newValue = [
      ...value.slice(0, index - 1),
      value[index],
      value[index - 1],
      ...value.slice(index + 1),
    ];

    this.setValue(void 0, newValue);

    return true;
  }

  down(index) {
    if (typeof index === 'undefined') {
      if (!this.isIndex()) {
        throw new Error('This is not an array');
      }

      const parent = this.getParent();
      return parent.down(this.props.index);
    }

    return this.up(index + 1);
  }

  // return current or parent fieldset
  resolveByPath(path, callback) {
    // return parent
    if (path && path[0] === '.') {
      const parent = this.getParent();
      const subPath = path.substr(1);

      if (isEmpty(subPath) && this.isIndex) {
        return parent.resolveByPath(this.props.index, callback);
      }

      return parent.resolveByPath(subPath, callback);
      /*
      const { index } = this.props;
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

      return realParent.resolveByPath(subPath, callback);*/
    }

    return callback(null, this, path);
  }

  getCurrentValue() {
    const parent = this.getParent();
    const { name } = this.props;

    const value = parent.getCurrentValue();
    if (!value) {
      return void 0;
    }

    if (isEmpty(name)) {
      return value;
    }

    return get(value, name);
  }

  isIndex() {
    const { index } = this.props;

    return typeof index !== 'undefined';
  }

  getValue(path) {
/*
    if (path === '.') {
      return this.getValue('');
    }*/
/*
    if (path && path[0] === '.') {
      const parent = this.getParent();
      return parent.getValue(path);
    }*/

    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        throw err;
      }

      const value = current.getCurrentValue();
      if (isEmpty(subPath)) {
        return value;
      }

      return get(value, subPath);
    });
  }

  setValue(path, value, component) {
  /*  if (path === '.') {
      if (this.isIndex()) {
        const parent = this.getParent();
        parent.setValue(this.props.index, value, component);
        return;
      }

      this.setValue(void 0, value, component);
      return;
    }*/
/*
    if (path && path[0] === '.' && this.isIndex()) {
      const parent = this.getParent();
      parent.setValue(path, value, component);
      return;
    }*/


    if (path && path[0] === '.') {
      this.resolveByPath(path, (err, current, subPath) => {
        if (err) {
          throw err;
        }

        current.setValue(subPath, value, component);
      });
      return;
    }

    let newValue = value;
    const currentValue = this.getValue();

    if (!isEmpty(path)) {
      newValue = isArray(currentValue) ? [...currentValue] : { ...currentValue };
      set(newValue, path, value);
    }

    super.setValue(newValue, component);

    const { onChange } = this.props;
    if (onChange) {
      onChange(newValue, component);
    }
  }

  buildPath(path) {
    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        throw err;
      }

      const currentPath = current.getPath();
      if (!subPath) {
        return currentPath;
      }

      return currentPath ? `${currentPath}.${subPath}` : subPath;
    });
  }

  disableSmartUpdate(name) {
    if (!name || name[0] !== '.') {
      return;
    }

    this.smartUpdate = false;

    const parent = this.getParent();
    if (!parent) {
      return;
    }

    parent.disableSmartUpdate(name.substr(1));
  }

  registerChildren(children, topLevel) {
    this.smartUpdate = true;

    const { map } = this.props;
    const value = this.getValue();

    if (topLevel && map && isArray(value)) {
      const { tagName, childTagName } = this.props;
      const childTag = tagName === 'tbody' ? 'tr' : childTagName;

      const subChildren = childTag === 'tr' && children && children.type === 'tr'
        ? children.props.children
        : children;

      // removed this.registerChildren(
      return value.map((val, itemIndex) => (
        <Fieldset name={itemIndex} index={itemIndex} tagName={childTag} key={itemIndex}>
          {subChildren}
        </Fieldset>
      ));
    }

    // let indexes = this.props.indexes || [];

    return traverse(children, (child) => {
      // support for extend
      /* const form = this.props.form || this;

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
            form,
            errors: form.errors,
            parent: this,
            path: currentPath,
            indexes,
            onChange: (newValue, component) => this.setValue(name, newValue, component),
          },
        });
      }*/

      if (child.type && child.type.isElement) {
        this.disableSmartUpdate(child.props.name);
        return child;
      }

      return void 0;
/*
      if (!isFunction(child.type) || !child.type.isElement) {
        return void 0;
      }
/*
      const { name, valueIndex, childTransform } = child.props;
      const currentPath = this.buildPath(name);

      this.disableSmartUpdate(name);

      if (typeof child.props.index !== 'undefined') {
        indexes = [...indexes, child.props.index];
      }

      if (child.type === Integrate || child.type === Input
        || child.type === Textarea || child.type === Word) {
        return child;
      }

      const newProps = {
        originalProps: child.props,
        value: this.getValue(name),
        originalValue: valueIndex ? this.props.index : child.props.value,
        form,
        errors: form.errors,
        parent: this,
        path: currentPath,
        indexes,
        onChange: (newValue, component) => this.setValue(name, newValue, component),
      };

      return childTransform
        ? cloneElement(child, newProps, this.registerChildren(child.props.children))
        : cloneElement(child, newProps);*/
    }, (child) => {
      const updatedChild = extendChild(child, this);
      if (updatedChild !== child) {
        return updatedChild;
      }

      const { replace } = this.getForm().props;
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

      return void 0;
    });
  }

  getIndexes() {
    const parent = this.getParent();
    const indexes = parent
      ? parent.getIndexes()
      : [];

    if (this.isIndex()) {
      indexes.push(this.props.index);
    }

    return indexes;
  }

  render() {
    const children = this.registerChildren(this.props.children, true);
    const { tagName, className, style } = this.props;
    const path = this.getPath();

    return createElement(tagName, {
      className,
      style,
      'data-path': path,
    }, children);
  }
}
