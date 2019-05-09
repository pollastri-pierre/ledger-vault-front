// @flow
import React from "react";
import { withTranslation } from "react-i18next";
import ExpandableText from "components/ExpandableText";
import DateFormat from "components/DateFormat";
import { withStyles } from "@material-ui/core/styles";
import type { Transaction, User, Translate } from "data/types";

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

const Action = withTranslation()(
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
        <strong>{t("transaction:history.approved")}</strong>
      )}
      {action === "ABORT" && (
        <strong>{t("transaction:history.aborted")}</strong>
      )}
      {action === "CREATED" && (
        <strong>{t("transaction:history.created")}</strong>
      )}
      {action === "SUBMITTED" && (
        <strong>{t("transaction:history.sent")}</strong>
      )}
      {action === "CONFIRMED" && (
        <strong>{t("transaction:history.confirmed")}</strong>
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
  transaction,
  classes,
}: {
  transaction: Transaction,
  classes: { [$Keys<typeof styles>]: string },
}) => (
  <div>
    <Row
      classes={classes}
      date={transaction.created_on}
      action="CREATED"
      user={transaction.created_by}
    />
    {transaction.approvals.map(approval => (
      <Row
        key={approval.created_by.id}
        classes={classes}
        date={approval.created_on}
        action={approval.type}
        user={approval.created_by}
      />
    ))}
    {transaction.status === "SUBMITTED" && (
      <Row
        classes={classes}
        date={
          transaction.approvals[transaction.approvals.length - 1].created_on
        }
        action="SUBMITTED"
      />
    )}
    {transaction.block_height && transaction.time && (
      <Row classes={classes} date={transaction.time} action="CONFIRMED" />
    )}
  </div>
);
export default withStyles(styles)(TabHistory);
