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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DIFF_TIMEOUT = 100;

function fixUncontrolledValue(value) {
  return typeof value === 'undefined' || value === null ? '' : value;
}

var Input = function (_Element) {
  _inherits(Input, _Element);

  function Input(props, context) {
    _classCallCheck(this, Input);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Input).call(this, props, context));

    _this.state = {
      value: fixUncontrolledValue(props.value) };
    return _this;
  }

  _createClass(Input, [{
    key: '_clearChangeTimeout',
    // fix because null and undefined is uncontrolled
    value: function _clearChangeTimeout() {
      if (!this.timeoutId) {
        return;
      }

      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(evn) {
      var target = evn.target || {};
      var value = target.type === 'checkbox' ? !!target.checked : target.value;

      this._clearChangeTimeout();

      this.setState({ value: value });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var _this2 = this;

      var isDiff = this.state.value !== newProps.value;
      if (!isDiff) {
        return;
      }

      // wait for it
      this.timeoutId = setTimeout(function () {
        _this2.timeoutId = null;

        if (_this2.state.value === _this2.props.value) {
          return;
        }

        _this2.setState({
          value: fixUncontrolledValue(_this2.props.value)
        });
      }, DIFF_TIMEOUT);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._clearChangeTimeout();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var type = _props.type;
      var originalProps = _props.originalProps;
      var value = _props.value;
      var currentValue = _props.currentValue;
      var path = _props.path;
      var name = _props.name;

      var checked = type === 'checkbox' && value || type === 'radio' && value === currentValue;

      return _react2.default.createElement('input', _extends({}, originalProps, {
        name: path,
        'data-property': name,
        onChange: this.handleChange.bind(this),
        checked: checked ? checked : void 0,
        value: this.state.value }));
    }
  }]);

  return Input;
}(_Element3.default);

Input.isElement = true;
Input.propTypes = _extends({}, _Element3.default.propTypes, {
  autoComplete: _react.PropTypes.string.isRequired,
  type: _react.PropTypes.string.isRequired,
  disabled: _react.PropTypes.bool,
  className: _react.PropTypes.string
});
Input.defaultProps = {
  autoComplete: 'off',
  type: 'text'
};
exports.default = Input;