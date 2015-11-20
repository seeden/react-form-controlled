import React, { PropTypes } from 'react';
import validator from 'jsen';
import FormObject from './FormObject';

export default class Form extends FormObject {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.validateData = validator(props.schema || {});
  }

  validate(callback) {
    const schema = this.props.schema;
    if (!schema) {
      return callback(null, true);
    }

    const isValid = this.validateData(this.props.value);
    const errors = this.validateData.errors;

    this.setState({
      errors: errors && errors.length ? errors : null,
    });

    callback(null, isValid, errors);
  }

  getErrors(path) {
    const errors = this.state.errors || [];

    if (!path) {
      return errors;
    }

    const schemaPath = '#/' + path;
    const ret = [];

    for (let index = 0; index < errors.length; index++) {
      const error = errors[index];
      if (error.path !== schemaPath) {
        continue;
      }

      ret.push(error);
    }
    return ret;
  }

  hasErrors(path) {
    return !!this.getErrors(path).length;
  }

  isValid(path) {
    return !this.hasErrors(path);
  }

  handleSubmit(evn) {
    evn.preventDefault();

    this.validate((err, valid) => {
      if (!valid) {
        if (this.props.onError) {
          this.props.onError(err);
        }
        return;
      }

      this.props.onSubmit(this.props.value);
    });
  }

  render() {
    const children = this._registerChildren(this.props.children);
    const autoComplete = typeof this.props.autoComplete !== 'undefined'
      ? this.props.autoComplete
      : 'off';

    return (
      <form
        autoComplete={autoComplete}
        method={this.props.method}
        action={this.props.action}
        className={this.props.className || 'form'}
        onSubmit={this.handleSubmit.bind(this)}
        onChange={this.handleChange.bind(this)}>

        {children}
      </form>
    );
  }
}
