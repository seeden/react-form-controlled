'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _element = require('./element');

var _element2 = _interopRequireDefault(_element);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeExtend = require('node.extend');

var _nodeExtend2 = _interopRequireDefault(_nodeExtend);

var FormObject = (function (_Element) {
    function FormObject() {
        _classCallCheck(this, FormObject);

        if (_Element != null) {
            _Element.apply(this, arguments);
        }
    }

    _inherits(FormObject, _Element);

    _createClass(FormObject, [{
        key: 'getValue',
        value: function getValue(name) {
            var value = this.props.value || {};
            return value[name];
        }
    }, {
        key: 'setValue',
        value: function setValue(name, value) {
            var newState = (0, _nodeExtend2['default'])({}, this.props.value, _defineProperty({}, name, value));

            this.props.onChange(newState);
        }
    }, {
        key: '_registerChild',
        value: function _registerChild(child) {
            var _this = this;

            if (!child || typeof child === 'string') {
                return child;
            }

            if (!_lodash2['default'].isFunction(child.type) || !child.type.isElement) {
                if (child.props && child.props.children) {
                    var children = this._registerChildren(child.props.children);
                    return _react2['default'].cloneElement(child, {}, children);
                }

                return child;
            }

            if (!child.props.name) {
                throw new Error('Form element has no name property');
            }

            return _react2['default'].cloneElement(child, {
                value: this.getValue(child.props.name),
                onChange: function onChange(value) {
                    return _this.setValue(child.props.name, value);
                }
            });
        }
    }, {
        key: '_registerChildren',
        value: function _registerChildren(children) {
            var _this2 = this;

            if (!_lodash2['default'].isArray(children)) {
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
        value: function handleChange(e) {
            var target = e.target;
            if (!target || !target.name) {
                return;
            }

            e.stopPropagation();

            var value = target.type === 'checkbox' ? !!target.checked : target.value;

            this.setValue(target.name, value);
        }
    }]);

    return FormObject;
})(_element2['default']);

exports['default'] = FormObject;
;

FormObject.propTypes = {
    onChange: _react2['default'].PropTypes.func.isRequired
};
module.exports = exports['default'];