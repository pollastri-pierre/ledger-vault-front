import React from 'react';
import { Route } from 'react-router-dom';
import Login from './Login'; // Tests
import SandBox from './SandBox'; // Tests
import PrivateRoute from './PrivateRoute';

function Content() {
  return (
    <div className="Content">
      <PrivateRoute exact path="/sandbox" component={SandBox} requiredLevel="all" />
      <Route path="/login" component={Login} />
      <Route path="/sandbox2" component={SandBox} />
    </div>
  );
}

export default Content;
