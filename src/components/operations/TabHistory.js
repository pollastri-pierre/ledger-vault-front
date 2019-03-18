// @flow
import React from "react";
import { translate } from "react-i18next";
import ExpandableText from "components/ExpandableText";
import DateFormat from "components/DateFormat";
import { withStyles } from "@material-ui/core/styles";
import type { Operation, User, Translate } from "data/types";

const styles = {
  base: {
    fontSize: 13,
    lineHeight: "50px",
    borderBottom: "1px solid #e2e2e2",
    "&:last-child": {
      border: 0,
    },
  },
  date: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  user: {
    fontSize: 12,
    fontStyle: "italic",
  },
};

type ActionType = "APPROVE" | "ABORT" | "CREATED" | "SUBMITTED" | "CONFIRMED";

const Action = translate()(
  ({
    action,
    t,
    user,
    classes,
  }: {
    action: ActionType,
    t: Translate,
    user?: User,
    classes: { [$Keys<typeof styles>]: string },
  }) => (
    <span>
      {action === "APPROVE" && (
        <strong>{t("operation:history.approved")}</strong>
      )}
      {action === "ABORT" && <strong>{t("operation:history.aborted")}</strong>}
      {action === "CREATED" && (
        <strong>{t("operation:history.created")}</strong>
      )}
      {action === "SUBMITTED" && <strong>{t("operation:history.sent")}</strong>}
      {action === "CONFIRMED" && (
        <strong>{t("operation:history.confirmed")}</strong>
      )}
      {user && (
        <ExpandableText
          text={` ${user.username}`}
          size={15}
          className={classes.user}
        />
      )}
    </span>
  ),
);

const Row = ({
  classes,
  date,
  action,
  user,
}: {
  date: Date,
  action: ActionType,
  classes: { [$Keys<typeof styles>]: string },
  user?: User,
}) => (
  <div className={classes.base}>
    <span className={classes.date}>
      <DateFormat date={date} />{" "}
    </span>
    <Action action={action} user={user} classes={classes} />
  </div>
);
const TabHistory = ({
  operation,
  classes,
}: {
  operation: Operation,
  classes: { [$Keys<typeof styles>]: string },
}) => (
  <div>
    <Row
      classes={classes}
      date={operation.created_on}
      action="CREATED"
      user={operation.created_by}
    />
    {operation.approvals.map(approval => (
      <Row
        key={approval.person.id}
        classes={classes}
        date={approval.created_on}
        action={approval.type}
        user={approval.person}
      />
    ))}
    {operation.status === "SUBMITTED" && (
      <Row
        classes={classes}
        date={operation.approvals[operation.approvals.length - 1].created_on}
        action="SUBMITTED"
      />
    )}
    {operation.block_height && operation.time && (
      <Row classes={classes} date={operation.time} action="CONFIRMED" />
    )}
  </div>
);
export default withStyles(styles)(TabHistory);
