import React from 'react';
import { Route } from 'react-router';

import {
  SandBox,
  AccountView,
  PendingRequests,
} from '../../containers'; // Tests

function Content() {
  return (
    <div className="Content">
      <Route path="/sandbox" component={SandBox} />
      <Route path="/pending" component={PendingRequests} />
      <Route path="/account/:id" component={AccountView} />
    </div>
  );
}

export default Content;

