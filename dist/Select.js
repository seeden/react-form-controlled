'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Element2 = require('./Element');

var _Element3 = _interopRequireDefault(_Element2);

var _isPlainObject = require('lodash/lang/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isArray = require('lodash/lang/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PLACEHOLDER_VALUE = ''; // null and undefined is uncontrolled value

var Select = function (_Element) {
  _inherits(Select, _Element);

  function Select(props, context) {
    _classCallCheck(this, Select);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Select).call(this, props, context));

    _this.state = _this.prepareState(props);
    return _this;
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

      if ((0, _isPlainObject2.default)(options)) {
        Object.keys(options).forEach(function (key) {
          selectOptions.push({
            value: key,
            label: options[key]
          });
        });
      } else if ((0, _isArray2.default)(options)) {
        options.forEach(function (option) {
          var isObject = (0, _isPlainObject2.default)(option);

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
    value: function handleChange(evn) {
      evn.stopPropagation();

      var nodes = evn.target.options || [];
      var options = this.state.options;
      var values = [];

      for (var index = 0; index < nodes.length; index++) {
        var node = nodes[index];

        if (!node.selected) {
          continue;
        }

        var optionValue = node.value;
        if (typeof optionValue === 'undefined' || !optionValue.length) {
          continue;
        }

        var optionIndex = Number(optionValue);
        if (!options[optionIndex]) {
          continue;
        }

        values.push(options[optionIndex].value);
      }

      var isMultiple = this.isMultiple();
      this.props.onChange(isMultiple ? values : values[0]);
    }
  }, {
    key: 'renderPlaceholder',
    value: function renderPlaceholder() {
      var placeholder = this.props.placeholder;

      if (typeof placeholder === 'undefined') {
        return null;
      }

      return _react2.default.createElement(
        'option',
        { value: PLACEHOLDER_VALUE },
        placeholder
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
      var _props = this.props;
      var path = _props.path;
      var name = _props.name;
      var className = _props.className;
      var disabled = _props.disabled;
      var required = _props.required;

      return _react2.default.createElement(
        'select',
        {
          name: path,
          'data-property': name,
          value: values,
          className: className,
          disabled: disabled,
          required: required,
          multiple: this.isMultiple(),
          onChange: this.handleChange.bind(this) },
        this.renderPlaceholder(),
        options.map(function (option, pos) {
          return _react2.default.createElement(
            'option',
            { value: pos, key: pos },
            option.label
          );
        })
      );
    }
  }]);

  return Select;
}(_Element3.default);

Select.isElement = true;
Select.propTypes = _extends({}, _Element3.default.propTypes, {
  disabled: _react.PropTypes.bool,
  className: _react.PropTypes.string
});
exports.default = Select;