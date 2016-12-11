import { PropTypes, createElement } from 'react';
import Ajv from 'ajv';
import Fieldset from './Fieldset';

function isEmpty(value) {
  return typeof value === 'undefined' || value === null || value === '';
}

const DEFAULT_INVALID_ERROR = 'Form is invalid';

function errorToProperty(err) {
  const { params = {} } = err;

  if (params.missingProperty) {
    return params.missingProperty;
  }

  return undefined;
}

export default class Form extends Fieldset {
  static isForm = true;

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    replace: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onChange: () => {},
    onSubmit: () => {},
    replace: true,
  };

  getStateFromProps(props) {
    const { schema } = props;

    let validator = this.validator;
    if (schema && (!validator || validator.schema !== schema)) {
      const ajv = this.ajv = this.ajv || Ajv({
        allErrors: true,
        async: true,
      });
      validator = ajv.compile({
        $async: true,
        ...schema,
      });
      validator.schema = schema;
    }

    return {
      ...super.getStateFromProps(props),
      validator,
    };
  }

  getForm() {
    return this;
  }

  async validate(value) {
    const { validator } = this.state;
    if (!validator) {
      return [];
    }

    try {
      await validator(value);
      return [];
    } catch (e) {
      const { errors } = e;

      return errors.map((err) => {
        const prop = errorToProperty(err);
        const path = err.dataPath ? err.dataPath.substr(1) : null;

        const fullPath = path && prop
          ? `${path}.${prop}`
          : path || prop;

        return {
          ...err,
          path: fullPath,
        };
      });
    }
  }

  getErrors(path, exactMatch) {
    const errors = this.state.errors || [];
    if (!path) {
      return errors;
    }

    const parentPath = `${path}.`;

    return errors.filter((error) => {
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

  onSubmit = async (evn) => {
    evn.preventDefault();

    const { onSubmit, onError, value } = this.props;
    const errors = await this.validate(value);
    // store current errors
    this.setState({
      errors,
    });

    if (!errors.length && onSubmit) {
      onSubmit(value);
    } else if (errors.length && onError) {
      onError(errors);
    }
  }

  getCurrentValue() {
    return this.props.value;
  }

  setValue(value, component) {
    this.clearErrors();

    super.setValue(value, component);
  }

  getPath() {
    return undefined;
  }

  clearErrors() {
    this.setState({
      errors: [],
    });
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

  getClassName() {
    const { className } = this.props;
    return className;
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
        className: this.getClassName() || element,
        onSubmit: this.onSubmit,
      }
      : {
        className: this.getClassName() || element,
      };

    return createElement(element, props, children);
  }
}
