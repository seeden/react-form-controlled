'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Input2 = require('./Input');

var _Input3 = _interopRequireDefault(_Input2);

var Textarea = (function (_Input) {
	function Textarea() {
		_classCallCheck(this, Textarea);

		if (_Input != null) {
			_Input.apply(this, arguments);
		}
	}

	_inherits(Textarea, _Input);

	_createClass(Textarea, [{
		key: 'render',
		value: function render() {
			return _react2['default'].createElement('textarea', {
				onChange: this.handleChange.bind(this),
				disabled: this.props.disabled,
				className: this.props.className,
				name: this.props.name,
				id: this.props.id,
				rows: this.props.rows,
				required: this.props.required,
				placeholder: this.props.placeholder,
				value: this.state.value });
		}
	}]);

	return Textarea;
})(_Input3['default']);

exports['default'] = Textarea;
;

Textarea.isElement = true;
Textarea.propTypes = {
	name: _react2['default'].PropTypes.string.isRequired
};
module.exports = exports['default'];