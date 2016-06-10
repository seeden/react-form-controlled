import React, { PropTypes, createElement, cloneElement } from 'react';
import Element from './Element';
import isArray from 'lodash/isArray';
import set from './utils/set';
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

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.smartUpdate) {
      return true;
    }

    return super.shouldComponentUpdate(nextProps, nextState);
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

    this.setValue([
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

    this.setValue([
      ...value.slice(0, index - 1),
      value[index],
      value[index - 1],
      ...value.slice(index + 1),
    ]);

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
    if (path && path[0] === '.') {
      const parent = this.getParent();
      const subPath = path.substr(1);

      if (isEmpty(subPath) && this.isIndex) {
        return parent.resolveByPath(this.props.index, callback);
      }

      return parent.resolveByPath(subPath, callback);
    }

    return callback(null, this, path);
  }

  isIndex() {
    const { index } = this.props;

    return typeof index !== 'undefined';
  }

  getChildValue(path) {
    if (isEmpty(path)) {
      throw new Error('Path is not defined');
    }

    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        throw err;
      }

      const value = current.getValue();
      if (isEmpty(subPath)) {
        return value;
      }

      return get(value, subPath);
    });
  }

  setChildValue(path, value, component) {
    this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        throw err;
      }

      let newValue = value;
      if (!isEmpty(subPath)) {
        const currentValue = current.getValue();
        newValue = set(currentValue, subPath, value);
      }


      current.setValue(newValue, component);

      const { onChange } = current.props;
      if (onChange) {
        onChange(newValue, component);
      }
    });
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
    if (!name || name[0] !== '.' || name === '.') {
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

    if (topLevel && map !== false && isArray(value)) {
      const { tagName, childTagName } = this.props;
      const childTag = tagName === 'tbody' ? 'tr' : childTagName;

      const subChildren = childTag === 'tr' && children && children.type === 'tr'
        ? children.props.children
        : children;

      // removed this.registerChildren(
      return value.map((fieldsetValue, itemIndex) => (
        <Fieldset
          parent={this}
          value={fieldsetValue}
          name={itemIndex}
          index={itemIndex}
          tagName={childTag}
          key={itemIndex}
        >
          {subChildren}
        </Fieldset>
      ));
    }


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
        const { name, value: childValue, valueIndex } = child.props;

        this.disableSmartUpdate(name);

        return cloneElement(child, {
          parent: this,
          originalValue: valueIndex ? this.props.index : childValue,
          value: this.getChildValue(name),
        });
      }

      return void 0;
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
