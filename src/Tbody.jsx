import Fieldset from './Fieldset';

export default class Tbody extends Fieldset {
  static contextTypes = {
    ...Fieldset.contextTypes,
  };

  static isElement = Fieldset.isElement;

  static propTypes = {
    ...Fieldset.propTypes,
  };

  static defaultProps = {
    ...Fieldset.defaultProps,
    tagName: 'tbody',
  };
}
