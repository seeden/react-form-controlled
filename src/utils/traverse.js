import { Children, cloneElement } from 'react';
import Element from '../Element';

export default function traverse(child, processCallback, replaceCallback) {
  if (Array.isArray(child)) {
    return Children.map(child, children => traverse(children, processCallback, replaceCallback));
  }

  if (!child || typeof child === 'string') {
    return child;
  }

  if (child === Element || Element.isPrototypeOf(child.type)) {
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
    // speed up
    if (children === child.props.children) {
      return child;
    }

    return cloneElement(child, {}, children);
  }

  return child;
}
