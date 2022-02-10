import React from 'react';
import Router  from './tools/router';
import './App.css';

function App() {
  const [token,setToken] = React.useState(localStorage.getItem('token'))
  return (
    <div className="App">
      <Router token={token} setToken={setToken}/>
    </div>
  );
}

export default App;
