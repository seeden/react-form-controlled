'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Element2 = require('./Element');

var _Element3 = _interopRequireDefault(_Element2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var PLACEHOLDER_VALUE = '';

var Select = (function (_Element) {
  _inherits(Select, _Element);

  _createClass(Select, null, [{
    key: 'isElement',
    value: true,
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      name: _react2['default'].PropTypes.string.isRequired
    },
    enumerable: true
  }]);

  function Select(props, context) {
    _classCallCheck(this, Select);

    _get(Object.getPrototypeOf(Select.prototype), 'constructor', this).call(this, props, context);

    this.state = this.prepareState(props);
  }

  _createClass(Select, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this.setState(this.prepareState(newProps));
    }
  }, {
    key: 'prepareState',
    value: function prepareState(props) {
      var selectOptions = [];
      var options = props.options;
      var value = props.value;
      var placeholder = props.placeholder;

      if (_lodash2['default'].isPlainObject(options)) {
        Object.keys(options).forEach(function (key) {
          selectOptions.push({
            value: key,
            label: options[key]
          });
        });
      } else if (_lodash2['default'].isArray(options)) {
        options.forEach(function (option) {
          var isObject = _lodash2['default'].isPlainObject(option);

          selectOptions.push({
            value: isObject ? option.value : option,
            label: isObject ? option.label : option
          });
        });
      }

      var isMultiple = this.isMultiple();
      var values = [];

      selectOptions.forEach(function (option, pos) {
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
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      e.stopPropagation();

      var nodes = e.target.options || [];
      var options = this.state.options;
      var values = [];

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        if (!node.selected) {
          continue;
        }

        var optionValue = node.value;
        if (typeof optionValue === 'undefined' || !optionValue.length) {
          continue;
        }

        var index = Number(optionValue);
        if (!options[index]) {
          continue;
        }

        values.push(options[index].value);
      }

      var isMultiple = this.isMultiple();
      this.props.onChange(isMultiple ? values : values[0]);
    }
  }, {
    key: 'renderPlaceholder',
    value: function renderPlaceholder() {
      var props = this.props;

      if (typeof props.placeholder === 'undefined') {
        return null;
      }

      return _react2['default'].createElement(
        'option',
        { value: PLACEHOLDER_VALUE },
        props.placeholder
      );
    }
  }, {
    key: 'isMultiple',
    value: function isMultiple() {
      return !!this.props.multi || !!this.props.multiple;
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state;
      var options = _state.options;
      var values = _state.values;

      return _react2['default'].createElement(
        'select',
        {
          className: this.props.className,
          name: this.props.name,
          value: values,
          multiple: this.isMultiple(),
          disabled: this.props.disabled,
          required: this.props.required,
          onChange: this.handleChange.bind(this) },
        this.renderPlaceholder(),
        options.map(function (option, pos) {
          return _react2['default'].createElement(
            'option',
            { value: pos },
            option.label
          );
        })
      );
    }
  }]);

  return Select;
})(_Element3['default']);

exports['default'] = Select;
module.exports = exports['default'];