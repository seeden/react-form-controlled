import { Component, PropTypes } from 'react';
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
  };

  static contextTypes = {
    parent: PropTypes.object.isRequired,
  };

  static defaultProps = {
  };

  static isElement = true;

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: this.getValue(),
    };
  }
/*
  componentWillReceiveProps() {
    const newValue = this.getValue();
    this.setState({
      value: newValue,
    });*/
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
//  }
/*
  componentWillUnmount() {
    this.clearTimeout();
  }*/

  getParent() {
    return this.context.parent;
  }

  getValue() {
    const parent = this.getParent();

    return parent.getValue(this.props.name);
  }

  getOriginalValue() {
    const parent = this.getParent();
    const { value, valueIndex } = this.props;

    if (valueIndex) {
      return parent.props.index;
    }

    return value;
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
