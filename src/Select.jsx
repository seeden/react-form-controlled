import React from 'react';
import Element from './element';
import _ from 'lodash';

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

	renderOptions() {
		const options = [];
		const value = this.props.value;

		if(typeof this.props.placeholder !== 'undefined') {
			options.push(<option value={this.props.placeholderValue || ''}>{this.props.placeholder}</option>);
		}

		const propsOptions = this.props.options;
		if(_.isPlainObject(propsOptions)) {
			Object.keys(propsOptions).forEach(function(option) {
				const name = propsOptions[option];
				options.push(<option value={option}>{name}</option>);
			});
		} else if(_.isArray(propsOptions)) {
			propsOptions.forEach(function(option) {
				const isObject = option && option.key && option.value;
				const value = isObject ? option.key : option;
				const text = isObject ? option.value : option;

				options.push(<option value={value}>{text}</option>);
			});
		}

		return options;
	}

	render() {
		return (
			<select 
				className={this.props.className}
				name={this.props.name}
    			value={this.props.value} 
    			multi={!!this.props.multi} 
    			disabled={this.props.disabled}
    			required={this.props.required}
    			onChange={this.handleChange.bind(this)}>

    			{this.renderOptions()}

    		</select>
		);
	}
};

Select.isElement = true;
Select.propTypes = {
	name: React.PropTypes.string.isRequired
};

