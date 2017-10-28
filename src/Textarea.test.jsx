import React from 'react';
import { mount } from 'enzyme';
import Form, {
  Textarea,
} from '../src';

describe('Textarea', () => {
  it('should be able to create textarea', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      expect(state.inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Textarea name="inputValue" />
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('textarea').props().value).toBe(123);
    expect(wrapper.find('textarea').get(0).value).toBe('123');

    wrapper.find('textarea').simulate('change', { target: {
      value: '222',
    } });
  });

  it('should be able to create textarea with standard textarea', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      expect(state.inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <textarea name="inputValue" />
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('textarea').props().value).toBe(123);
    expect(wrapper.find('textarea').at(0).value).toBe('123');

    wrapper.find('textarea').simulate('change', { target: {
      value: '222',
    } });
  });
});
