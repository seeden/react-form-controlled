# React controlled form

This is a React controlled form components. More about controlled components [here](https://facebook.github.io/react/docs/forms.html#why-controlled-components). The main idea is to create a simple forms as possible.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

[npm-image]: https://img.shields.io/npm/v/react-form-controlled.svg?style=flat-square
[npm-url]: https://www.npmjs.com/react-form-controlled
[travis-image]: https://img.shields.io/travis/seeden/react-form-controlled/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/seeden/react-form-controlled
[coveralls-image]: https://img.shields.io/coveralls/seeden/react-form-controlled/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/seeden/react-form-controlled?branch=master
[github-url]: https://github.com/seeden/react-form-controlled

# Features

- Build on standards
- You are able to use forms without special components
- Controlled behavior
- Support for arrays/lists and indexes
- Support for standard html elements like an input, select, textarea and fieldset (arrays)
- Custom components
- Validation
- Support for isomorphic application

# Support us

Star this project on [GitHub][github-url].

# Usage

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Example extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      firstName: null,
      lastName: null
    };
  }

  handleChange(state) {
    this.setState(state);
  }

  handleSubmit(state) {
    alert(`Hi ${state.firstName} ${state.lastName}`);
  }

  render() {
    const formData = this.state;

    return (
      <Form value={formData} onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <label>
          <input type="text" name="firstName" placeholder="First name"/>
        </label>

        <label>
          <input type="text" name="lastName" placeholder="Last name"/>
        </label>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## Where is the input value?

Value is automatically added as prop to the inputs. When you will change it it will reload whole form (controlled form, but this is the work for React).

## Arrays

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Example extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      users: [{
        firstName: 'Zlatko'
      }, {
        firstName: 'Livia'
      }]
    };
  }

  handleChange(state) {
    this.setState(state);
  }

  handleSubmit(state) {
    alert(`Hi ${state.users[0].firstName}`);
  }

  render() {
    const formData = this.state;

    return (
      <Form value={formData} onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <fieldset name="users">
          <label>
            <input type="text" name="firstName" placeholder="First name" />
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## Complex objects

If you want to use complex names you can use dot or array notation.

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Example extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      users: [{
        firstName: 'Zlatko',
        stats: {
          followers: 10,
        },
      }, {
        firstName: 'Livia',
        stats: {
          followers: 22,
        },
      }]
    };
  }

  handleChange(state) {
    this.setState(state);
  }

  handleSubmit(state) {
    alert(`Hi ${state.users[0].firstName}`);
  }

  render() {
    const formData = this.state;

    return (
      <Form value={formData} onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <fieldset name="users">
          <label>
            <input type="text" name="firstName" placeholder="First name" />
          </label>
          <label>
            <input type="text" name="stats.followers" placeholder="Followers" />
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

or you can use one more fieldset

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Example extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      users: [{
        firstName: 'Zlatko',
        stats: {
          followers: 10,
        },
      }, {
        firstName: 'Livia',
        stats: {
          followers: 22,
        },
      }]
    };
  }

  handleChange(state) {
    this.setState(state);
  }

  handleSubmit(state) {
    alert(`Hi ${state.users[0].firstName}`);
  }

  render() {
    const formData = this.state;

    return (
      <Form value={formData} onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <fieldset name="users">
          <label>
            <input type="text" name="firstName" placeholder="First name" />
          </label>
          <fieldset name="stats">
            <label>
              <input type="text" name="followers" placeholder="Followers" />
            </label>
          </fieldset>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## Indexes

If you are using arrays with fieldset you want to use indexes.
Index component has one parameter named value.
It is an function and it is optional. You can format your index value with it.
Default behavior is: 1. 2. 3. etc...

```js
import React, { Component } from 'react';
import Form, { Index } from 'react-form-controlled';

export default class Component extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      users: [{
        firstName: 'Zlatko',
      }, {
        firstName: 'Livia',
      }]
    };
  }

  handleChange(state) {
    this.setState(state);
  }

  handleSubmit(state) {
    alert(`Hi ${state.users[0].firstName}`);
  }

  render() {
    const formData = this.state;

    return (
      <Form value={formData} onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <fieldset name="users">
          <label>
            <Index value={(index) => `${index})`} />
            <input type="text" name="firstName" placeholder="First name" />
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

# Support for schemas and validation?

Yes, you can use JSON schema as property to the form. Why JSON schema? Because it is a standard.
```js

const schema = {
  type: "object",
  properties: {
    firstName: {
      type: "string"
    },
    lastName: {
      type: "string"
    }
  }
};

<Form schema={schema} ref="form">

const hasError = form.hasError('firstName'); //true
const isValid = from.isValid('firstName'); //false
const errors = form.getErrors(); //[{path: 'firstName', error: '...'}]
```

# Support us

Star this project on [GitHub][github-url].

## Try our other React components

 - Translate your great project [react-translate-maker](https://github.com/CherrySoftware/react-translate-maker)
 - Google Analytics [react-g-analytics](https://github.com/seeden/react-g-analytics)
 - Google AdSense via Google Publisher Tag [react-google-publisher-tag](https://github.com/seeden/react-google-publisher-tag)

## Credits

[Zlatko Fedor](http://github.com/seeden)
