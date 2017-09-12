import React from 'react';
import { mount } from 'enzyme';
import Form, {
  Select,
} from '../src';

describe('Select', () => {
  it('should be able to create select', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      expect(state.inputValue).toBe(456);
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <select name="inputValue" options={[123, 456]} />
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('option').length).toBe(2);
    expect(wrapper.find('select').props().value).toBe(0);

    wrapper.find('select').simulate('change', { target: {
      options: wrapper.find('option').map(option => ({
        value: option.node.value,
        selected: option.node.value === '1',
      })),
    } });
  });
});
