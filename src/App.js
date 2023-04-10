import logo from './logo.png';
import './App.css';
import Task from './tasks/Task';
import Clock from './clock/Clock';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <p>GRABA 25</p>
        <Clock />
        <Task />
        <a
          className="App-link"
          href="https://aesop.oopy.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          개발자 블로그
        </a>
      </header>
    </div>
  );
}

export default App;
