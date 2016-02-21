
declare module 'react-form-controlled' {
  import * as React from 'react';
	
  interface FormdProps {
    onChange?: (state:any) => void,
    onSubmit?: (state:any) => void,
    onError?: (error:any) => void,
    ajvOptions?: any,  
    schema?:any,
    replace?: boolean,
    value?: any
	}
	
  class Element extends React.Component<FormdProps,{}> {}
  class Fieldset extends Element {}
  class Form extends Fieldset {}
  class Tbody extends Fieldset {}
  class Input extends Element {}
  class Select extends Element {}
  class SelectPro extends Element {}
  class Index extends Element {}
  class Textarea extends Input {}
  class Word extends Input {}
  class If extends Input {}
  class ErrorAlert extends Input {}
  
  var markAsDirty:any;

  export default Form;
  
  export { Input, Select, Textarea, ErrorAlert, Fieldset, Tbody, SelectPro, Word, Index, If, markAsDirty };
  
}
