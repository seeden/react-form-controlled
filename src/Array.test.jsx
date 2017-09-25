import React from 'react';
import { mount } from 'enzyme';
import Form, { Remove, Down, Up } from '../src';

describe('Up', () => {
  it('should be able to move up item in array', (done) => {
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
          <Up
            render={({ onClick }) => (
              <button type="button" onClick={onClick}>Up</button>
            )}
          />
        </fieldset>
      </Form>
    ));

    expect(wrapper.find('input').first().props().value).toBe(1);

    wrapper.find('button').last().simulate('click');
  });
});

describe('Down', () => {
  it('should be able to move down item in array', (done) => {
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
          <Down
            render={({ onClick }) => (
              <button type="button" onClick={onClick}>Down</button>
            )}
          />
        </fieldset>
      </Form>
    ));

    expect(wrapper.find('input').first().props().value).toBe(1);

    wrapper.find('button').first().simulate('click');
  });
});

describe('Remove', () => {
  it('should be able to remove item from array', (done) => {
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
          <Remove
            render={({ onClick }) => (
              <button type="button" onClick={onClick}>Remove</button>
            )}
          />
        </fieldset>
      </Form>
    ));

    wrapper.find('button').first().simulate('click');
  });
});

describe('Remove pure', () => {
  it('should be able to remove item from array as children function', (done) => {
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
          <Remove>
            {({ onClick }) =>
              <button type="button" onClick={onClick}>Remove</button>
            }
          </Remove>
        </fieldset>
      </Form>
    ));

    wrapper.find('button').first().simulate('click');
  });
});
