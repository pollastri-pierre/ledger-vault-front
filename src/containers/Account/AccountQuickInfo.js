//@flow
import Card from "components/Card";
import { isAccountOutdated } from "utils/accounts";
import colors from "shared/colors";
import EditButton from "components/UpdateAccounts/EditButton";
import { getAccountTitle } from "utils/accounts";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import type { Account } from "data/types";

const row = {
  base: {
    lineHeight: "20px"
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase"
  }
};
const Row = withStyles(
  row
)(
  ({
    label,
    value,
    classes
  }: {
    label: string,
    value: string,
    classes: { [_: $Keys<typeof row>]: string }
  }) => (
    <div className={classes.base}>
      <span className={classes.label}>{label}: </span>
      <span>{value}</span>
    </div>
  )
);
const styles = {
  base: {
    display: "flex",
    justifyContent: "space-between"
  },
  update: {
    cursor: "pointer",
    color: colors.ocean,
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold"
  }
};
type Props = {
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string }
};
class AccountQuickInfo extends Component<Props> {
  render() {
    const { account, classes } = this.props;
    return (
      <Card title={getAccountTitle(account)}>
        <div className={classes.base}>
          <div>
            <Row label="creation date" value={account.created_on} />
            <Row
              label="Cryptocurrency/Index"
              value={`${account.currency.name} / ${account.index}`}
            />
            <Row label="Unit" value={account.settings.currency_unit.code} />
          </div>
          <div>
            <Row label="members" value={account.members.length} />
            <Row
              label="Required of approvals"
              value={account.security_scheme.quorum}
            />
            {isAccountOutdated(account) && (
              <EditButton className={classes.update} account={account}>
                Provide operation rules
              </EditButton>
            )}
          </div>
          <div />
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountQuickInfo);
