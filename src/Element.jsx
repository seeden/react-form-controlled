import React, { Component } from 'react';

export default class Element extends Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		return null;
	}
};

Element.isElement = true;
Element.propTypes = {
	name: React.PropTypes.string.isRequired
};