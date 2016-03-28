import React, { PropTypes } from 'react';
import Element from './Element';

export default class ErrorAlert extends Element {
  static isElement = Element.isElement;

  static propTypes = {
    ...Element.propTypes,
    className: PropTypes.string,
    processError: PropTypes.func,
    exactMatch: PropTypes.boolean,
  };

  static defaultProps = {
    className: 'alert alert-danger',
  };

  render() {
    const { path, form, className, processError, exactMatch } = this.props;
    if (!path || !form) {
      return null;
    }

    const errors = form.getErrors(path, exactMatch);
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
