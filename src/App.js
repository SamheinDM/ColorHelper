import React from 'react';
import InputForm from './InputForm';
import RecipiesList from './RecipiesList';
import Button from './Button';
import './App.css';
import { ipcRenderer } from 'electron';
import ErrorMessage from './ErrorMessage';
import Modal from './Modal';

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.defaultData = ipcRenderer.sendSync('get-default-data');

    this.state = Object.assign({}, this.getDefaultState(), { recipe_not_chosen: true, show_modal: false });

    this.chosenRecipe = '';
    this.modalHandler = '';
    this.modalMessage = '';
    this.inputs = [
      { name: 'name', placeholder: 'Название' },
      { name: 'ammount', placeholder: 'Количество' },
      { name: 'percent', placeholder: '% отклонения' }];

    this.onValueChange = this.valueChange.bind(this);
    this.onHideErrorMsg = this.hideErrorMsg.bind(this);
    this.onNameChange = this.nameChange.bind(this);
    this.onSaveRecipe = this.saveRecipe.bind(this);
    this.onUpdateRecipe = this.updateRecipe.bind(this);
    this.onClearRecipe = this.clearRecipe.bind(this);
    this.onOpen = this.openRecipe.bind(this);
    this.onChooseRecipe = this.choseRecipe.bind(this);
    this.onDeleteRecipe = this.deleteRecipe.bind(this);
    this.onCloseModal = this.closeModal.bind(this);
    this.onOpenModal = this.openModal.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('already-exist', (_event) => {
      this.setState((_state) => ({ show_modal: true }));
    });
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

  hideErrorMsg() {
    this.setState({ show_err_msg: false });
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

  updateRecipe() {
    ipcRenderer.send('update-recipe', { name: this.state.recipe_name, data: this.state.data });
    this.closeModal();
  }

  getDefaultState() {
    return { 
      recipe_name: '',
      data: this.defaultData.data.map(el => Object.assign({}, el)),
      show_err_msg: false };
  }

  clearRecipe() {
    this.setState(this.getDefaultState());
  }

  getRecipiesList() {
    return ipcRenderer.sendSync('get-recipies-list');
  }

  openRecipe() {
    const openedRecipe = ipcRenderer.sendSync('get-recipe', this.chosenRecipe);

    this.setState({ 
      recipe_name: openedRecipe.name,
      data: openedRecipe.data.map(el => Object.assign({}, el))
     });
  }

  choseRecipe(event) {
    this.setState({ recipe_not_chosen: false });
    this.chosenRecipe = event.target.textContent;
  }

  openModal(event) {
    const buttonName = event.target.textContent;
    switch(buttonName) {
      case 'Сохранить':
        this.modalHandler = this.onUpdateRecipe;
        this.modalMessage = 'Рецепт с таким именем уже существует, перезаписать его?';
        this.saveRecipe();
        break;
      case 'Удалить':
        this.modalHandler = this.onDeleteRecipe;
        this.modalMessage = 'Вы точно хотите удалить рецепт? Восстановить его будет невозможно.';
        this.setState((_state) => ({ show_modal: true }));
        break;
      default:
        break;
    }
  }

  deleteRecipe() {
    ipcRenderer.send('delete-recipe', this.chosenRecipe);
    this.chosenRecipe = '';
    this.setState({ 
      recipe_not_chosen: true,
      show_modal: false });
  }

  closeModal() {
    this.setState({ show_modal: false });
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
      <div className="left_panel">
        <div className="recipe_name_wrapper">
          <input 
            type="text"
            className="recipe_name"
            placeholder="Название рецепта"
            value={ this.state.recipe_name }
            onChange={this.onNameChange}/>
          <ErrorMessage isShow={this.state.show_err_msg} text="Введите имя рецепта!"/>
        </div>
        <div className="input_forms_wrapper">
          {inputFormsList}
        </div>
        <div className="buttons_wrapper">
          <Button clickHandler={this.onSaveRecipe} name={'Сохранить'} onBlur={this.onHideErrorMsg}/>
          <Button clickHandler={this.onClearRecipe} name={'Очистить'}/>
        </div>
      </div>
      <div className="right_panel">
        <RecipiesList 
          recipies={this.getRecipiesList()}
          activeEl={this.chosenRecipe}
          onChoose={this.onChooseRecipe}/>
        <div className="buttons_wrapper">
          <Button 
            clickHandler={this.onOpen} 
            name={'Открыть'} 
            isDisabled={this.state.recipe_not_chosen}/>
          <Button 
            clickHandler={this.onOpenModal} 
            name={'Удалить'} 
            isDisabled={this.state.recipe_not_chosen}
            isRed={true}/>
        </div>
      </div>
      <Modal 
        isShow={this.state.show_modal}
        message={this.modalMessage}
        okHandler={this.modalHandler}
        cancelHandler={this.onCloseModal}/>
    </div>
    );
  };
}
