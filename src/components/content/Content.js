import React from 'react';
import { Route } from 'react-router';

import { SandBox, OperationsList } from '../../containers'; // Tests

function Content() {
  return (
    <div className="Content">
      <Route path="/sandbox" component={SandBox} />
      <Route path="/operations" component={OperationsList} />
    </div>
  );
}

export default Content;

