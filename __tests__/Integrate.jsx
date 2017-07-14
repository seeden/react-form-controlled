import React from 'react';
import { mount } from 'enzyme';
import Form, { Integrate } from '../src';

describe('Integrate', () => {
  it('should be able to create simple object', () => {
    const value = {
      place: 'Kosice',
    };

    const wrapper = mount((
      <Form value={value}>
        <Integrate name="place" value="value" onChange="onChange">
          <input placeholder="1122" />
        </Integrate>
      </Form>
   ));

    expect(wrapper.find('input').first().props().value).toBe('Kosice');
  });

  it('should be able to use function', () => {
    const state = {
      place: 'Kosice',
    };

    const wrapper = mount((
      <Form value={state}>
        <Integrate name="place" render={({ name, value, onChange }) => (
          <input placeholder="1122" name={name} value={value} onChange={onChange} />
        )}
        />
      </Form>
   ));

    expect(wrapper.find('input').first().props().value).toBe('Kosice');
  });

  it('should be able to create object', () => {
    const value = {
      rows: [123, 456],
    };

    const wrapper = mount((
      <Form value={value}>
        <table>
          <tbody name="rows">
            <tr>
              <td>
                <Integrate name=".">
                  <input placeholder="1122" />
                </Integrate>
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
    ));

    expect(wrapper.find('input').first().props().value).toBe(123);
  });
});
