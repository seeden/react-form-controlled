import React from 'react';
import { mount } from 'enzyme';
import Form, { Remove, Down, Up } from '../src';

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
          <Up>
            <button type="button">Up</button>
          </Up>
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
          <Down>
            <button type="button">Down</button>
          </Down>
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
          <Remove>
            <button type="button"></button>
          </Remove>
        </fieldset>
      </Form>
   ));

    wrapper.find('button').first().simulate('click');
  });
});

describe('Remove pure', () => {
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
          <Remove>{({ onClick }) =>
            <button type="button" onClick={onClick}>Remove</button>
          }
          </Remove>
        </fieldset>
      </Form>
    ));

    wrapper.find('button').first().simulate('click');
  });

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
          <Remove>
            <button type="button">Remove</button>
          </Remove>
        </fieldset>
      </Form>
    ));

    wrapper.find('button').first().simulate('click');
  });
});
