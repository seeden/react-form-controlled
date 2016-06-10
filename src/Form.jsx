import { PropTypes, createElement } from 'react';
import Ajv from 'ajv';
import Fieldset from './Fieldset';
import filter from 'lodash/filter';

function isEmpty(value) {
  return typeof value === 'undefined' || value === null || value === '';
}

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

    this.onSubmit = ::this.onSubmit;
  }

  getForm() {
    return this;
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

    return filter(errors, (error) => {
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

  onSubmit(evn) {
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

  getCurrentValue() {
    return this.props.value;
  }

  setValue(value, component) {
    this.clearErrors();

    super.setValue(value, component);
  }

  getPath() {
    return void 0;
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
/*
  childChanged(component = this) {
    const parent = this.getParent();
    if (parent !== this) {
      parent.childChanged(component);
      return;
    }

    const { onChange } = this.props;
    if (onChange) {
      onChange(value, component);
    }
  }*/

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
        onSubmit: this.onSubmit,
      }
      : {
        className: this.props.className || element,
      };

    return createElement(element, props, children);
  }
}
