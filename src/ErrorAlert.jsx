import React, { PropTypes } from 'react';
import Element from './Element';

export default class ErrorAlert extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { path, form } = this.props;
    if (!path || !form) {
      return null;
    }

    const errors = form.getErrors(path);
    if (!errors || !errors.length) {
      return null;
    }

    const error = errors[0];
    const message = this.props.processError ? this.props.processError(error) : error.message;

    return (
      <div className="alert alert-danger" role="alert">
        {this.props.children || message}
      </div>
    );
  }
}
