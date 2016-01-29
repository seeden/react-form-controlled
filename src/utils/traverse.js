import { Children, cloneElement } from 'react';
import isArray from 'lodash/lang/isArray';

export default function traverse(child, processCallback, replaceCallback) {
  if (isArray(child)) {
    return Children.map(child, (children) => traverse(children, processCallback, replaceCallback));
  }

  if (!child || typeof child === 'string') {
    return child;
  }

  if (replaceCallback) {
    const replacedChild = replaceCallback(child);
    if (replacedChild) {
      return traverse(replacedChild, processCallback, replaceCallback);
    }
  }

  if (processCallback) {
    const processedChild = processCallback(child);
    if (processedChild) {
      return processedChild;
    }
  }

  if (child.props && child.props.children) {
    const children = traverse(child.props.children, processCallback, replaceCallback);
    return cloneElement(child, {}, children);
  }

  return child;
}
