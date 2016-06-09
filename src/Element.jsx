import { Component, PropTypes } from 'react';
import shallowCompare from './utils/shallowCompare';

const DIFF_TIMEOUT = 100;

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

    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value,
    });
/*
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      const newValue = this.getValue();
      if (this.state.value === newValue) {
        return;
      }

      this.setState({
        value: newValue,
      });
    }, DIFF_TIMEOUT);*/
  }

  shouldComponentUpdate(nextProps, nextState, nextContext, ignore = []) {
    const { props, state } = this;

    if (!shallowCompare(props, nextProps, ['value', ...ignore])) {
      return true;
    }

    if (!shallowCompare(state, nextState, ignore)) {
      return true;
    }

    return false;
  }

/*
  componentWillUnmount() {
    this.clearTimeout();
  }*/

  getParent() {
    return this.props.parent;
  }

  getValue() {
    return this.state.value;
  }

  setValue(value, component = this) {
    //this.clearTimeout();
    this.setState({ value });

    const parent = this.getParent();
    if (!parent) {
      return;
    }

    parent.setValue(this.props.name, value, component);
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
/*
  clearTimeout() {
    if (!this.timeoutId) {
      return;
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }*/

  render() {
    return null;
  }
}
