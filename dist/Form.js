'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _Fieldset2 = require('./Fieldset');

var _Fieldset3 = _interopRequireDefault(_Fieldset2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_INVALID_ERROR = 'Form is invalid';

function errorToProperty(err) {
  switch (err.keyword) {
    case 'required':
      return err.params.missingProperty;
    default:
      return void 0;
  }
}

var Form = function (_Fieldset) {
  _inherits(Form, _Fieldset);

  function Form(props, context) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this, props, context));

    _this.errors = [];

    var ajv = (0, _ajv2.default)(props.ajvOptions);
    _this.validateData = ajv.compile(props.schema || {});
    return _this;
  }

  _createClass(Form, [{
    key: 'getFormProps',
    value: function getFormProps() {
      return this.props;
    }
  }, {
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
        var prop = errorToProperty(err);
        var path = err.dataPath ? err.dataPath.substr(1) : null;

        err.path = path ? path + '.' + prop : prop;
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
      var _this2 = this;

      evn.preventDefault();

      this.validate(function (err) {
        if (err) {
          if (_this2.props.onError) {
            _this2.props.onError(err);
          }

          // redraw for ErrorAlert
          _this2.setState({
            error: err
          });

          return;
        }

        _this2.setState({
          error: null
        });

        if (_this2.props.onSubmit) {
          _this2.props.onSubmit(_this2.props.value);
        }
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

      return _react2.default.createElement(
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
}(_Fieldset3.default);

Form.propTypes = {
  onChange: _react.PropTypes.func.isRequired,
  onSubmit: _react.PropTypes.func.isRequired,
  onError: _react.PropTypes.func,
  ajvOptions: _react.PropTypes.object.isRequired,
  replace: _react.PropTypes.bool.isRequired
};
Form.defaultProps = {
  ajvOptions: {
    allErrors: true,
    verbose: true
  },
  onChange: function onChange() {},
  onSubmit: function onSubmit() {},
  replace: true
};
exports.default = Form;