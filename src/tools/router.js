import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "../auth";
import Home from "../home";
import GameWrapper from '../game_wrapper';

const Router = (props) => {
  const {token,setToken} = props
  return (
    <Routes>
      <Route path="/" exact element={<Auth token={token} setToken={setToken}/>}/>
      <Route path="/home" exact element={<Home token={token} setToken={setToken}/>}/>
      <Route path="/game/:gameId" exact element={<GameWrapper token={token}/>}/>
    </Routes>
  );
};

export default Router;