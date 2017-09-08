import React from 'react';
import { Route } from 'react-router'

import { SandBox } from '../../containers'; // Tests

function Content() {
  return (
    <div className="Content">
      <Route path="/sandbox" component={SandBox} />
    </div>
  );
}

export default Content;

