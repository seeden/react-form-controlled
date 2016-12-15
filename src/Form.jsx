import { PropTypes, createElement } from 'react';
import { autobind } from 'core-decorators';
import Fieldset from './Fieldset';

export default class Form extends Fieldset {
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
    debounce: PropTypes.number,
    validate: PropTypes.func,
  };

  static defaultProps = {
    autoComplete: 'off',
    tagName: 'form',
    debounce: 250,
  };

  static childContextTypes = {
    fieldset: PropTypes.object.isRequired,
  };

  static contextTypes = {
    fieldset: PropTypes.object,
  };

  componentWillReceiveProps(props) {
    this.setValue(props.value, this, true);
  }

  getPath() {
    return undefined;
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

    if (this.working) {
      return;
    }

    this.working = true;
    this.notifyChildren();

    const { onSubmit, onError, validate } = this.props;
    const value = this.getValue();

    this.errors = validate
      ? await validate(value)
      : [];

    const errors = this.errors;

    if (!errors.length && onSubmit) {
      await onSubmit(value);
    } else if (errors && errors.length && onError) {
      await onError(errors);
    }

    this.working = false;
    this.notifyChildren();
  }

  isWorking() {
    return !!this.working;
  }

  setValue(value, component, notifyChildren) {
    this.clearErrors();

    super.setValue(value, component, notifyChildren);
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
