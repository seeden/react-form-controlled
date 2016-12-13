import { Component, PropTypes } from 'react';

export default class Element extends Component {
  static propTypes = {
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };

  static contextTypes = {
    fieldset: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: this.getOriginalValue(props, context),
    };
  }

  getOriginalValue(props, context) {
    const { name } = props;
    const { fieldset } = context;

    return fieldset.getChildValue(name);
  }

  getValue() {
    return this.state.value;
  }

  getParent() {
    return this.context.fieldset;
  }

  getPath() {
    const { name } = this.props;
    const parent = this.getParent();
    const parentPath = parent.getPath();

    return parentPath
      ? `${parentPath}.${name}`
      : name;
  }

  getForm() {
    return this.getParent().getForm();
  }

  setValue(value, component = this) {
    this.setState({ value });

    this.notifyParent(value, component);
  }

  replaceChildren(children) {
    return this.getParent().replaceChildren(children);
  }

  notifyParent(value, component) {
    const { name } = this.props;
    const parent = this.getParent();

    // form has no parent
    if (parent) {
      parent.setChildValue(name, value, component);
    }
  }

  render() {
    return null;
  }
}
