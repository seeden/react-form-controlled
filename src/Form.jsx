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

  validate(value, callback) {
    this.errors = [];

    const schema = this.props.schema;
    if (!schema) {
      return callback(null, true);
    }

    const isValid = this.validateData(value);
    if (isValid) {
      return callback(null, true);
    }

    const errors = this.errors = this.validateData.errors || [];
    errors.forEach((err) => {
      const prop = errorToProperty(err);
      const path = err.dataPath ? err.dataPath.substr(1) : null;

      err.path = path ? `${path}.${prop}` : prop;
    });

    const err = new Error(DEFAULT_INVALID_ERROR);
    err.errors = errors;

    callback(null, false);
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

    this.validate(this.props.value, (err, isValid) => {
      if (err || !isValid) {
        return;
      }

      if (this.props.onSubmit) {
        this.props.onSubmit(this.props.value);
      }
    });
  }

  handleChange() {
    this.errors = [];
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
