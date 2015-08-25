import React from 'react';
import Element from './Element';
import _ from 'lodash';

const PLACEHOLDER_VALUE = '';

export default class Select extends Element {
  static isElement = true;
  static propTypes = {
    name: React.PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = this.prepareState(props);
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.prepareState(newProps));
  }

  prepareState(props) {
    const selectOptions = [];
    const { options, value, placeholder } = props;

    if (_.isPlainObject(options)) {
      Object.keys(options).forEach(function(key) {
        selectOptions.push({
          value: key,
          label: options[key]
        });
      });
    } else if (_.isArray(options)) {
      options.forEach(function(option) {
        const isObject = _.isPlainObject(option);

        selectOptions.push({
          value: isObject ? option.value : option,
          label: isObject ? option.label : option
        });
      });
    }

    const isMultiple = this.isMultiple();
    const values = [];

    selectOptions.forEach(function(option, pos) {
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
      values: isMultiple ? values : values[0]
    };
  }

  handleChange(e) {
    e.stopPropagation();

    const nodes = e.target.options || [];
    const options = this.state.options;
    const values = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (!node.selected) {
        continue;
      }

      const optionValue = node.value;
      if (typeof optionValue === 'undefined' || !optionValue.length) {
        continue;
      }

      const index = Number(optionValue);
      if (!options[index]) {
        continue;
      }

      values.push(options[index].value);
    }

    const isMultiple = this.isMultiple();
    this.props.onChange(isMultiple ? values : values[0]);
  }

  renderPlaceholder() {
    const props = this.props;

    if (typeof props.placeholder === 'undefined') {
      return null;
    }

    return <option value={PLACEHOLDER_VALUE}>{props.placeholder}</option>;
  }

  isMultiple() {
    return !!this.props.multi || !!this.props.multiple;
  }

  render() {
    const { options, values } = this.state;

    return (
      <select
        className={this.props.className}
        name={this.props.name}
        value={values}
        multiple={this.isMultiple()}
        disabled={this.props.disabled}
        required={this.props.required}
        onChange={this.handleChange.bind(this)}>
          {this.renderPlaceholder()}

          {options.map(function(option, pos) {
            return <option value={pos}>{option.label}</option>;
          })}
      </select>
    );
  }
}
