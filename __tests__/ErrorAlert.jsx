import React from 'react';
import { mount } from 'enzyme';
import Form, {
  ErrorAlert,
} from '../src';

describe('ErrorAlert', () => {
  it('should be able to create simple instance', (done) => {
    const value = {
      firstName: 'Zlatko',
    };

    const schema = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
      },
      required: ['firstName'],
    };

    function onSubmit(state) {
      expect(state.firstName).toBe('Zlatko');
      done();
    }

    const wrapper = mount((
      <Form value={value} schema={schema} onSubmit={onSubmit}>
        <input name="firstName" />
        <ErrorAlert name="firstName" />
        <button type="submit">Submit</button>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('[type="submit"]').length).toBe(1);
    wrapper.find('[type="submit"]').get(0).click();
  });
/*
  it('should be able to create simple error instance', (done) => {
    const value = {
      firstName: undefined,
    };

    const schema = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
      },
      required: ['firstName'],
    };

    function onError(errors) {
      expect(errors.length).toBe(1);
    }

    function onSubmit() {
      throw new Error('On submit was called');
    }

    const wrapper = mount((
      <Form
        value={value}
        schema={schema}
        onSubmit={onSubmit}
        onError={onError}
      >
        <input name="firstName" />
        <ErrorAlert name="firstName" />
        <button type="submit">Submit</button>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    wrapper.find('[type="submit"]').get(0).click();

    setTimeout(() => {
      expect(wrapper.find('span').text()).toBe('should have required property \'firstName\'');
      done();
    }, 0);
  });

  */
});
