import React from 'react';
import InputForm from './InputForm';
import RecipiesList from './RecipiesList';
import Button from './Button';
import './App.css'; 
import { ipcRenderer } from 'electron';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.defaultData = ipcRenderer.sendSync('get-default-data');

    this.state = this.getDefaultState();

    this.name = 'Первый';
    this.chosenRecipe = '';
    this.inputs = [
      { name: 'name', placeholder: 'Название' },
      { name: 'ammount', placeholder: 'Количество' },
      { name: 'percent', placeholder: '% отклонения' }];

    this.onValueChange = this.valueChange.bind(this);
    this.onSaveRecipe = this.saveRecipe.bind(this);
    this.onClearRecipe = this.clearRecipe.bind(this);
    this.onOpen = this.openRecipe.bind(this);
    this.onChooseRecipe = this.choseRecipe.bind(this);
  }

  valueChange(event, inputName, index) {
    event.preventDefault();
    const value = event.target.value;
    this.setState({ data: this.state.data.map((el, i) => {
        if (i === index) {
          el[inputName] = value;
          return el;
        }
        return el;
      })
    });

    if (inputName !== 'name') {
      this.updateTotal(index);
    }
  }
  
  updateTotal(index) {
    const ammount = this.state.data[index].ammount === '' ? 0 : parseFloat(this.state.data[index].ammount);
    const percent = this.state.data[index].percent === '' ? 0 : parseFloat(this.state.data[index].percent);
  
    if (!Number.isNaN(ammount) && !Number.isNaN(percent)) {
      const total = ammount + (ammount * (percent / 100));
      const newTotalArr = this.state.total.slice(0);
      newTotalArr.splice(index, 1, total);
      this.setState({ total: newTotalArr });
    }
  }

  saveRecipe() {
    ipcRenderer.send('save-recipe', { name: this.state.recipe_name, data: this.state.data }); // ! total not saved correctly !
  }

  getDefaultState() {
    return { 
      total: this.defaultData.data.map(el => el.total),
      recipe_name: this.defaultData.name,
      data: this.defaultData.data.map(el => Object.assign({}, el)) };
  }

  clearRecipe() {
    this.setState(this.getDefaultState());
  }

  getRecipiesList() {
    console.log(ipcRenderer.sendSync('get-recipies-list'));
  }

  openRecipe() {
    console.log(ipcRenderer.sendSync('get-recipe'));
  }

  choseRecipe(name) {
    this.chosenRecipe = name;
  }

  render () {
    const inputFormsList = this.state.data.map((form, id) => 
      <InputForm 
        id={id}
        key={id}
        inputs={this.inputs}
        values={form}
        onValueChange={this.onValueChange} 
        total={this.state.total[id]} />
    );

    return (
    <div className="App">
      <div>
        <h1>{ this.state.recipe_name === 'default' ? 'Новый рецепт' : this.state.recipe_name }</h1>
        {inputFormsList}
        <Button clickHandler={this.onSaveRecipe} name={'Сохранить'}/>
        <Button clickHandler={this.onClearRecipe} name={'Очистить'}/>
      </div>
      <div className="right_panel">
        <RecipiesList 
          recipies={ipcRenderer.sendSync('get-recipies-list')}
          onChoose={this.onChooseRecipe}/>
        <div>
          <Button clickHandler={this.onOpen} name={'Открыть'}/>
        </div>
      </div>
    </div>
    );
  };
}
