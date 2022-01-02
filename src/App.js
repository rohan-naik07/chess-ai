import React from 'react';
import './App.css';
import Game from './game';

function App() {
  return (
    <div className="App">
      <Game initialTurn={'white'}/>
    </div>
  );
}

export default App;
