import React from 'react';
import Input from './Input';

export default class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { total: 0 };
    this.data = { name: '', ammount: '', percent: '' };
    this.inputs = [
      { name: 'name', placeholder: 'Название' },
      { name: 'ammount', placeholder: 'Количество' },
      { name: 'percent', placeholder: '% отклонения' }];

    this.onValueChange = this.valueChange.bind(this);
  }

  valueChange(event, inputName) {
    event.preventDefault();
    this.data[inputName] = event.target.value;
    if (inputName !== 'name') {
      this.updateTotal();
    }
  }

  updateTotal() {
    const ammount = this.data.ammount === '' ? 0 : parseFloat(this.data.ammount);
    const percent = this.data.percent === '' ? 0 : parseFloat(this.data.percent);

    if (!Number.isNaN(ammount) && !Number.isNaN(percent)) {
      const total = ammount + (ammount * (percent / 100));
      this.setState({ total: total });
    }
  }

  render() {
    const inputList = this.inputs.map((input) => 
    <Input name={input.name}
    inputName={input.placeholder}
    changeHolder={this.onValueChange} />);
    return <form>
      {inputList}
      <span>Итого: </span>
      <span>{this.state.total} г</span>
    </form>
  }
}