import React from 'react';
import InputForm from './InputForm';
import './App.css'; 
import { ipcRenderer } from 'electron';

// const electron = window.require('electron');
// const ipcRenderer = electron.ipcRenderer;

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.defaultData = ipcRenderer.sendSync('get-default-data');

    this.state = { total: this.defaultData.data.map(el => el.total),
      recipe_name: this.defaultData.name };

    this.name = '';
    this.data = this.defaultData.data;
    this.inputs = [
      { name: 'name', placeholder: 'Название' },
      { name: 'ammount', placeholder: 'Количество' },
      { name: 'percent', placeholder: '% отклонения' }];

    this.onValueChange = this.valueChange.bind(this);
    this.onSaveRecipe = this.saveRecipe.bind(this);
  }

  valueChange(event, inputName, index) {
    event.preventDefault();
    this.data[index][inputName] = event.target.value;
    if (inputName !== 'name') {
      this.updateTotal(index);
    }
  }
  
  updateTotal(index) {
    const ammount = this.data[index].ammount === '' ? 0 : parseFloat(this.data[index].ammount);
    const percent = this.data[index].percent === '' ? 0 : parseFloat(this.data[index].percent);
  
    if (!Number.isNaN(ammount) && !Number.isNaN(percent)) {
      const total = ammount + (ammount * (percent / 100));
      const newTotalArr = this.state.total.slice(0);
      newTotalArr.splice(index, 1, total);
      this.setState({ total: newTotalArr });
    }
  }

  saveRecipe() {
    ipcRenderer.send('save-recipe', { name: this.name, data: this.data });
  }

  render () {
    const inputFormsList = this.data.map((_form, id) => 
      <InputForm 
        id={id}
        key={id}
        inputs={this.inputs} 
        onValueChange={this.onValueChange} 
        total={this.state.total[id]} />
    );

    return <div className="App">
      <h1>{ this.state.recipe_name === 'default' ? 'Новый рецепт' : 0 }</h1>
      {inputFormsList}
      <button onClick={this.onSaveRecipe} >Сохранить</button>
      <button>Очистить</button>
      <button>Открыть</button>
    </div>
  };
}
