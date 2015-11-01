import React, { Component } from 'react';

export default class Element extends Component {
  static isElement = true;
  static propTypes = {
    name: React.PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return null;
  }
}

