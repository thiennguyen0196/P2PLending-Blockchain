/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from './Layout/Admin';
import User from './Layout/User';

const Main = () => (
  <Router>
    <div className="App">
      <Switch>
        <Route exact path='/' component={Admin} />
        <Route path='/tx/:txId' component={User} />
      </Switch>
    </div>
  </Router>
)

export default Main
