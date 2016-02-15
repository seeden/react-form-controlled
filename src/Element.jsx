import { Component, PropTypes } from 'react';

export default class Element extends Component {
  static propTypes = {
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    originalProps: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static isElement = true;

  render() {
    return null;
  }
}
