import React from 'react';
import ProvideProps from './ProvideProps';

export default class Working extends ProvideProps {
  componentDidMount() {
    const form = this.getForm();
    form.registerChild(this);
  }

  componentWillUnmount() {
    const form = this.getForm();
    form.unregisterChild(this);
  }

  originalValueChanged() {
    const form = this.getForm();

    this.setState({
      isWorking: form.isWorking(),
    });
  }

  renderEmptyChildren({ isWorking }) {
    return (
      <span>{isWorking ? 'working' : 'idle'}</span>
    );
  }

  getProps() {
    return {
      isWorking: this.state.isWorking,
    };
  }
}
