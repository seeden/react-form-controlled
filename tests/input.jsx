import React from 'react';
import should from 'should';
import Form, { Input, Textarea, Word, Select, Fieldset } from '../dist';
import { renderJSX } from '../utils/tester';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';

describe('Form', () => {
  it('should be able to create simple instance', () => {
    const value = {
      inputValue: 123,
    };

    const node = renderJSX(
      <Form value={value}>
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
  });
});

describe('Input', () => {
  it('should be able to create input', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      state.inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Input name="inputValue" />
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });

  it('should be able to create input with standard input', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      state.inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <input name="inputValue" />
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });
});

describe('Textarea', () => {
  it('should be able to create textarea', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      state.inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Textarea name="inputValue" />
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('textarea');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });

  it('should be able to create textarea with standard textarea', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      state.inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <textarea name="inputValue" />
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('textarea');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });
});

describe('Word', () => {
  it('should be able to create word', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      state.inputValue.should.equal('222lsctzy');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Word name="inputValue" />
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222 ľščťžý',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222lsctzy');
  });
});


/*
describe('Select', () => {
  const options = [{
    label: 'Test',
    value: 123,
  }, {
    label: 'Test2',
    value: 222,
  }];

  it('should be able to create select', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      console.log(state);
      state.inputValue.should.equal(222);
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Select name="inputValue" options={options}/>
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('select');

    TestUtils.Simulate.change(ele, { target: {
      value: '1',
      options: ele.options,
      getAttribute: (name) => ele.getAttribute(name)
    }});
  });
});

*/

describe('Fieldset', () => {
  it('should be able to create object', (done) => {
    const value = {
      data: {
        inputValue: 123,
      }
    };

    function onChange(state) {
      state.data.inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Fieldset name="data">
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });

  it('should be able to create object as html fieldset', (done) => {
    const value = {
      data: {
        inputValue: 123,
      }
    };

    function onChange(state) {
      state.data.inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <fieldset name="data">
          <Input name="inputValue" />
        </fieldset>
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });

  it('should be able to create complex object', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }]
    };

    function onChange(state) {
      state.data[0].inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Fieldset name="data" map={false}>
          <Fieldset name="0">
            <Input name="inputValue" />
          </Fieldset>
        </Fieldset>
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });

  it('should be able to simplify complex object', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }]
    };

    function onChange(state) {
      state.data[0].inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Fieldset name="data.0">
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });

  it('should be able to simplify complex object by array notation', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }]
    };

    function onChange(state) {
      state.data[0].inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Fieldset name="data[0]">
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });

  it('should be able to simplify complex object by dot and array notation', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }]
    };

    function onChange(state) {
      state.data[0].inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Input name="data[0].inputValue" />
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');
    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('data[0].inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });

  it('should be able to simplify array object', (done) => {
    const value = {
      data: [{
        inputValue: 123,
      }, {
        inputValue: 222,
      }]
    };

    function onChange(state) {
      state.data[0].inputValue.should.equal('222');
      done();
    }

    const node = renderJSX(
      <Form value={value} onChange={onChange}>
        <Fieldset name="data">
          <Input name="inputValue" />
        </Fieldset>
      </Form>
    );

    findDOMNode(node).nodeName.should.equal('FORM');

    const ele = findDOMNode(node).querySelector('input');
    ele.getAttribute('data-property').should.equal('inputValue');
    ele.value.should.equal('123');

    TestUtils.Simulate.change(ele, { target: {
      value: '222',
      getAttribute: (name) => ele.getAttribute(name)
    }});

    ele.value.should.equal('222');
  });
});