# React controlled form

Intuitive react forms for building powerful applications.

All components are [controlled](https://facebook.github.io/react/docs/forms.html#why-controlled-components)
That means form is always showing the current state and data are immutable.
Each form has own internal state that means you can skip onChange event.
If you will change the value prop of the form component it will change the state of the form immediately.

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

- Immutable data
- Controlled behavior (support for "uncontrolled" behaviour)
- Build on latest standards ES6 and promises
- Support for isomorphic application
- You are able to use forms without special components
- Support for arrays/lists and indexes
- Standard html elements like an input, select, textarea and fieldset (arrays)
- Custom components and support for 3rd party libraries
- Validation
- Tests and coverage


# Support us

Star this project on [GitHub][github-url].

# Examples

## Simple usage

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Example extends Component {
  constructor(props, context) {
    super(props, context);

    this.formData = {
      firstName: null,
      lastName: null
    };
  }

  onSubmit = (data) => {
    alert(`Hi ${data.firstName} ${data.lastName}`);
  }

  render() {
    return (
      <Form
        value={this.formData}
        onSubmit={this.onSubmit}
      >
        <label>
          <input name="firstName" />
        </label>

        <label>
          <input name="lastName" />
        </label>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## Where is the input value?

Value is automatically added as prop to the inputs. When you will change it it will reload whole form (controlled form, but this is the work for React).

## Arrays and controlled state

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

  onChange = (data) => {
    this.setState(data);
  }

  onSubmit = (data) => {
    alert(`Hi ${data.users[0].firstName}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      >
        <fieldset name="users">
          <label>
            <input name="firstName" />
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## You can do what do you want with value.

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

  onChange = (data) => {
    this.setState(data);
  }

  onSubmit = (data) => {
    alert(`Hi ${data.users[0].firstName}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      >
        <Row>
          <fieldset 
            name="users"
            render={({ value }) => value.map((user, index) => (
              <Column>
                <fieldset name={index}>
                  <label>
                    <input name="firstName" />
                  </label>
                </fieldset>
              </Column>
            ))}
          />
          </fieldset>
        </Row>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```


## Simple arrays

If you are using fieldset with simple array do not enter the name attribute.

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Example extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      items: [123, 222]
    };
  }

  onSubmit = (data) => {
    alert(`Hi ${data.users[0].firstName}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onSubmit={this.onSubmit}
      >
        <fieldset name="items">
          <input type="text" />
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

  onSubmit = (data) => {
    alert(`Hi ${data.users[0].firstName}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onSubmit={this.onSubmit}
      >
        <fieldset name="users">
          <label>
            <input name="firstName" />
          </label>
          <label>
            <input name="stats.followers" />
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

  onSubmit = (data) => {
    alert(`Hi ${data.users[0].firstName}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onSubmit={this.onSubmit}
      >
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

### Props

#### render: function

Instead of having a component rendered for you, you can pass in a function. Your render function will be called with the same props that are passed to the component.

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

  onSubmit = (data) => {
    alert(`Hi ${data.users[0].firstName}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onSubmit={this.onSubmit}
      >
        <fieldset name="users">
          <label>
            <Index 
              render={({ index }) => (
                <span>{index}.</span>
              )} 
            />
            <input name="firstName" />
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## Parent values

You can use value from parent with dot notation. Example ".selected"

```js
import React, { Component } from 'react';
import Form, { Index } from 'react-form-controlled';

export default class Component extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      options: ['dog', 'mouse', 'cat'],
      selected: 1,
    };
  }

  onSubmit = (data) => {
    alert(`Selected option is ${data.options[data.selected]}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onSubmit={this.onSubmit}
      >
        <fieldset name="options">
          <Index
            render={({ index }) => (
              <input type="radio" name="..selected" value={index} />
            )}
          />
          <input name="." />
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## Integrate with 3rd party libraries

Integration is very easy you can use Integrate component. Here is example with [react-select](https://github.com/JedWatson/react-select) library.
### Props
#### value: string
Name of the integrated value property.
#### onChange: function
OnChange callback of the integrated component.
#### name: string
Name of the state property. You can use standard dot notation as always :)

```js
import React, { Component } from 'react';
import Form, { Integrate } from 'react-form-controlled';
import Select from 'react-select';

export default class Component extends Component {
  onSubmit = (data) => {
    alert(`Selected option is ${data.selected}`);
  }

  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <Form
        onSubmit={this.onSubmit}
      >
        <Integrate 
          name="selected" 
          render={({ value, onChange }) => (
            <Select options={options} value={value} onChange={onChange} />
          )}
        />

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## Remove item from array

```js
import React, { Component } from 'react';
import Form, { Remove } from 'react-form-controlled';

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

  onSubmit = (data) => {
    alert(`Hi ${data.users[0].firstName}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onSubmit={this.onSubmit}
      >
        <fieldset name="users">
          <label>
            <input name="firstName" />
            <Remove 
              render={({ onClick }) => (
                <button type="button" onClick={onClick}>Remove</button>
              )} 
            />
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```
Remove, Up and Down components has same properties like index. You can use render and component property as well.

## Move item up/down in array

```js
import React, { Component } from 'react';
import Form, { Up, Down } from 'react-form-controlled';

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

  onSubmit = (data) => {
    alert(`Hi ${data.users[0].firstName}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onSubmit={this.onSubmit}
      >
        <fieldset name="users">
          <input name="firstName" />
          <Up 
            render={({ onClick }) => (
              <button type="button" onClick={onClick}>Up</button>
            )} 
          />
          <Down 
            render={({ onClick }) => (
              <button type="button" onClick={onClick}>Down</button>
            )} 
          />
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## Working state

You can simply handle working state and show loading indicator. Form property onSubmit is based on promises. During you processing of this callback is form in the "isWorking" state.
If the form is in the isWorking state you are not able to submit form again.

```js
import React, { Component } from 'react';
import Form, { Working } from 'react-form-controlled';

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

  onSubmit = async (data) => {
    return new Promise((resolve) => {
      alert(`Hi ${data.users[0].firstName}`);

      setTimeout(resolve, 3000);
    });
  }

  render() {
    return (
      <Form
        value={this.state}
        onSubmit={this.onSubmit}
      >
        <fieldset name="users">
          <input name="firstName" />
        </fieldset>

        <Working 
          render={({ isWorking }) => isWorking ? 'isWorking' : 'idle'} 
        />
        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

## So far so good (more complex form)

Try to image simple quiz with questions and answers. Y

## Combination with other components

If you want to disable autoreplace of the standard components like an input, select, textarea etc...
You can disable this behavior with the form parameter skipReplace.
This feature is great if you want to use this library with other 3rd libraries.
You will be able to use Input, Select, Textarea and Fieldset.

```js
import Form, { Input, Select, Textarea, Fieldset } from from 'react-form-controlled';

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

  onSubmit(data) {
    alert(`Hi ${data.users[0].firstName}`);
  }

  render() {
    return (
      <Form
        value={this.state}
        onSubmit={this.onSubmit}
        skipReplace
      >
        <Fieldset name="users">
          <label>
            <Index render={({ index }) => index} />
            <Input type="text" name="firstName" placeholder="First name" />
          </label>
        </Fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

# Support for schemas and validation?

This part is moved to another library named react-form-controlled-validate

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

## License

The MIT License (MIT)

Copyright (c) 2017 [Zlatko Fedor](http://github.com/seeden)
