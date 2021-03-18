import React from 'react';
import Input from './Input';

export default class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { values: this.props.values };
  }
  render() {
    const inputList = this.props.inputs.map((input) => 
    <Input 
      id={this.props.id}
      key={input.name}
      name={input.name}
      value={this.state.values[input.name]}
      inputName={input.placeholder}
      changeHolder={this.props.onValueChange} />);
    return <form id={this.props.id}>
      {inputList}
      <span>Итого: </span>
      <span>{this.props.total} г</span>
    </form>
  }
}