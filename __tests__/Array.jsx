import React from 'react';
import { mount } from 'enzyme';
import Form from '../src';

describe('Up', () => {
  it('should be able to move item in array', (done) => {
    const value = {
      items: [1, 2, 3],
    };

    function onChange(state) {
      expect(state.items).toEqual([1, 3, 2]);
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <fieldset name="items">
          <input name="." />
          <button type="button" up>Up</button>
        </fieldset>
      </Form>
   ));

    expect(wrapper.find('input').first().props().value).toBe(1);

    wrapper.find('button').last().simulate('click');
  });
});

describe('Down', () => {
  it('should be able to move item in array', (done) => {
    const value = {
      items: [1, 2, 3],
    };

    function onChange(state) {
      expect(state.items).toEqual([2, 1, 3]);
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <fieldset name="items">
          <input name="." />
          <button type="button" down>Down</button>
        </fieldset>
      </Form>
    ));

    expect(wrapper.find('input').first().props().value).toBe(1);

    wrapper.find('button').first().simulate('click');
  });
});

describe('Remove', () => {
  it('should be able to move item in array', (done) => {
    const value = {
      items: [1, 2, 3],
    };

    function onChange(state) {
      expect(state.items).toEqual([2, 3]);
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <fieldset name="items">
          <input name="." />
          <button type="button" remove>Remove</button>
        </fieldset>
      </Form>
   ));

    wrapper.find('button').first().simulate('click');
  });
});
