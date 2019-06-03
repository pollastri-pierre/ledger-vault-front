// @flow

import React, { useState } from "react";
import { Trans } from "react-i18next";
import Switch from "@material-ui/core/Switch";

import connectData from "restlay/connectData";
import SuspendUserMutation from "api/mutations/SuspendUserMutation";
import UnsuspendUserMutation from "api/mutations/UnsuspendUserMutation";
import LineRow from "components/LineRow";
import type { User } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";

export default ({ user }: { user: User }) => (
  <>
    <RowSuspend user={user} />
  </>
);

type RowSuspendProps = {
  user: User,
  restlay: RestlayEnvironment,
};

const RowSuspend = connectData(({ user, restlay }: RowSuspendProps) => {
  const [isSuspended, setSuspended] = useState(
    user.status === "ACCESS_SUSPENDED",
  );
  const [isLoading, setIsLoading] = useState(false);

  const label = <Trans i18nKey="userDetails:suspend.label" />;
  const tooltip = <Trans i18nKey="userDetails:suspend.tooltip" />;

  const handleClick = async () => {
    if (isLoading) return;
    const newIsSuspended = !isSuspended;
    setSuspended(newIsSuspended);
    setIsLoading(true);
    const Mutation = newIsSuspended
      ? SuspendUserMutation
      : UnsuspendUserMutation;
    try {
      await restlay.commitMutation(new Mutation({ id: user.id }));
    } catch (err) {
      setSuspended(isSuspended);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LineRow label={label} tooltipInfoMessage={tooltip}>
      <Switch color="primary" checked={isSuspended} onClick={handleClick} />
    </LineRow>
  );
});
