import React from 'react';
import Input from './Input';

export default class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.placeholders = ['Название', 'Количество', '% отклонения'];
    this.onValueChange = this.onValueChange.bind(this);
    this.state = { name: '', ammount: '', percent: '', total: 0 };
  }

  onValueChange(e, inputName) {
    e.preventDefault();
    const value = parseFloat(e.target.value);
    if (Number.isNaN(value)) {
      
    }
    const total = this.state.ammount + (this.state.ammount * (this.state.percent / 100));
    if (inputName === 'name') {
      this.setState({ name: value });
    } else {
      this.setState({ [inputName]: parseInt(value, 10) });
      this.setState({ total });
    }
    // this.props.dataUpdate(this.state);
  }

  render() {
    return <form>
      <Input name="name"
        value={this.state.name}
        inputName={this.placeholders[0]}
        changeHolder={this.onValueChange} />
      <Input name="ammount"
        value={this.state.ammount}
        inputName={this.placeholders[1]}
        changeHolder={this.onValueChange} />
      <Input name="percent"
        value={this.state.percent}
        inputName={this.placeholders[2]}
        changeHolder={this.onValueChange} />
      <span>Итого: </span>
      <span>{this.state.total}</span>
    </form>
  }
}