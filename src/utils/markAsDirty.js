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
  for (let i = 0; i < parts.length; i++) {
    const key = parts[i];
    current[key] = dirty(current[key]);

    current = current[key];
  }

  if (updateCallback) {
    updateCallback(current);
  }

  return start;
}
