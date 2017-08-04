import React from 'react';
import { Route } from 'react-router-dom';
import Login from './Login'; // Tests
import SandBox from './SandBox'; // Tests

function Content() {
  return (
    <div className="Content">
      <Route path="/sandbox" component={SandBox} />
      <Route path="/login" component={Login} />
    </div>
  );
}

export default Content;
