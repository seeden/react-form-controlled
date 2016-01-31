import { Component, PropTypes } from 'react';

export default class Element extends Component {
  static isElement = true;

  static propTypes = {
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    originalProps: PropTypes.object,
    className: PropTypes.string,
  };

  getPath() {
    return this.props.path;
  }

  render() {
    return null;
  }
}
