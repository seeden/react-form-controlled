import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
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
  static propTypes = {
    ...Element.propTypes,
    onChange: PropTypes.func,
    index: PropTypes.number,
    total: PropTypes.number,
    children: PropTypes.node,
    tagName: PropTypes.string,
    childrenOnly: PropTypes.bool,
    children: PropTypes.node,
    sameChildren: PropTypes.bool,
  };

  static childContextTypes = {
    fieldset: PropTypes.object.isRequired,
  };

  static contextTypes = {
    fieldset: PropTypes.object,
  };

  constructor(...args) {
    super(...args);

    this.registeredChildren = [];
  }

  getTotals() {
    const totals = [];
    if (typeof this.props.total !== 'undefined') {
      totals.push(this.props.total);
    }

    const parent = this.getParent();
    if (!parent) {
      return totals;
    }

    const parentTotals = parent.getTotals();
    return [...totals, ...parentTotals];
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
      this.notifyChildren();
    }
  }

  originalValueChanged() {
    super.originalValueChanged();
    this.notifyChildren();
  }

  notifyChildren() {
    const { registeredChildren } = this;
    registeredChildren.forEach(child => child.originalValueChanged());
  }

  registerChild(child, name) {
    if (name && name[0] === '.') {
      const parent = this.getParent();
      parent.registerChild(child, name.substr(1));
      return;
    }

    this.registeredChildren.push(child);
  }

  unregisterChild(child, name) {
    if (name && name[0] === '.') {
      const parent = this.getParent();
      parent.unregisterChild(child, name.substr(1));
      return;
    }

    const pos = this.registeredChildren.indexOf(child);
    if (pos !== -1) {
      this.registeredChildren.splice(pos, 1);
    }
  }

  getChildContext() {
    return {
      fieldset: this,
    };
  }

  async remove(index) {
    if (typeof index === 'undefined') {
      const parent = this.getParent();
      return parent.remove(this.getCurrentIndex());
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
      const parent = this.getParent();
      return parent.up(this.getCurrentIndex());
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

  getCurrentIndex() {
    const { name } = this.props;
    if (name === undefined) {
      throw new Error('This is not an array');
    }

    const indexNumber = Number(name);
    if (indexNumber.toString() !== name.toString() || !isNumber(indexNumber)) {
      throw new Error(`Index ${indexNumber} is not a number`);
    }

    return indexNumber;
  }

  async down(index) {
    if (typeof index === 'undefined') {
      const parent = this.getParent();
      return parent.down(this.getCurrentIndex());
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

      const childChildren = (child.props && child.props.children) || child.children;

      if (child.type === 'input') {
        return <Input {...child.props}>{childChildren}</Input>;
      } else if (child.type === 'select') {
        return <Select {...child.props}>{childChildren}</Select>;
      } else if (child.type === 'textarea') {
        return <Textarea {...child.props}>{childChildren}</Textarea>;
      } else if (child.type === 'fieldset' && child.props.name !== undefined) {
        return <Fieldset {...child.props}>{childChildren}</Fieldset>;
      } else if (child.type === 'tbody' && child.props.name !== undefined) {
        return <Fieldset {...child.props} tagName="tbody">{childChildren}</Fieldset>;
      }

      return undefined;
    });
  }

  processChildren(children) {
    const value = this.getValue();
    const { render } = this.props;

    if (typeof render === 'function') {
      return this.replaceChildren(render({ value }));
    }

    const path = this.getPath();
    const { skipMap } = this.props;
    if (Array.isArray(value) && !skipMap) {
      const childrenOnly = this.props.tagName === 'tbody';

      return value.map((item, index) => {
        const uniqueKey = `${path}.${index}`;

        return (
          <Fieldset
            name={index}
            key={uniqueKey}
            total={value.length}
            childrenOnly={childrenOnly}
          >
            {children}
          </Fieldset>
        );
      });
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
