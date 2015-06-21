import React from 'react';
import validator from 'jsen';
import FormObject from './FormObject';
import _ from 'lodash';

export default class Form extends FormObject {
    constructor(props, context) {
    	super(props, context);

		this.validateData = validator(props.schema || {});
    }
	
	validate(callback) {
		const schema = this.props.schema;
		if(!schema) {
			return callback(null, true);
		}

		const isValid = this.validateData(this.props.value);
		const errors = this.validateData.errors;

		this.setState({
			errors: errors && errors.length ? errors: null
		});

		callback(null, isValid, errors);
	}

	getErrors(path) {
		var errors = this.state.errors || [];

		if(!path) {
			return errors;
		}

		var schemaPath = '#/'+path;
		var ret = [];

		for(var i=0; i<errors.length; i++) {
			var error = errors[i];
			if(error.path !== schemaPath) {
				continue;
			}

			ret.push(error);
		}
		return ret;
	}

	hasErrors(path) {
		return !!this.getErrors(path).length;
	}

	isValid(path) {
		return !this.hasErrors(path);
	}

    handleSubmit(e) {
    	e.preventDefault();

		this.validate((err, valid) => {
			if(!valid) {
				return;
			}
			
			this.props.onSubmit(this.props.value);
		});
    }


    render() {
    	const children = this._registerChildren(this.props.children);
    	const autoComplete = typeof this.props.autoComplete !== 'undefined' 
    		? this.props.autoComplete
    		: 'off';

    	return (
    		<form 
    			autoComplete={autoComplete}
    			method={this.props.method}
    			action={this.props.action}
    			className={this.props.className || 'form'} 
    			onSubmit={this.handleSubmit.bind(this)} 
    			onChange={this.handleChange.bind(this)}>

    			{children}
    		</form>
    	);
    }    
};

Form.propTypes = {
	onSubmit: React.PropTypes.func.isRequired,
	onChange: React.PropTypes.func.isRequired
};
