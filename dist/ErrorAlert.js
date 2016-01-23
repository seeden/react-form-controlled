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

var ErrorAlert = function (_Element) {
  _inherits(ErrorAlert, _Element);

  function ErrorAlert() {
    _classCallCheck(this, ErrorAlert);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ErrorAlert).apply(this, arguments));
  }

  _createClass(ErrorAlert, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var path = _props.path;
      var form = _props.form;
      var className = _props.className;
      var processError = _props.processError;

      if (!path || !form) {
        return null;
      }

      var errors = form.getErrors(path);
      if (!errors || !errors.length) {
        return null;
      }

      return _react2.default.createElement(
        'div',
        { className: className, role: 'alert' },
        this.props.children || errors.map(function (error) {
          return processError ? processError(error) : error.message;
        })
      );
    }
  }]);

  return ErrorAlert;
}(_Element3.default);

ErrorAlert.isElement = true;
ErrorAlert.propTypes = _extends({}, _Element3.default.propTypes, {
  className: _react.PropTypes.string,
  processError: _react.PropTypes.func
});
ErrorAlert.defaultProps = {
  className: 'alert alert-danger'
};
exports.default = ErrorAlert;