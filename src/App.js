import logo from './logo.svg';
import InputForm from './InputForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <InputForm  />
      <InputForm  />
      <InputForm  />
      <button>Сохранить</button>
      <button>Очистить</button>
      <button>Открыть</button>
    </div>
  );
}

export default App;
