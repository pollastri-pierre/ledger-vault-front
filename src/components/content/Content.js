import React from 'react';
import { Route } from 'react-router';

import { SandBox, AccountView } from '../../containers'; // Tests

function Content() {
  return (
    <div className="Content">
      <Route path="/sandbox" component={SandBox} />
      <Route path="/account/:id" component={AccountView} />
    </div>
  );
}

export default Content;

