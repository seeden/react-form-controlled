'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Input2 = require('./Input');

var _Input3 = _interopRequireDefault(_Input2);

var _diacritics = require('diacritics');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Word = function (_Input) {
  _inherits(Word, _Input);

  function Word() {
    _classCallCheck(this, Word);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Word).apply(this, arguments));
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
  }]);

  return Word;
}(_Input3.default);

Word.isElement = true;
Word.propTypes = _extends({}, _Input3.default.propTypes);
exports.default = Word;