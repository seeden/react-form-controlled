import ProvideProps from './ProvideProps';

export default class ProvideIndexes extends ProvideProps {
  getProps() {
    const parent = this.getParent();
    const index = Number(parent.props.name);

    return {
      index,
    };
  }
}
