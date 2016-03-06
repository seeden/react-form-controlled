import { cloneElement } from 'react';
import forOwn from 'lodash/forOwn';

export default function extendChild(child, parent) {
  const { index } = parent.props;
  if (typeof index === 'undefined') {
    return child;
  }

  const { provideIndex, providePath, provideIndexes, remove, up, down, onClick } = child.props;
  const newProps = {};
  let changed = false;

  if (provideIndex || providePath || provideIndexes) {
    newProps.provideIndex = null;
    newProps.providePath = null;
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
