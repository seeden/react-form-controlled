import React, { PropTypes } from 'react';
import Element from './Element';

export default class ErrorAlert extends Element {
  static propTypes = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    exact: PropTypes.bool,
    children: PropTypes.func,
    render: PropTypes.func,
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
    const { children, render, component, exact, ...rest } = this.props;
    const path = this.getPath();
    const form = this.getForm();

    const errors = form.getErrors(path, exact);
    if (!errors || !errors.length) {
      return null;
    }

    if (typeof children === 'function') {
      return this.replaceChildren(children({ errors }));
    } else if (typeof render === 'function') {
      return this.replaceChildren(render({ errors }));
    }

    if (!component) {
      return (
        <div role="alert">
          {errors.map(error => error.message)}
        </div>
      );
    }

    return <component errors={errors} {...rest} />;
  }
}
