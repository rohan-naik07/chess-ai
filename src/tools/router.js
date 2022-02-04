import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Auth from "../auth";
import Game from '../game';
import Home from "../home";

const Router = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Auth/>
      </Route>
      <Route path="/home" exact>
        <Home/>
      </Route>
      <Route path="/game/:gameId" exact>
        <Game/>
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default Router;