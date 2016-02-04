import isArray from 'lodash/lang/isArray';
import isPlainObject from 'lodash/lang/isPlainObject';

function dirty(value) {
  if (isArray(value)) {
    return [...value];
  }

  if (isPlainObject(value)) {
    return {...value};
  }

  return value;
}

export default function markAsDirty(value, path, updateCallback) {
  const start = dirty(value);
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
