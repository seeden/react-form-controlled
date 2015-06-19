import React from 'react';
import Element from './element';

const DIFF_TIMEOUT = 100;

export default class Input extends Element {
	constructor(props, context) {
		super(props, context);

		this.state = {
			value: props.value
		};
	}

	handleChange(e) {
		const target = e.target || {};
		const value = target.type === 'checkbox' 
			? !!target.checked
			: target.value;

		if(this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}

		this.setState({
			value: value
		});
	}

    componentWillReceiveProps (newProps) {
    	const isDiff = this.state.value !== newProps.value;
    	if(!isDiff) {
    		return;
    	}
    	
    	//wait for it
    	this.timeoutId = setTimeout(() => {
    		this.timeoutId = null;

    		if(this.state.value === this.props.value) {
    			return;
    		}

    		this.setState({
	    		value: this.props.value
	    	});
    	}, DIFF_TIMEOUT); 
    }

	render() {
		const checked = this.props.type === 'checkbox' && this.props.value;

		return (
			<input 
				autoComplete={this.props.autoComplete}
				onChange={this.handleChange.bind(this)}
				type={this.props.type} 
				disabled={this.props.disabled} 
				checked={checked ? checked : void 0} 
				className={this.props.className} 
				name={this.props.name} 
				id={this.props.id} 
				size={this.props.size} 
				placeholder={this.props.placeholder} 
				value={this.state.value} />
		);
	}
};

Input.isElement = true;
Input.propTypes = {
	name: React.PropTypes.string.isRequired
};