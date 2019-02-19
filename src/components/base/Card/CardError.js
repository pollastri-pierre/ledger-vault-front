// @flow

import React from "react";

import Card from "components/base/Card";
import TryAgain from "components/TryAgain";

import type { RestlayEnvironment } from "restlay/connectData";

type Props = {
  error: Error,
  restlay: RestlayEnvironment
};

export default ({ error, restlay }: Props) => (
  <Card>
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);
