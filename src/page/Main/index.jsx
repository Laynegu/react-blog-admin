import React, { Fragment } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Login from '../Login';
import Admin from '../Admin';

export default function Main() {
  return (
    <Fragment>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/index" component={Admin}></Route>
          <Redirect to="/login"></Redirect>
        </Switch>
      </BrowserRouter>
    </Fragment>
  )
}
