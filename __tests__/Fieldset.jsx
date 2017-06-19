import React from 'react';
import { mount } from 'enzyme';
import Form, {
  Input,
  Fieldset,
  FieldsetIndex,
  If,
  Last,
} from '../src';

describe('Fieldset', () => {
 it('should be able to create object', (done) => {
    const value = {
      data: {
        inputValue: 123,
      },
    };

    function onChange(state) {
      expect(state.data.inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Fieldset name="data">
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').props().value).toBe(123);
    expect(wrapper.find('input').get(0).value).toBe('123');

    wrapper.find('input').simulate('change', { target: {
      value: '222',
    } });
  });

  it('should be able to create object as html fieldset', (done) => {
    const value = {
      data: {
        inputValue: 123,
      },
    };

    function onChange(state) {
      expect(state.data.inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <fieldset name="data">
          <Input name="inputValue" />
        </fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').props().value).toBe(123);
    expect(wrapper.find('input').get(0).value).toBe('123');

    wrapper.find('input').simulate('change', { target: {
      value: '222',
    } });
  });

  it('should be able to create complex object', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }],
    };

    function onChange(state) {
      expect(state.data[0].inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Fieldset name="data" skipMap>
          <Fieldset name="0">
            <Input name="inputValue" />
          </Fieldset>
        </Fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').props().value).toBe(123);
    expect(wrapper.find('input').get(0).value).toBe('123');

    wrapper.find('input').simulate('change', { target: {
      value: '222',
    } });
  });

  it('should be able to simplify complex object', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }],
    };

    function onChange(state) {
      expect(state.data[0].inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Fieldset name="data.0">
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').props().value).toBe(123);
    expect(wrapper.find('input').get(0).value).toBe('123');

    wrapper.find('input').simulate('change', { target: {
      value: '222',
    } });
  });

  it('should be able to simplify complex object by array notation', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }],
    };

    function onChange(state) {
      expect(state.data[0].inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Fieldset name="data[0]">
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').props().value).toBe(123);
    expect(wrapper.find('input').get(0).value).toBe('123');

    wrapper.find('input').simulate('change', { target: {
      value: '222',
    } });
  });

  it('should be able to simplify complex object by dot and array notation', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }],
    };

    function onChange(state) {
      expect(state.data[0].inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Input name="data[0].inputValue" />
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').props().value).toBe(123);
    expect(wrapper.find('input').get(0).value).toBe('123');

    wrapper.find('input').simulate('change', { target: {
      value: '222',
    } });
  });

  it('should be able to simplify array object', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }, {
        inputValue: 222,
      }],
    };

    function onChange(state) {
      expect(state.data[0].inputValue).toBe('333');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Fieldset name="data">
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').get(0).value).toBe('123');
    expect(wrapper.find('input').get(1).value).toBe('222');

    wrapper.find('input').first().simulate('change', { target: {
      value: '333',
    } });
  });

  it('should be able to simplify array object with complex array', () => {
    const value = {
      data: [[1, 2, 3], [4, 5, 6]],
    };

    const wrapper = mount((
      <Form value={value}>
        <fieldset name="data">
          <Input name="." />
        </fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').length).toBe(6);
    expect(wrapper.find('input').get(0).value).toBe('1');
    expect(wrapper.find('input').get(1).value).toBe('2');
    expect(wrapper.find('input').get(2).value).toBe('3');
    expect(wrapper.find('input').get(3).value).toBe('4');
  });

  it('should be able to simplify array object with index', () => {
    const value = {
      data: [{
        inputValue: 123,
      }, {
        inputValue: 222,
      }],
    };

    const wrapper = mount((
      <Form value={value}>
        <Fieldset name="data">
          <FieldsetIndex />
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('span').length).toBe(2);
    expect(wrapper.find('span').at(0).text()).toBe('1.');
    expect(wrapper.find('span').at(1).text()).toBe('2.');
  });

  it('should be able to get original path for event onChange', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }, {
        inputValue: 222,
      }],
    };

    function onChange(state, component) {
      expect(component.getPath()).toBe('data.0.inputValue');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Fieldset name="data">
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    ));

    wrapper.find('input').first().simulate('change', { target: {
      value: '333',
    } });
  });

  it('should be able to use simple array', () => {
    const value = {
      data: [123, 222],
    };

    const wrapper = mount((
      <Form value={value}>
        <Fieldset name="data">
          <Input name="." />
        </Fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').length).toBe(2);
    expect(wrapper.find('input').get(0).value).toBe('123');
    expect(wrapper.find('input').get(1).value).toBe('222');
  });

  it('should be able to use provideIndex', (done) => {
    const value = {
      data: [123, 222],
    };

    function onClick(index, evn, id) {
      expect(index).toBe(0);
      done();
    }

    const wrapper = mount((
      <Form value={value}>
        <Fieldset name="data">
          <Input name="." />
          <FieldsetIndex
            render={({ index }) =>
              <button onClick={evn => onClick(index, evn)} />
            }
          />
        </Fieldset>
      </Form>
    ));

    wrapper.find('button').first().simulate('click');
  });

  it('should be able to use provideIndex on child', (done) => {
    const value = {
      data: [123, 222],
    };

    function onClick(index, evn, id) {
      expect(index).toBe(0);
      done();
    }

    const wrapper = mount((
      <Form value={value}>
        <Fieldset name="data">
          <Input name="." />
          <FieldsetIndex
            render={({ index }) =>
              <button onClick={evn => onClick(index, evn)} />
            }
          />
        </Fieldset>
      </Form>
    ));

    wrapper.find('button').first().simulate('click');
  });

  it('should be able to get parent value', (done) => {
    const value = {
      test: '111',
      data: [{
        options: [1, 2, 3],
        selected: 2,
      }],
    };

    let count = 0;

    function onChange(state) {
      count += 1;

      if (count === 1) {
        expect(state.data[0].selected).toBe('222');

        expect(wrapper.find('textarea').get(0).value).toBe('1');

        wrapper.find('textarea').first().simulate('change', { target: {
          value: '33333',
        } });
      } else if (count === 2) {
        expect(state.data[0].options[0]).toBe('33333');
        done();
      }
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <fieldset name="data">
          <fieldset name="options">
            <textarea name="." />
            <input type="radio" name="..selected" />
          </fieldset>
        </fieldset>
      </Form>
    ));

    expect(wrapper.find('textarea').get(0).value).toBe('1');
    expect(wrapper.find('input').length).toBe(3);
    expect(wrapper.find('input').get(0).value).toBe('2');

    wrapper.find('input').first().simulate('change', { target: {
      value: '222',
    } });
  });
/*
  it('should be able to get index value', () => {
    const value = {
      test: 0,
      data: [123, 222],
    };

    const wrapper = mount((
      <Form value={value}>
        <Fieldset name="data">
          <Input type="radio" name="..test" valueIndex />
        </Fieldset>
      </Form>
    ));

    expect(wrapper.find('input').get(0).checked).toBe(true);
  });

  it('should be able to get indexes', (done) => {
    const value = {
      test: 0,
      data: [123, 222],
    };

    function onClick(names, evn, id) {
      expect(names[0]).toBe(0);
      done();
    }

    const wrapper = mount((
      <Form value={value}>
        <Fieldset name="data">
          <button onClick={onClick} provideIndexes />
        </Fieldset>
      </Form>
    ));

    wrapper.find('button').first().simulate('click');
  });
*/
  it('should be able to use if', () => {
    const value = {
      data: [{
        selected: true,
        options: [1],
      }],
    };

    function checkValue(value) {
      return value === true;
    }

    const wrapper = mount((
      <Form value={value}>
        <fieldset name="data">
          <fieldset name="options">
            <If name="..selected" cond={(value) => checkValue(value)}>
              <textarea name="..selected" />
            </If>
          </fieldset>
        </fieldset>
      </Form>
    ));

    expect(wrapper.find('textarea').get(0).value).toBe('true');
  });

  it('should be able to use if', () => {
    const value = {
      data: [{
        selected: false,
        options: [1],
      }],
    };

    function checkValue(value) {
      if (value !== false) {
        throw new Error('value must be false');
      }
      return value === true;
    }

    const wrapper = mount((
      <Form value={value}>
        <fieldset name="data">
          <fieldset name="options">
            <If name="..selected" cond={(value) => checkValue(value)}>
              <textarea name="..selected" />
            </If>
          </fieldset>
        </fieldset>
      </Form>
    ));

    expect(wrapper.find('textarea').length).toBe(0);
  });

  it('should be able to use last', () => {
    const value = {
      data: [123, 222],
    };

    const wrapper = mount((
      <Form value={value}>
        <Fieldset name="data">
          <Last>
            <Input name="." />
          </Last>
        </Fieldset>
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('input').get(0).value).toBe('222');
  });
});
