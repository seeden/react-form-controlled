import React from 'react';
import Input from './input';
import { remove as removeDiacritics } from 'diacritics';

function fixValue(value) {
	if(!value) {
		return value;
	}

	//remove white spaces
	value = value.replace(/\s/g, '');

	//remove diacritics
	value = removeDiacritics(value);

	//to lowercase
	value = value.toLowerCase();	

	return value;
}

export default class Word extends Input {
	handleChange(e) {
		const target = e.target || {};

		const fixedValue = fixValue(target.value);
		if(fixedValue !== target.value) {
			target.value = fixedValue;
		}

		super.handleChange(e);
	}
};

Word.isElement = true;
Word.propTypes = Input.propTypes;