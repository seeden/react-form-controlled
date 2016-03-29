

import * as React from 'react';

interface FormProps {
	onChange?: React.FormEventHandler;
	onSubmit?: React.FormEventHandler;
	onError?: (error:any) => void,
	ajvOptions?: any,  
	schema?:any,
	replace?: boolean,
	value?: any,
	method?: string,
	action?: string,
	className?: string,
	autoComplete?: string
}

interface ElementProps {
  name: string | number;
  originalProps?: any;
  className?: string;
  style?: React.CSSProperties;
}

interface FieldsetProps extends ElementProps {
  onChange?: Function;
  map?: boolean;
  index?: number;
  children?: any;
  tagName?: string;
  error?: any;
  value?: any;
}

declare interface InputProps extends ElementProps {
  autoComplete?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

interface IfProps extends ElementProps {
  cond: Function;
  children?: any;
  childTransform?: boolean;
}

interface ErrorAlertProps extends ElementProps {
  className?: string,
  exactMatch?: boolean,
  processError?: Function;
}

interface IndexProps extends ElementProps {
  format?: Function;
  //name?: string;
}

interface SelectProps extends ElementProps {
  disabled?: boolean;
}

declare class Element extends React.Component<ElementProps, any> {}
declare class Fieldset extends  React.Component<FieldsetProps, any> {}
declare class Input extends React.Component<ElementProps, any> {}
declare class Form extends React.Component<FormProps, {}> {}
declare class Tbody extends React.Component<FieldsetProps, {}> {}
declare class Select extends React.Component<SelectProps, any> {}
declare class SelectPro extends React.Component<ElementProps, any> {}
declare class Index extends React.Component<IndexProps, any> {}
declare class Textarea extends React.Component<InputProps, any> {}
declare class Word extends React.Component<InputProps, any>  {}
declare class If extends React.Component<IfProps, any> {}
declare class ErrorAlert extends React.Component<ErrorAlertProps, any>  {}

declare var markAsDirty:any;

export default Form;

export { Input, Select, Textarea, ErrorAlert, Fieldset, Tbody, SelectPro, Word, Index, If, markAsDirty};


