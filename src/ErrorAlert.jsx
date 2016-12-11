import React, { PropTypes } from 'react';
import Element from './Element';

export default class ErrorAlert extends Element {
  static contextTypes = {
    ...Element.contextTypes,
  };

  static isElement = Element.isElement;

  static propTypes = {
    ...Element.propTypes,
    className: PropTypes.string,
    processError: PropTypes.func,
    exactMatch: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    className: 'alert alert-danger',
  };

  shouldComponentUpdate() {
    return true;
  }

  renderErrors(errors) {
    const { children, processError } = this.props;

    if (children) {
      return children;
    }

    return errors
      .map((error) => {
        if (processError) {
          return processError(error);
        }

        return error.message;
      });
  }

  render() {
    const { className, exactMatch } = this.props;
    const path = this.getPath();
    const form = this.getForm();

    const errors = form.getErrors(path, exactMatch);
    if (!errors || !errors.length) {
      return null;
    }

    return (
      <div className={className} role="alert">
        {this.renderErrors(errors)}
      </div>
    );
  }
}
