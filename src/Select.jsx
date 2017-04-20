import isPlainObject from 'lodash/isPlainObject';
import React from 'react';
import PropTypes from 'prop-types';
import Element from './Element';

const PLACEHOLDER_VALUE = ''; // null and undefined is uncontrolled value

export default class Select extends Element {
  static propTypes = {
    ...Element.propTypes,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
    //   ...this.state,
      options: this.prepareOptions(props.options),
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      options: this.prepareOptions(props.options),
    });
  }

  prepareOptions(options) {
    const selectOptions = [];

    if (isPlainObject(options)) {
      Object.keys(options).forEach((key) => {
        selectOptions.push({
          value: key,
          label: options[key],
        });
      });
    } else if (Array.isArray(options)) {
      options.forEach((option) => {
        const isObject = isPlainObject(option);

        selectOptions.push({
          value: isObject ? option.value : option,
          label: isObject ? option.label : option,
        });
      });
    }

    return selectOptions;
  }

  getValues() {
    const { options } = this.state;
    const value = this.getValue();
    const { placeholder } = this.props;

    const isMultiple = this.isMultiple();
    const values = [];

    options.forEach((option, pos) => {
      if (!isMultiple && option.value === value) {
        values.push(pos);
      } else if (isMultiple && value && value.length && value.indexOf(option.value) !== -1) {
        values.push(pos);
      }
    });

    if (!values.length && placeholder) {
      values.unshift(PLACEHOLDER_VALUE);
    }

    return isMultiple ? values : values[0];
  }

  onChange = (evn) => {
    evn.stopPropagation();

    const nodes = evn.target.options || [];
    const options = this.state.options;
    const values = [];

    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];

      if (!node.selected) {
        continue;
      }

      const optionValue = node.value;
      if (typeof optionValue === 'undefined' || !optionValue.length) {
        continue;
      }

      const optionIndex = Number(optionValue);
      if (!options[optionIndex]) {
        continue;
      }

      values.push(options[optionIndex].value);
    }

    const isMultiple = this.isMultiple();

    this.setValue(isMultiple ? values : values[0]);

    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(evn);
    }
  }

  renderPlaceholder() {
    const { placeholder } = this.props;
    if (typeof placeholder === 'undefined') {
      return null;
    }

    return (
      <option value={PLACEHOLDER_VALUE}>{placeholder}</option>
    );
  }

  isMultiple() {
    return !!this.props.multi || !!this.props.multiple;
  }

  getClassName() {
    const { className } = this.props;
    return className;
  }

  render() {
    const { options } = this.state;
    const { path, disabled, required } = this.props;
    const values = this.getValues();


    return (
      <select
        name={path}
        value={values}
        className={this.getClassName()}
        disabled={disabled}
        required={required}
        multiple={this.isMultiple()}
        onChange={this.onChange}
      >
        {this.renderPlaceholder()}

        {options.map((option, pos) => (
          <option value={pos} key={pos}>{option.label}</option>
        ))}
      </select>
    );
  }
}
