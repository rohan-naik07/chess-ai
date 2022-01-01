import React from 'react';
import './App.css';
import Game from './game';

function App() {
  const board = [];
  let flag = true;
  for(let i=0;i<8;i+=1){
    let row = []
    for(let j=0;j<8;j+=1){
      row.push({
        row : i,
        col : j,
        color : flag===true ? 'white' : 'brown'
      })
      flag = flag===true ? false : true
    }
    board.push(row)
    flag = flag===true ? false : true
  }
  
  return (
    <div className="App">
      <Game board={board} initialTurn={'white'}/>
    </div>
  );
}

export default App;
