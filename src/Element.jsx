import { Component, PropTypes } from 'react';

export default class Element extends Component {
  static isElement = true;
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  render() {
    return null;
  }
}

