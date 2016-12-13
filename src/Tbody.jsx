import Fieldset from './Fieldset';

export default class Tbody extends Fieldset {
  static defaultProps = {
    ...Fieldset.defaultProps,
    tagName: 'tbody',
  };
}
