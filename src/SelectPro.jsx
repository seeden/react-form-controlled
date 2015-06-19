import ReactSelect from 'react-select';
import React from 'react';
import Element from './element';

export default class Select extends Element {
	constructor(props, context) {
		super(props, context);
	}

	handleChange(value, items) {
		if(!this.props.multi) {
			this.props.onChange(value);
			return;
		}

		value = items.map(function(item) {
			return item.value;
		});

		this.props.onChange(value);
	}

	render() {
		return (
			<ReactSelect 
				name={this.props.name}
    			value={this.props.value} 
    			multi={!!this.props.multi} 
    			options={this.props.options}
    			placeholder={this.props.placeholder}
    			disabled={this.props.disabled}
    			onChange={this.handleChange.bind(this)} />
		);
	}
};

Select.isElement = true;
Select.propTypes = {
	name: React.PropTypes.string.isRequired
};

