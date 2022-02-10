import React from 'react';
import Router  from './tools/router';
import './App.css';
import { getFromServer, MARK_ONLINE_URL,MARK_OFFLINE_URL, GET_ONLINE_USERS_URL } from './tools/urls';
import jwtDecode from 'jwt-decode';

function App() {
  const [token,setToken] = React.useState(localStorage.getItem('token'))
  function markUser(url) {
    getFromServer(
      url + jwtDecode(token)._id,null,'POST',token
    ).then(response=>{
      console.log(response)
    }).catch(error=>{
      this.window.alert(error)
    })
  }

  React.useEffect(()=>{
    if(token){
      getFromServer(
        MARK_ONLINE_URL + jwtDecode(token)._id,null,'POST',token
      ).then(response=>{
        console.log(response.data)
        if(response.data.message===200){
          window.addEventListener('beforeunload',()=>markUser(MARK_OFFLINE_URL),false);
        }
      }).catch(error=>{
        window.alert(error)
      }) 
    } else {
      markUser(MARK_OFFLINE_URL)
    }
    return ()=>{
      if(token){
        window.removeEventListener("beforeunload",()=>markUser(MARK_OFFLINE_URL),false);
      }
    }
  },[token])
  
  return (
    <div className="App">
      <Router token={token} setToken={setToken}/>
    </div>
  );
}

export default App;
