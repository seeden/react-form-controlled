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

function extendChild(child, parent) {
  const { index } = parent.props;
  if (typeof index === 'undefined') {
    return child;
  }

  const { provideIndex, providePath, provideNames, provideIndexes, remove, up, down, onClick } = child.props;
  const newProps = {};
  let changed = false;

  if (provideIndex || providePath || provideNames || provideIndexes) {
    newProps.provideIndex = null;
    newProps.providePath = null;
    newProps.provideNames = null;
    newProps.provideIndexes = null;

    changed = true;

    forOwn(child.props, (fn, key) => {
      if (typeof fn !== 'function') {
        return;
      }

      if (provideIndex) {
        newProps[key] = (...args) => fn(index, ...args);
      }

      if (providePath) {
        const currentFn = child.props[key];
        newProps[key] = (...args) => currentFn(parent.props.path, ...args);
      }

      if (provideNames) {
        const currentFn = child.props[key];
        newProps[key] = (...args) => currentFn(parent.props.names, ...args);
      }

      if (provideIndexes) {
        const currentFn = child.props[key];
        newProps[key] = (...args) => currentFn(parent.props.indexes, ...args);
      }
    });
  }

  const onClickBefore = newProps.onClick || onClick;

  if (remove) {
    newProps.remove = null;
    changed = true;

    newProps.onClick = () => {
      parent.remove(index);

      if (onClickBefore) {
        setTimeout(onClickBefore, 0);
      }
    };
  } else if (up) {
    newProps.up = null;
    changed = true;

    newProps.onClick = () => {
      parent.up(index);

      if (onClickBefore) {
        setTimeout(onClickBefore, 0);
      }
    };
  } else if (down) {
    newProps.down = null;
    changed = true;

    newProps.onClick = () => {
      parent.down(index);

      if (onClickBefore) {
        setTimeout(onClickBefore, 0);
      }
    };
  }

  if (changed) {
    return cloneElement(child, newProps);
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
      return this.props.value;
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

      const { name, valueIndex } = child.props;
      const currentPath = this.buildPath(name);

      this.disableSmartUpdate(name);

      if (typeof child.props.index !== 'undefined') {
        indexes = [...indexes, child.props.index];
      }

      return cloneElement(child, {
        originalProps: child.props,
        value: this.getValue(name),
        originalValue: valueIndex ? this.props.index : child.props.value,
        form: this.props.form || this,
        parent: this,
        path: currentPath,
        names: this.props.names ? [...this.props.names, name] : [name],
        indexes,
        onChange: (value, component) => this.setValue(name, value, component),
      });
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
      <fieldset className={className}>
        {children}
      </fieldset>
    );
  }
}
