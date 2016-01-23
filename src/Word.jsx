import Input from './Input';
import { remove as removeDiacritics } from 'diacritics';

function fixValue(value) {
  if (!value) {
    return value;
  }

  // remove white spaces
  let valueChanged = value.replace(/\s/g, '');

  // remove diacritics
  valueChanged = removeDiacritics(valueChanged);

  // to lowercase
  valueChanged = valueChanged.toLowerCase();

  return valueChanged;
}

export default class Word extends Input {
  static isElement = true;
  static propTypes = {
    ...Input.propTypes,
  };

  handleChange(evn) {
    const target = evn.target || {};

    const fixedValue = fixValue(target.value);
    if (fixedValue !== target.value) {
      target.value = fixedValue;
    }

    super.handleChange(evn);
  }
}
