import React, { PropTypes, createElement } from 'react';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import Element from './Element';
import set from './utils/set';
import traverse from './utils/traverse';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';

function isEmpty(value) {
  return typeof value === 'undefined' || value === null || value === '';
}

export default class Fieldset extends Element {
  static isElement = Element.isElement;

  static propTypes = {
    ...Element.propTypes,
    onChange: PropTypes.func,
    index: PropTypes.number,
    children: PropTypes.node,
    tagName: PropTypes.string,
    childrenOnly: PropTypes.bool,
    children: PropTypes.node,
  };

  static childContextTypes = {
    fieldset: PropTypes.object.isRequired,
  };

  static contextTypes = {
    fieldset: PropTypes.object,
  };

  constructor(...args) {
    super(...args);

    this.children = [];
  }

  getIndexes() {
    const indexes = [];
    if (typeof this.props.index !== 'undefined') {
      indexes.push(this.props.index);
    }

    const parent = this.getParent();
    if (!parent) {
      return indexes;
    }

    const parentIndexes = parent.getIndexes();
    return [...indexes, ...parentIndexes];
  }

  setValue(value, component, notifyChildren) {
    super.setValue(value, component, notifyChildren);

    if (notifyChildren) {
      const { children } = this;
      children.forEach(child => child.originalValueChanged());
    }
  }

  originalValueChanged() {
    super.originalValueChanged();

    const { children } = this;
    children.forEach(child => child.originalValueChanged());
  }

  registerChild(child, name) {
    if (typeof name === 'undefined') {
      return;
    }

    if (name[0] === '.') {
      const parent = this.getParent();
      parent.registerChild(child, name.substr(1));
      return;
    }

    this.children.push(child);
  }

  unregisterChild(child, name) {
    if (typeof name === 'undefined') {
      return;
    }

    if (name[0] === '.') {
      const parent = this.getParent();
      parent.unregisterChild(child, name.substr(1));
      return;
    }

    const pos = this.children.indexOf(child);
    if (pos !== -1) {
      this.children.splice(pos, 1);
    }
  }

  getChildContext() {
    return {
      fieldset: this,
    };
  }

  async remove(index) {
    if (typeof index === 'undefined') {
      if (typeof this.props.index === 'undefined') {
        throw new Error('This is not an array');
      }

      const parent = this.getParent();
      return parent.remove(this.props.index);
    }

    const value = this.getValue();
    if (!Array.isArray(value) || index < 0 || value.length <= index) {
      return undefined;
    }

    this.setValue([
      ...value.slice(0, index),
      ...value.slice(index + 1),
    ]);

    return index;
  }

  async up(index) {
    if (typeof index === 'undefined') {
      if (typeof this.props.index === 'undefined') {
        throw new Error('This is not an array');
      }

      const parent = this.getParent();
      return parent.up(this.props.index);
    }

    const value = this.getValue();
    if (!Array.isArray(value) || index <= 0 || value.length <= index) {
      return undefined;
    }

    this.setValue([
      ...value.slice(0, index - 1),
      value[index],
      value[index - 1],
      ...value.slice(index + 1),
    ]);

    return index;
  }

  async down(index) {
    if (typeof index === 'undefined') {
      if (typeof this.props.index === 'undefined') {
        throw new Error('This is not an array');
      }

      const parent = this.getParent();
      return parent.down(this.props.index);
    }

    const retVar = this.up(index + 1);
    return typeof retVar === 'undefined'
      ? retVar
      : index;
  }

  // return current or parent fieldset
  resolveByPath(path, callback) {
    if (path[0] === '.') {
      const subPath = path.substr(1);
      if (isEmpty(subPath)) {
        return callback(null, this, subPath);
      }

      const parent = this.getParent();
      return parent.resolveByPath(subPath, callback);
    }

    return callback(null, this, path);
  }

  getChildValue(path) {
    if (isEmpty(path)) {
      return this.getValue();
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
      if (isEmpty(subPath)) {
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

  replaceChildren(children) {
    const { skipReplace } = this.getForm().props;
    if (skipReplace) {
      return children;
    }

    return traverse(children, null, (child) => {
      if (child.props && child.props.skipReplace) {
        return undefined;
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
        return <Fieldset {...child.props} tagName="tbody" />;
      }

      return undefined;
    });
  }

  processChildren(children) {
    const value = this.getValue();

    if (typeof children === 'function') {
      return this.processChildren(children({ value }));
    }

    const { skipMap } = this.props;
    if (Array.isArray(value) && !skipMap) {
      const childrenOnly = this.props.tagName === 'tbody';

      return value.map((item, index) => (
        <Fieldset
          name={index}
          key={index}
          index={index}
          childrenOnly={childrenOnly}
        >
          {children}
        </Fieldset>
      ));
    }

    return this.replaceChildren(children);
  }

  render() {
    const children = this.processChildren(this.props.children);
    const { tagName = 'fieldset', className, style, childrenOnly } = this.props;

    if (childrenOnly) {
      return children;
    }

    return createElement(tagName, {
      className,
      style,
      'data-path': this.getPath(),
    }, children);
  }
}
