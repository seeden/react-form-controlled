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

var _jsen = require('jsen');

var _jsen2 = _interopRequireDefault(_jsen);

var _FormObject2 = require('./FormObject');

var _FormObject3 = _interopRequireDefault(_FormObject2);

var Form = (function (_FormObject) {
  _inherits(Form, _FormObject);

  _createClass(Form, null, [{
    key: 'propTypes',
    value: {
      onSubmit: _react2['default'].PropTypes.func.isRequired,
      onChange: _react2['default'].PropTypes.func.isRequired
    },
    enumerable: true
  }]);

  function Form(props, context) {
    _classCallCheck(this, Form);

    _get(Object.getPrototypeOf(Form.prototype), 'constructor', this).call(this, props, context);

    this.validateData = (0, _jsen2['default'])(props.schema || {});
  }

  _createClass(Form, [{
    key: 'validate',
    value: function validate(callback) {
      var schema = this.props.schema;
      if (!schema) {
        return callback(null, true);
      }

      var isValid = this.validateData(this.props.value);
      var errors = this.validateData.errors;

      this.setState({
        errors: errors && errors.length ? errors : null
      });

      callback(null, isValid, errors);
    }
  }, {
    key: 'getErrors',
    value: function getErrors(path) {
      var errors = this.state.errors || [];

      if (!path) {
        return errors;
      }

      var schemaPath = '#/' + path;
      var ret = [];

      for (var i = 0; i < errors.length; i++) {
        var error = errors[i];
        if (error.path !== schemaPath) {
          continue;
        }

        ret.push(error);
      }
      return ret;
    }
  }, {
    key: 'hasErrors',
    value: function hasErrors(path) {
      return !!this.getErrors(path).length;
    }
  }, {
    key: 'isValid',
    value: function isValid(path) {
      return !this.hasErrors(path);
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this = this;

      e.preventDefault();

      this.validate(function (err, valid) {
        if (!valid) {
          return;
        }

        _this.props.onSubmit(_this.props.value);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this._registerChildren(this.props.children);
      var autoComplete = typeof this.props.autoComplete !== 'undefined' ? this.props.autoComplete : 'off';

      return _react2['default'].createElement(
        'form',
        {
          autoComplete: autoComplete,
          method: this.props.method,
          action: this.props.action,
          className: this.props.className || 'form',
          onSubmit: this.handleSubmit.bind(this),
          onChange: this.handleChange.bind(this) },
        children
      );
    }
  }]);

  return Form;
})(_FormObject3['default']);

exports['default'] = Form;
module.exports = exports['default'];