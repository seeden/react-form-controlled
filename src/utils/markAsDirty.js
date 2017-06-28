import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

export function normalizePath(originalPath) {
  const path = String(originalPath);
  return path.replace(/\[/g, '.').replace(/\]/g, '');
}

export function dirty(value) {
  if (isArray(value)) {
    return [...value];
  }

  if (isPlainObject(value)) {
    return { ...value };
  }

  return value;
}

export default function markAsDirty(value, originalPath, updateCallback) {
  const start = dirty(value);
  const path = normalizePath(originalPath);
  const parts = path.split('.');

  let current = start;
  let before;

  parts.forEach((key) => {
    current[key] = dirty(current[key]);

    before = current;
    current = current[key];
  });

  if (updateCallback) {
    const newValue = updateCallback(current);

    if (before !== undefined && parts.length) {
      const lastKey = parts[parts.length - 1];
      before[lastKey] = newValue;
    }
  }

  return start;
}
