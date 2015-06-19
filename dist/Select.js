'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _element = require('./element');

var _element2 = _interopRequireDefault(_element);

var Select = (function (_Element) {
	function Select(props, context) {
		_classCallCheck(this, Select);

		_get(Object.getPrototypeOf(Select.prototype), 'constructor', this).call(this, props, context);
	}

	_inherits(Select, _Element);

	_createClass(Select, [{
		key: 'handleChange',
		value: function handleChange(value, items) {
			if (!this.props.multi) {
				this.props.onChange(value);
				return;
			}

			value = items.map(function (item) {
				return item.value;
			});

			this.props.onChange(value);
		}
	}, {
		key: 'renderOptions',
		value: function renderOptions() {
			var options = [];
			var value = this.props.value;

			if (this.props.placeholder) {
				options.push(_react2['default'].createElement(
					'option',
					{ value: this.props.placeholderValue || '' },
					this.props.placeholder
				));
			}

			var propsOptions = this.props.options;
			if (_.isPlainObject(propsOptions)) {
				Object.keys(propsOptions).forEach(function (option) {
					var name = propsOptions[option];
					options.push(_react2['default'].createElement(
						'option',
						{ value: option },
						name
					));
				});
			} else if (_.isArray(propsOptions)) {
				propsOptions.forEach(function (option) {
					options.push(_react2['default'].createElement(
						'option',
						{ value: option },
						option
					));
				});
			}

			return options;
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				'select',
				{
					className: this.props.className,
					name: this.props.name,
					value: this.props.value,
					multi: !!this.props.multi,
					onChange: this.handleChange.bind(this) },
				this.renderOptions()
			);
		}
	}]);

	return Select;
})(_element2['default']);

exports['default'] = Select;
;

Select.isElement = true;
Select.propTypes = {
	name: _react2['default'].PropTypes.string.isRequired
};
module.exports = exports['default'];