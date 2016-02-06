import React, { PropTypes } from 'react';
import Ajv from 'ajv';
import Fieldset from './Fieldset';

const DEFAULT_INVALID_ERROR = 'Form is invalid';

function errorToProperty(err) {
  switch (err.keyword) {
  case 'required':
    return err.params.missingProperty;
  default:
    return void 0;
  }
}

export default class Form extends Fieldset {
  static isElement = Fieldset.isElement;

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    ajvOptions: PropTypes.object.isRequired,
    replace: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    ajvOptions: {
      allErrors: true,
      verbose: true,
    },
    onChange: () => {},
    onSubmit: () => {},
    replace: true,
  };

  constructor(props, context) {
    super(props, context);

    this.errors = [];

    const ajv = Ajv(props.ajvOptions);
    this.validateData = ajv.compile(props.schema || {});

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getFormProps() {
    return this.props;
  }

  validate(callback) {
    this.errors = [];

    const schema = this.props.schema;
    if (!schema) {
      return callback(null, true);
    }

    const isValid = this.validateData(this.props.value);
    if (isValid) {
      return callback(null, true);
    }

    const errors = this.errors = this.validateData.errors || [];
    errors.forEach((err) => {
      const prop = errorToProperty(err);
      const path = err.dataPath ? err.dataPath.substr(1) : null;

      err.path = path
        ? `${path}.${prop}`
        : prop;
    });

    const err = new Error(DEFAULT_INVALID_ERROR);
    err.errors = errors;

    callback(err);
  }

  getErrors(path) {
    const errors = this.errors;
    if (!path) {
      return errors;
    }

    const ret = [];

    for (let index = 0; index < errors.length; index++) {
      const error = errors[index];
      if (error.path !== path) {
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

    this.validate((err) => {
      if (err) {
        if (this.props.onError) {
          this.props.onError(err);
        }

        // redraw for ErrorAlert
        this.setState({
          error: err,
        });

        return;
      }

      this.setState({
        error: null,
      });

      if (this.props.onSubmit) {
        this.props.onSubmit(this.props.value);
      }
    });
  }

  handleChange(evn) {
    this.errors = [];
  }

  render() {
    const children = this._registerChildren(this.props.children, true);
    const autoComplete = typeof this.props.autoComplete !== 'undefined'
      ? this.props.autoComplete
      : 'off';

    return (
      <form
        autoComplete={autoComplete}
        method={this.props.method}
        action={this.props.action}
        className={this.props.className || 'form'}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}>
        {children}
      </form>
    );
  }
}
