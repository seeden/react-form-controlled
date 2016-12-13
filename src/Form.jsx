import { PropTypes, createElement } from 'react';
import Ajv from 'ajv';
import { autobind } from 'core-decorators';
import Fieldset from './Fieldset';

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
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    skipReplace: PropTypes.bool,
    value: PropTypes.object.isRequired,
    method: PropTypes.string,
    action: PropTypes.string,
    autoComplete: PropTypes.string,
    children: PropTypes.node,
    tagName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    autoComplete: 'off',
    tagName: 'form',
  };

  static childContextTypes = {
    fieldset: PropTypes.object.isRequired,
  };

  static contextTypes = {
    fieldset: PropTypes.object,
  };

  componentWillReceiveProps(props) {
    const value = this.getValue();
    if (props.value !== value) {
      this.setValue(props.value, this, true);
    }
  }

  getPath() {
    return undefined;
  }

  getValue() {
    return this.props.value;
  }

  getOriginalValue() {
    return this.props.value;
  }

  getForm() {
    const parent = this.getParent();
    return parent
      ? parent.getForm()
      : this;
  }

  getStateFromProps(props, context) {
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
      ...super.getStateFromProps(props, context),
      validator,
    };
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
    const errors = this.errors || [];
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

  hasErrors(path, exact) {
    return !!this.getErrors(path, exact).length;
  }

  isValid(path, exact) {
    return !this.hasErrors(path, exact);
  }

  @autobind
  async onSubmit(evn) {
    evn.preventDefault();

    const { onSubmit, onError } = this.props;
    const value = this.getValue();
    const errors = this.errors = await this.validate(value);

    if (!errors.length && onSubmit) {
      onSubmit(value);
    } else if (errors.length && onError) {
      onError(errors);
    }
  }

  setValue(value, component, dontNotify) {
    this.clearErrors();

    super.setValue(value, component);
    if (dontNotify) {
      return;
    }

    const { onChange } = this.props;
    if (onChange) {
      onChange(value, component);
    }
  }

  clearErrors() {
    this.errors = [];
  }

  getClassName() {
    const { className, tagName } = this.props;
    return className || tagName;
  }

  render() {
    const { autoComplete, tagName, children, method, action } = this.props;

    const props = tagName === 'form' ? {
      autoComplete,
      method,
      action,
      className: this.getClassName(),
      onSubmit: this.onSubmit,
    } : {
      className: this.getClassName(),
    };

    return createElement(tagName, props, this.processChildren(children));
  }
}
