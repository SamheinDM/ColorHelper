import React from 'react';
import InputForm from './InputForm';
import './App.css'; 
import { ipcRenderer } from 'electron';

// const electron = window.require('electron');
// const ipcRenderer = electron.ipcRenderer;

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = { total: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    ipcRenderer.send('get-default-data');
    this.defaultData = null;
    ipcRenderer.on('send-default-data', (_event, data) => { 
      this.defaultData = data;
      console.log(this.defaultData);
     });

    this.data = [
      { name: '', ammount: '', percent: '' },
      { name: '', ammount: '', percent: '' },
      { name: '', ammount: '', percent: '' },
      { name: '', ammount: '', percent: '' },
      { name: '', ammount: '', percent: '' },
      { name: '', ammount: '', percent: '' },
      { name: '', ammount: '', percent: '' },
      { name: '', ammount: '', percent: '' },
      { name: '', ammount: '', percent: '' },
      { name: '', ammount: '', percent: '' }];
    this.inputs = [
      { name: 'name', placeholder: 'Название' },
      { name: 'ammount', placeholder: 'Количество' },
      { name: 'percent', placeholder: '% отклонения' }];
    // this.dbinst = db
    //   .get('recipies')
    //   .value();

    this.onValueChange = this.valueChange.bind(this);
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
      {inputFormsList}
      <button>Сохранить</button>
      <button>Очистить</button>
      <button>Открыть</button>
    </div>
  };
}
