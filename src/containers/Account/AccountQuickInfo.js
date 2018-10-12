//@flow
import Card from "components/Card";
import { Link } from "react-router-dom";
import {
  STATUS_UPDATE_IN_PROGRESS,
  isAccountOutdated,
  isAccountBeingUpdated,
  hasUserApprovedAccount
} from "utils/accounts";
import type { Translate } from "data/types";
import Bell from "components/icons/thin/Bell";
import { translate } from "react-i18next";
import colors from "shared/colors";
import EditButton from "components/UpdateAccounts/EditButton";
import { getAccountTitle } from "utils/accounts";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import type { Account, Member } from "data/types";

const row = {
  base: {
    lineHeight: "20px"
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: 600,
    color: "#767676"
  },
  value: {
    fontSize: 12,
    color: "#999999"
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
      <span className={classes.value}>{value}</span>
    </div>
  )
);
const styles = {
  base: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between"
  },
  update: {
    cursor: "pointer",
    color: colors.grenade,
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold"
  },
  subtext: {
    color: "black",
    fontWeight: "normal"
  },
  right: {
    position: "absolute",
    top: 35,
    right: 50,

    background: "#ea2e492b",
    cursor: "pointer",
    padding: 20,
    borderRadius: 5,
    "& span": {
      width: 200,
      fontSize: 11,
      marginTop: 5,
      display: "block"
    }
  }
};
type Props = {
  account: Account,
  me: Member,
  match: Object,
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string }
};
class AccountQuickInfo extends Component<Props> {
  render() {
    const { account, classes, t, match, me } = this.props;
    const orga = location.pathname.split("/")[1];
    return (
      <Card title={account.name}>
        <div className={classes.base}>
          <div style={{ width: 300 }}>
            <Row label="creation date" value={account.created_on} />
            <Row
              label="Cryptocurrency/Index"
              value={`${account.currency.name} / #${account.index}`}
            />
            <Row label="Unit" value={account.settings.currency_unit.code} />
          </div>
          <div style={{ width: 300 }}>
            <Row label="members" value={account.members.length} />
            <Row
              label="Required of approvals"
              value={account.security_scheme.quorum}
            />
          </div>
          <div>
            {isAccountOutdated(account) && (
              <EditButton className={classes.update} account={account}>
                <div className={classes.right}>
                  <span>
                    <Bell type="red" />
                    {t("update:provide_rule")}
                  </span>
                  <span className={classes.subtext}>
                    {t("update:provide_rule_subtext")}
                  </span>
                </div>
              </EditButton>
            )}
            {isAccountBeingUpdated(account) &&
              !hasUserApprovedAccount(account, me) && (
                <Link to={`/${orga}/pending`} className={classes.update}>
                  <div className={classes.right}>
                    <span>
                      <Bell type="red" />
                      {t("updateAccounts:approve")}
                    </span>
                    <span className={classes.subtext}>
                      {t("updateAccounts:desc_approve")}
                    </span>
                  </div>
                </Link>
              )}
            {isAccountBeingUpdated(account) &&
              hasUserApprovedAccount(account, me) && (
                <Link to={`/${orga}/pending`} className={classes.update}>
                  <div className={classes.right}>
                    <span>
                      <Bell type="red" />
                      {t("updateAccounts:quorum")}
                    </span>
                    <span className={classes.subtext}>
                      {t("updateAccounts:quorum_approve")}
                    </span>
                  </div>
                </Link>
              )}
          </div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(translate()(AccountQuickInfo));
