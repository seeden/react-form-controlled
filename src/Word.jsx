import { remove as removeDiacritics } from 'diacritics';
import { autobind } from 'core-decorators';
import Input from './Input';

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
  @autobind
  onChange(evn) {
    const { target } = evn;

    const fixedValue = fixValue(target.value);
    if (fixedValue !== target.value) {
      target.value = fixedValue;
    }

    super.onChange(evn);
  }
}
