import { Component, PropTypes } from 'react';

export default class Element extends Component {
  static isElement = true;
  static propTypes = {
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  render() {
    return null;
  }
}

