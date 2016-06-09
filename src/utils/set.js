import { normalizePath, dirty } from './markAsDirty';

export default function set(currentValue, originalPath, value) {
  const start = dirty(currentValue);
  const path = normalizePath(originalPath);
  const parts = path.split('.');
  if (!parts.length) {
    return value;
  }
  const propName = parts.pop();
  if (!propName) {
    throw new Error('Path is not complete');
  }

  let current = start;
  for (let i = 0; i < parts.length; i++) {
    const key = parts[i];
    if (!key) {
      throw new Error('Path is not complete');
    }

    current[key] = dirty(current[key]);

    current = current[key];
  }

  current[propName] = value;

  return start;
}
