import React from 'react';
import './App.css';
import BurgerMenu from './components/burger-menu/BurgerMenu';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <BurgerMenu />
          Hello world
          <p className="App-text">Это новый текстовый элемент</p>
          <p className="App-text">hello world69</p>
        </div>
      </header>
    </div>
  );
}

export default App;
