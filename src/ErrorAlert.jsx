import React, { PropTypes } from 'react';
import Element from './Element';

export default class ErrorAlert extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
    className: PropTypes.string,
    processError: PropTypes.func,
  };

  static defaultProps = {
    className: 'alert alert-danger',
  };

  render() {
    const { path, form, className, processError } = this.props;
    if (!path || !form) {
      return null;
    }

    const errors = form.getErrors(path);
    if (!errors || !errors.length) {
      return null;
    }

    return (
      <div className={className} role="alert">
        {this.props.children || errors.map((error) => processError ? processError(error) : error.message)}
      </div>
    );
  }
}
