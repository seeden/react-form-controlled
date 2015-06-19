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

	renderOptions() {
		const options = [];
		const value = this.props.value;

		if(this.props.placeholder) {
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
				options.push(<option value={option}>{option}</option>);
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

