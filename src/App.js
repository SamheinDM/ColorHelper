import React from 'react';
import InputForm from './InputForm';
import RecipiesList from './RecipiesList';
import Button from './Button';
import './App.css'; 
import { ipcRenderer } from 'electron';
import ErrorMessage from './ErrorMessage';

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
    this.onNameChange = this.nameChange.bind(this);
    this.onSaveRecipe = this.saveRecipe.bind(this);
    this.onClearRecipe = this.clearRecipe.bind(this);
    this.onOpen = this.openRecipe.bind(this);
    this.onChooseRecipe = this.choseRecipe.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('already-exist', (_event) => console.log('already exist!'));
    ipcRenderer.on('recipe-saved', (_event, name) => {
      this.setState((_state) => ({ recipe_name: name }));
    });
  }

  renewDataState(paramName, index, newValue) {
    this.setState({ data: this.state.data.map((el, i) => {
      if (i === index) {
        el[paramName] = newValue;
        return el;
      }
      return el;
    })
  });
  }

  nameChange(event) {
    this.setState({ recipe_name: event.target.value });
  }

  valueChange(event, inputName, index) {
    event.preventDefault();
    const value = event.target.value;
    this.renewDataState(inputName, index, value);

    if (inputName !== 'name') {
      this.updateTotal(index);
    }
  }
  
  updateTotal(index) {
    const ammount = this.state.data[index].ammount === '' ? 0 : parseFloat(this.state.data[index].ammount);
    const percent = this.state.data[index].percent === '' ? 0 : parseFloat(this.state.data[index].percent);
  
    if (!Number.isNaN(ammount) && !Number.isNaN(percent)) {
      const total = ammount + (ammount * (percent / 100));
      this.renewDataState('total', index, total);
    }
  }

  saveRecipe() {
    if (this.state.recipe_name === '') {
      this.setState({ show_err_msg: true });
    } else {
      if (this.state.show_err_msg) {
        this.setState({ show_err_msg: false });
      }
      ipcRenderer.send('save-recipe', { name: this.state.recipe_name, data: this.state.data });
    }
  }

  getDefaultState() {
    return { 
      recipe_name: this.defaultData.name,
      data: this.defaultData.data.map(el => Object.assign({}, el)),
      recipe_chosen: true,
      show_err_msg: false };
  }

  clearRecipe() {
    this.setState(this.getDefaultState());
  }

  getRecipiesList() {
    return ipcRenderer.sendSync('get-recipies-list');
  }

  openRecipe() {
    console.log(ipcRenderer.sendSync('get-recipe', this.chosenRecipe));
  }

  choseRecipe(event) {
    this.setState({ recipe_chosen: false });
    this.chosenRecipe = event.target.textContent;
  }

  render () {
    const inputFormsList = this.state.data.map((form, id) => 
      <InputForm 
        id={id}
        key={id}
        inputs={this.inputs}
        values={form}
        onValueChange={this.onValueChange} 
        total={this.state.data[id].total} />
    );

    return (
    <div className="App">
      <div>
        <input 
          type="text"
          placeholder="Название рецепта"
          value={ this.state.recipe_name === 'default' ? 'Новый рецепт' : this.state.recipe_name }
          onChange={this.onNameChange}/>
        <ErrorMessage isShow={this.state.show_err_msg} text="Введите имя рецепта!"/>
        {inputFormsList}
        <Button clickHandler={this.onSaveRecipe} name={'Сохранить'}/>
        <Button clickHandler={this.onClearRecipe} name={'Очистить'}/>
      </div>
      <div className="right_panel">
        <RecipiesList 
          recipies={this.getRecipiesList()}
          onChoose={this.onChooseRecipe}/>
        <div>
          <Button clickHandler={this.onOpen} name={'Открыть'} isDisabled={this.state.recipe_chosen}/>
        </div>
      </div>
    </div>
    );
  };
}
