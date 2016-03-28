import React, { PropTypes, createElement } from 'react';
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
  static isForm = true;

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    ajvOptions: PropTypes.object.isRequired,
    replace: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    ajvOptions: {
      allErrors: true,
    },
    onChange: () => {},
    onSubmit: () => {},
    replace: true,
  };

  constructor(props, context) {
    super(props, context);

    const ajv = Ajv(props.ajvOptions);
    this.validateData = ajv.compile(props.schema || {});

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getFormProps() {
    return this.props;
  }

  validate(value, callback) {
    const schema = this.props.schema;
    if (!schema) {
      return callback(null, []);
    }

    const isValid = this.validateData(value);
    if (isValid) {
      return callback(null, []);
    }

    // prepare error paths
    const errors = this.validateData.errors || [];
    errors.forEach((err) => {
      const prop = errorToProperty(err);
      const path = err.dataPath ? err.dataPath.substr(1) : null;

      err.path = path && prop ? `${path}.${prop}` : path || prop;
    });


    callback(null, errors);
  }

  getErrors(path, exactMatch) {
    const errors = this.errors || [];
    if (!path) {
      return errors;
    }

    const parentPath = `${path}.`;

    return erros.map((error) => {
      if (!error.path) {
        return false;
      }

      if (error.path === path) {
        return true;
      }

      if (!exactMatch && error.path.indexOf(parentPath) === 0) {
        return true;
      }

      return false;
    });
  }

  hasErrors(path, exactMatch) {
    return !!this.getErrors(path, exactMatch).length;
  }

  isValid(path, exactMatch) {
    return !this.hasErrors(path, exactMatch);
  }

  handleSubmit(evn) {
    evn.preventDefault();

    this.validate(this.props.value, (err, errors) => {
      // store current errors
      this.setErrors(errors);

      if (err || errors.length) {
        return;
      }

      if (this.props.onSubmit) {
        this.props.onSubmit(this.props.value);
      }
    });
  }

  handleChange() {
    this.clearErrors();
  }

  setErrors(errors = []) {
    this.errors = errors;

    this.setState({
      errors,
    });
  }

  clearErrors() {
    this.setErrors([]);
  }

  render() {
    const children = this.registerChildren(this.props.children);
    const autoComplete = typeof this.props.autoComplete !== 'undefined'
      ? this.props.autoComplete
      : 'off';

    const element = this.props.form ? 'fieldset' : 'form';

    const props = element === 'form'
      ? {
        autoComplete,
        method: this.props.method,
        action: this.props.action,
        className: this.props.className || element,
        onSubmit: this.handleSubmit,
        onChange: this.handleChange,
      }
      : {
        className: this.props.className || element,
      };

    return createElement(element, props, children);
  }
}
