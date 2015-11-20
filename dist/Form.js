'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _FormObject2 = require('./FormObject');

var _FormObject3 = _interopRequireDefault(_FormObject2);

var DEFAULT_INVALID_ERROR = 'Form is invalid';

var Form = (function (_FormObject) {
  _inherits(Form, _FormObject);

  _createClass(Form, null, [{
    key: 'propTypes',
    value: {
      onSubmit: _react.PropTypes.func.isRequired,
      onChange: _react.PropTypes.func.isRequired,
      onError: _react.PropTypes.func,
      ajvOptions: _react.PropTypes.object.isRequired
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      ajvOptions: {
        allErrors: true
      }
    },
    enumerable: true
  }]);

  function Form(props, context) {
    _classCallCheck(this, Form);

    _get(Object.getPrototypeOf(Form.prototype), 'constructor', this).call(this, props, context);

    this.errors = [];

    var ajv = (0, _ajv2['default'])(props.ajvOptions);
    this.validateData = ajv.compile(props.schema || {});
  }

  _createClass(Form, [{
    key: 'validate',
    value: function validate(callback) {
      this.errors = [];

      var schema = this.props.schema;
      if (!schema) {
        return callback(null, true);
      }

      var isValid = this.validateData(this.props.value);
      if (isValid) {
        return callback(null, true);
      }

      var errors = this.errors = this.validateData.errors || [];
      errors.forEach(function (err) {
        if (!err.dataPath) {
          return;
        }

        err.path = err.dataPath.substr(1);
      });

      var err = new Error(DEFAULT_INVALID_ERROR);
      err.errors = errors;

      callback(err);
    }
  }, {
    key: 'getErrors',
    value: function getErrors(path) {
      var errors = this.errors;
      if (!path) {
        return errors;
      }

      var ret = [];

      for (var index = 0; index < errors.length; index++) {
        var error = errors[index];
        if (error.path !== path) {
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
    value: function handleSubmit(evn) {
      var _this = this;

      evn.preventDefault();

      this.validate(function (err) {
        if (err) {
          if (_this.props.onError) {
            _this.props.onError(err);
          }

          //redraw for ErrorAlert
          _this.setState({
            error: err
          });

          return;
        }

        _this.setState({
          error: null
        });

        _this.props.onSubmit(_this.props.value);
      });
    }
  }, {
    key: 'handleChange',
    value: function handleChange(evn) {
      this.errors = [];

      _get(Object.getPrototypeOf(Form.prototype), 'handleChange', this).call(this, evn);
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