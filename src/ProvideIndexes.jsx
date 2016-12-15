import ProvideProps from './ProvideProps';

export default class ProvideIndexes extends ProvideProps {
  getProps() {
    return {
      indexes: this.getIndexes(),
    };
  }
}
