import React from 'react';
import { Route } from 'react-router-dom';

import SandBox from './SandBox'; // Tests

function Content() {
  return (
    <div className="Content">
      <Route path="/sandbox" component={SandBox} />
    </div>
  );
}

export default Content;
