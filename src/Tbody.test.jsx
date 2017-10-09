import React from 'react';
import { mount } from 'enzyme';
import Form, {
  Input,
  Tbody,
} from '../src';


describe('Tbody', () => {
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
                <Input name="." />
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
    ));

    expect(wrapper.find('input').at(0).props().value).toBe(123);
    expect(wrapper.find('input').at(1).props().value).toBe(456);
  });
});
