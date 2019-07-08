// @flow

import React from "react";

import Spinner from "components/base/Spinner";
import Card from "components/base/Card";

export default ({ height, ...props }: { height?: number }) => (
  <Card
    style={{ height: height || 350 }}
    align="center"
    justify="center"
    {...props}
  >
    <Spinner />
  </Card>
);
