'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Input2 = require('./Input');

var _Input3 = _interopRequireDefault(_Input2);

var _diacritics = require('diacritics');

function fixValue(value) {
  if (!value) {
    return value;
  }

  // remove white spaces
  var valueChanged = value.replace(/\s/g, '');

  // remove diacritics
  valueChanged = (0, _diacritics.remove)(valueChanged);

  // to lowercase
  valueChanged = valueChanged.toLowerCase();

  return valueChanged;
}

var Word = (function (_Input) {
  _inherits(Word, _Input);

  function Word() {
    _classCallCheck(this, Word);

    _get(Object.getPrototypeOf(Word.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Word, [{
    key: 'handleChange',
    value: function handleChange(evn) {
      var target = evn.target || {};

      var fixedValue = fixValue(target.value);
      if (fixedValue !== target.value) {
        target.value = fixedValue;
      }

      _get(Object.getPrototypeOf(Word.prototype), 'handleChange', this).call(this, evn);
    }
  }], [{
    key: 'isElement',
    value: true,
    enumerable: true
  }, {
    key: 'propTypes',
    value: _Input3['default'].propTypes,
    enumerable: true
  }]);

  return Word;
})(_Input3['default']);

exports['default'] = Word;
module.exports = exports['default'];