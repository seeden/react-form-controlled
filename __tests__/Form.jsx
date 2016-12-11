import React from 'react';
import { mount } from 'enzyme';
import Form from '../src';

describe('Form', () => {
  it('should be able to create simple instance', () => {
    const value = {
      inputValue: 123,
    };

    const wrapper = mount((
      <Form value={value} />
    ));

    expect(wrapper.find('form').length).toBe(1);
  });
});
