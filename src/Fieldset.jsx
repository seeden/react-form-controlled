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

    const newFn = (...args) => fn(index, ...args);
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
    addIndex: PropTypes.bool,
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
      || props.index !== nextProps.index
      || props.addIndex !== nextProps.addIndex);
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
    if (typeof path === 'undefined' || path === null || path === '') {
      if (typeof this.props.index !== 'undefined') {
        if (!this.props.parent) {
          return callback(new Error('Parent is undefined'));
        }

        return this.props.parent.resolveByPath(this.props.index, callback);
      }

      return callback(new Error('Path is undefined'));
    }

    if (path && path[0] === '.') {
      const { parent, index } = this.props;
      if (!parent) {
        return callback(new Error('Parent is undefined'));
      }

      const hasIndex = typeof index !== 'undefined';
      const realParent = hasIndex ? parent.props.parent : parent;
      if (!parent) {
        return callback(new Error('Parent is undefined'));
      }

      return realParent.resolveByPath(path.substr(1), callback);
    }

    return callback(null, this, path);
  }

  getValue(path) {
    if (typeof path === 'undefined' || path === null || path === '') {
      this.props.value;
    }

    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        return void 0;
      }

      const { value = {} } = current.props;
      return get(value, subPath);
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

      if (typeof subPath === 'undefined' || subPath === null) {
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

    const { value, map, index, addIndex } = this.props;

    if (topLevel && map && isArray(value)) {
      return value.map((val, index) => {
        return this._registerChildren((
          <Fieldset name={index} key={index} index={index} addIndex={addIndex}>
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

      const { name, valueIndex } = child.props;
      const currentPath = this.buildPath(name);
      const parent = this.props.parent || this;

      this.disableSmartUpdate(name);

      return cloneElement(child, {
        originalProps: child.props,
        value: this.getValue(name),
        originalValue: valueIndex ? this.props.index : child.props.value,
        form: this.props.form || this,
        parent: this,
        path: currentPath,
        onChange: (value, component) => this.setValue(name, value, component),
      });
    }, (child) => {
      const { replace } = this.getFormProps();

      if (hasIndex) {
        if (child.props.remove) {
          return cloneElement(child, {
            remove: null,
            onClick: () => this.remove(index),
          });
        } else if (child.props.up) {
          return cloneElement(child, {
            up: null,
            onClick: () => this.up(index),
          });
        } else if (child.props.down) {
          return cloneElement(child, {
            down: null,
            onClick: () => this.down(index),
          });
        } else if (addIndex || child.props.addIndex) {
          const updatedChild = extendCallbacks(child, index);
          if (updatedChild !== child) {
            return updatedChild;
          }
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
    const { className } = this.props;

    return (
      <fieldset className={className}>
        {children}
      </fieldset>
    );
  }
}
