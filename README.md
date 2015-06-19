# React controlled form

This is a React controlled form components. More about controlled components [here](https://facebook.github.io/react/docs/forms.html#why-controlled-components). The main idea is to create a simple forms as possible. Look on the next example. 

# What?

```js
import React, { Component } from 'react';
import Form, { Input, Select, Textarea } from 'react-form-controlled';

export default class Component extends Component {
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
					<Input type="text" name="firstName" placeholder="First name"/>
				</label>

				<label>
					<Input type="text" name="lastName" placeholder="Last name"/>
				</label>

				<button type="submit">Submit</button>
			</Form>
		);
	}
}
```

# Where is the input value?

Value is automatically added as prop to the inputs. When you will change it it will reload whole form (controlled form, but this is the work for React).

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
		
## Credits

[Zlatko Fedor](http://github.com/seeden)

## License

The MIT License (MIT)

Copyright (c) 2015 Zlatko Fedor zlatkofedor@cherrysro.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.