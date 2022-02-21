import React from 'react';
import './App.css';
import Auth from './auth';

function App() {
  React.useEffect(()=>{
    document.title = "Chess.ai"
  },[])
  return (
    <div className="App">
      <Auth/>
    </div>
  );
}

export default App;
