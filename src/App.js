import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <form>
        <input type="text"/>
        <input type="text"/>
        <input type="text"/>
        <span>
          Итого: 
          <span />
        </span>
      </form>
      <button>Сохранить</button>
      <button>Открыть</button>
      <button>Очистить</button>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
