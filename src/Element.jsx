import { Component, PropTypes } from 'react';
import shallowCompare from './utils/shallowCompare';

export default class Element extends Component {
  static propTypes = {
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    valueIndex: PropTypes.bool,
    children: PropTypes.node,
    value: PropTypes.any,
    parent: PropTypes.object,
  };

  static isElement = true;

  constructor(props, context) {
    super(props, context);

    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.getStateFromProps(props));
  }

  getStateFromProps(props) {
    return {
      value: props.value,
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext, ignoreProps = [], ignoreState = ignoreProps) {
    const { props, state } = this;

    if (!shallowCompare(props, nextProps, ['value', ...ignoreProps])) {
      return true;
    }

    if (!shallowCompare(state, nextState, ignoreState)) {
      return true;
    }

    return false;
  }

  getParent() {
    return this.props.parent;
  }

  getValue() {
    return this.state.value;
  }

  getPath() {
    const parent = this.getParent();
    const parentPath = parent.getPath();
    const { name } = this.props;

    return parentPath ? `${parentPath}.${name}` : name;
  }

  getForm() {
    const parent = this.getParent();
    return parent.getForm();
  }

  setValue(value, component = this) {
    this.setState({ value });

    this.notifiyParent(value, component);
  }

  notifiyParent(value, component) {
    const parent = this.getParent();
    if (!parent) {
      return;
    }

    parent.setChildValue(this.props.name, value, component);
  }

  render() {
    return null;
  }
}
