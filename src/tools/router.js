import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "../auth";
import Game from '../game';
import Home from "../home";

const Router = (props) => {
  const {token,setToken} = props
  return (
    <Routes>
      <Route path="/" exact element={<Auth token={token} setToken={setToken}/>}/>
      <Route path="/home" exact element={<Home token={token} setToken={setToken}/>}/>
      <Route path="/game/:gameId" exact element={<Auth/>}/>
    </Routes>
  );
};

export default Router;