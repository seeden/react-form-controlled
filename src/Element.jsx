import { Component, PropTypes } from 'react';
import shallowEqual from './utils/shallowCompare';

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

    this.value = this.getOriginalValue(props, context);
  }

  componentDidMount() {
    const parent = this.getParent();
    // I am form
    if (!parent) {
      return;
    }

    parent.registerChild(this, this.props.name);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const sameProps = shallowEqual(this.props, nextProps, ['children']);
    if (!sameProps) {
      return true;
    }

    const sameState = shallowEqual(this.state, nextState, []);
    if (!sameState) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    const parent = this.getParent();
    // I am form
    if (!parent) {
      return;
    }

    parent.unregisterChild(this, this.props.name);
  }

  getIndexes() {
    return this.getParent().getIndexes();
  }

  getOriginalValue(props, context) {
    const { name } = props;
    const { fieldset } = context;

    return fieldset.getChildValue(name);
  }

  getValue() {
    return this.value;
  }

  getParent() {
    return this.context.fieldset;
  }

  getPath() {
    const { name } = this.props;
    const parent = this.getParent();

    return parent.buildPath(name);
  }

  getForm() {
    return this.getParent().getForm();
  }

  setValue(value, component = this, notifyChildren) {
    const { value: currentValue } = this;
    if (currentValue === value) {
      return;
    }

    this.value = value;

    if (notifyChildren) {
      this.forceUpdate();
      return;
    }

    this.notifyParent(value, component);

    if (component === this) {
      this.forceUpdate();
    }
  }

  replaceChildren(children) {
    return this.getParent().replaceChildren(children);
  }

  originalValueChanged() {
    const value = this.getOriginalValue(this.props, this.context);
    this.setValue(value, this, true);
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
