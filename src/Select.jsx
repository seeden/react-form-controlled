import React, { PropTypes } from 'react';
import Element from './Element';
import isPlainObject from 'lodash/lang/isPlainObject';
import isArray from 'lodash/lang/isArray';

const PLACEHOLDER_VALUE = ''; // null and undefined is uncontrolled value

export default class Select extends Element {
  static isElement = Element.isElement;

  static propTypes = {
    ...Element.propTypes,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);

    this.state = this.prepareState(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.prepareState(newProps));
  }

  prepareState(props) {
    const selectOptions = [];
    const { options, value, placeholder } = props;

    if (isPlainObject(options)) {
      Object.keys(options).forEach((key) => {
        selectOptions.push({
          value: key,
          label: options[key],
        });
      });
    } else if (isArray(options)) {
      options.forEach((option) => {
        const isObject = isPlainObject(option);

        selectOptions.push({
          value: isObject ? option.value : option,
          label: isObject ? option.label : option,
        });
      });
    }

    const isMultiple = this.isMultiple();
    const values = [];

    selectOptions.forEach((option, pos) => {
      if (!isMultiple && option.value === value) {
        values.push(pos);
      } else if (isMultiple && value && value.length && value.indexOf(option.value) !== -1) {
        values.push(pos);
      }
    });

    if (!values.length && placeholder) {
      values.unshift(PLACEHOLDER_VALUE);
    }

    return {
      options: selectOptions,
      values: isMultiple ? values : values[0],
    };
  }

  handleChange(evn) {
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
    const { originalProps, onChange } = this.props;

    onChange(isMultiple ? values : values[0], this);

    if (typeof originalProps.onChange === 'function') {
      originalProps.onChange(evn);
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

  render() {
    const { options, values } = this.state;
    const { path, className, disabled, required } = this.props;

    return (
      <select
        name={path}
        value={values}
        className={className}
        disabled={disabled}
        required={required}
        multiple={this.isMultiple()}
        onChange={this.handleChange}>
          {this.renderPlaceholder()}

          {options.map((option, pos) => {
            return (
              <option value={pos} key={pos}>{option.label}</option>
            );
          })}
      </select>
    );
  }
}
