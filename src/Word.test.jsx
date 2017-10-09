import React from 'react';
import { mount } from 'enzyme';
import Form, {
  Word,
} from '../src';

describe('Word', () => {
  it('should be able to create word', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      expect(state.inputValue).toBe('222lsctzy');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Word name="inputValue" />
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').props().value).toBe(123);

    wrapper.find('input').simulate('change', { target: {
      value: '222 ľščťžý',
    }});
  });
});
