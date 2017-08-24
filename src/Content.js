import React from 'react';
import { Route } from 'react-router-dom';
import Logintest from './Logintest'; // Tests
import SandBox from './SandBox'; // Tests
import PrivateRoute from './PrivateRoute';
import Tabtest from './Tabtest';

function Content() {
  return (
    <div className="Content">
      <PrivateRoute exact path="/sandbox" component={SandBox} requiredLevel="all" />
      <Route path="/logintest" component={Logintest} />
      <Route path="/sandbox2" component={SandBox} />
    </div>
  );
}

export default Content;
