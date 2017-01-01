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

  state = {};

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
    const { sameChildren } = nextProps;
    const form = this.getForm();

    if (sameChildren === true) {
      return true;
    }

    if (typeof sameChildren === 'undefined' && form.props.sameChildren === true) {
      return true;
    }

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
    if (!fieldset) {
      return undefined;
    }

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
    if (!parent) {
      return undefined;
    }

    return parent.buildPath(name);
  }

  getForm() {
    const parent = this.getParent();
    if (!parent) {
      return undefined;
    }

    return parent.getForm();
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
