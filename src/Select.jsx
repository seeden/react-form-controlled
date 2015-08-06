import React from 'react';
import Element from './Element';
import _ from 'lodash';

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

    let index = placeholder ? '' : void 0;
    selectOptions.forEach(function(option, pos) {
      if (option.value === value) {
        index = pos;
      }
    });

    return { options: selectOptions, index };
  }

  handleChange(e) {
    const target = e.target || {};
    let value = target.value;

    e.stopPropagation();

    if (value === '') {
      value = void 0;
    }

    if (typeof value === 'undefined' || value === null) {
      return this.props.onChange(value);
    }
    const index = Number(value);
    const options = this.state.options;
    const option = options[index] || {};

    this.props.onChange(option.value);
  }

  renderPlaceholder() {
    const props = this.props;

    if (typeof props.placeholder === 'undefined') {
      return null;
    }

    return <option value="">{props.placeholder}</option>;
  }

  render() {
    const { options, index } = this.state;

    return (
      <select
        className={this.props.className}
        name={this.props.name}
          value={index}
          multi={!!this.props.multi}
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
