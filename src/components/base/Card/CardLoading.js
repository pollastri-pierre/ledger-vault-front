// @flow

import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import Card from "components/base/Card";

export default ({ height, ...props }: { height?: number }) => (
  <Card
    style={{ height: height || 350 }}
    align="center"
    justify="center"
    {...props}
  >
    <CircularProgress />
  </Card>
);
