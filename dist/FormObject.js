'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Element2 = require('./Element');

var _Element3 = _interopRequireDefault(_Element2);

var _lodashLangIsArray = require('lodash/lang/isArray');

var _lodashLangIsArray2 = _interopRequireDefault(_lodashLangIsArray);

var _lodashLangIsFunction = require('lodash/lang/isFunction');

var _lodashLangIsFunction2 = _interopRequireDefault(_lodashLangIsFunction);

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

var FormObject = (function (_Element) {
  _inherits(FormObject, _Element);

  function FormObject() {
    _classCallCheck(this, FormObject);

    _get(Object.getPrototypeOf(FormObject.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FormObject, [{
    key: 'getValue',
    value: function getValue(name) {
      var value = this.props.value || {};
      return value[name];
    }
  }, {
    key: 'setValue',
    value: function setValue(name, value) {
      var currentValue = this.props.value;
      var newState = (0, _lodashLangIsArray2['default'])(currentValue) ? [].concat(_toConsumableArray(this.props.value)) : _extends({}, this.props.value);

      newState[name] = value;

      this.props.onChange(newState);
    }
  }, {
    key: '_registerChild',
    value: function _registerChild(child) {
      var _this = this;

      if (!child || typeof child === 'string') {
        return child;
      }

      if (!(0, _lodashLangIsFunction2['default'])(child.type) || !child.type.isElement) {
        if (child.props && child.props.children) {
          var children = this._registerChildren(child.props.children);
          return _react2['default'].cloneElement(child, {}, children);
        }

        return child;
      }

      if (!child.props.name && child.props.name !== 0) {
        throw new Error('Form element has no name property');
      }

      var currentValue = this.getValue(child.props.name);

      return _react2['default'].cloneElement(child, {
        value: typeof child.props.value !== 'undefined' ? child.props.value : currentValue,
        currentValue: currentValue,
        onChange: function onChange(value) {
          return _this.setValue(child.props.name, value);
        }
      });
    }
  }, {
    key: '_registerChildren',
    value: function _registerChildren(children) {
      var _this2 = this;

      if (!(0, _lodashLangIsArray2['default'])(children)) {
        return this._registerChild(children);
      }

      return _react2['default'].Children.map(children, function (child) {
        return _this2._registerChild(child);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this._registerChildren(this.props.children);

      return _react2['default'].createElement(
        'div',
        { onChange: this.handleChange.bind(this) },
        children
      );
    }
  }, {
    key: 'handleChange',
    value: function handleChange(evn) {
      var target = evn.target;
      if (!target || !target.name) {
        return;
      }

      evn.stopPropagation();

      var value = target.type === 'checkbox' ? !!target.checked : target.value;

      if (target.type === 'number' && isNumeric(value)) {
        value = Number(value);
      }

      this.setValue(target.name, value);
    }
  }], [{
    key: 'propTypes',
    value: {
      onChange: _react2['default'].PropTypes.func.isRequired
    },
    enumerable: true
  }]);

  return FormObject;
})(_Element3['default']);

exports['default'] = FormObject;
module.exports = exports['default'];