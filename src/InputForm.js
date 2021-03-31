import React from 'react';
import Input from './Input';

export default class InputForm extends React.Component {
  render() {
    const inputList = this.props.inputs.map((input) => 
    <Input 
      id={this.props.id}
      key={input.name}
      name={input.name}
      value={this.props.values[input.name]}
      inputName={input.placeholder}
      changeHolder={this.props.onValueChange} />);
    return <form id={this.props.id}>
      {inputList}
      <span className="total">{`Итого: ${this.props.total} г`}</span>
    </form>
  }
}