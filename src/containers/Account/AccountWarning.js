// @flow
import InfoBox from "components/InfoBox";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import React, { Component, Fragment } from "react";
import { toggleAndSelect } from "redux/modules/update-accounts";
import {
  isAccountOutdated,
  isAccountBeingUpdated,
  hasUserApprovedAccount
} from "utils/accounts";
import NoStyleLink from "components/NoStyleLink";
import type { Account, Member } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = {
  actionButton: {
    background: "#ca630b",
    fontWeight: "bold",
    height: 20,
    fontSize: 11
  },
  infobox: {
    position: "absolute",
    width: 300,
    right: 50,
    top: 50
  }
};

type Props = {
  account: Account,
  onOpen: (id: number) => void,
  me: Member,
  classes: { [_: $Keys<typeof styles>]: string }
};

class AccountWarning extends Component<Props> {
  render() {
    const { classes, account, me, onOpen } = this.props;
    const orga = location.pathname.split("/")[1];
    return (
      <Fragment>
        {account.status === "VIEW_ONLY" && (
          <InfoBox
            type="warning"
            withIcon
            className={classes.infobox}
            Footer={
              <Button
                onClick={onOpen}
                variant="outlined"
                className={classes.actionButton}
              >
                <Trans i18nKey="accountView:view_only_provide_rules" />
              </Button>
            }
          >
            <Trans i18nKey="accountView:view_only_warning" />
          </InfoBox>
        )}
        {isAccountOutdated(account) && (
          <InfoBox
            type="warning"
            withIcon
            className={classes.infobox}
            Footer={
              <Button onClick={onOpen} className={classes.actionButton}>
                <Trans i18nKey="update:provide_rule" />
              </Button>
            }
          >
            <Trans i18nKey="update:provide_rule_subtext" />
          </InfoBox>
        )}
        {isAccountBeingUpdated(account) &&
          !hasUserApprovedAccount(account, me) && (
            <InfoBox
              type="warning"
              withIcon
              className={classes.infobox}
              Footer={
                <Button
                  href={`/${orga}/pending`}
                  className={classes.actionButton}
                >
                  <NoStyleLink to={`/${orga}/pending`}>
                    <Trans i18nKey="updateAccounts:approve" />
                  </NoStyleLink>
                </Button>
              }
            >
              <Trans i18nKey="updateAccounts:desc_approve" />
            </InfoBox>
          )}
        {isAccountBeingUpdated(account) &&
          hasUserApprovedAccount(account, me) && (
            <InfoBox type="info" withIcon className={classes.infobox}>
              <h4>
                <Trans i18nKey="updateAccounts:quorum" />
              </h4>
              <div>
                <Trans i18nKey="updateAccounts:quorum_approve" />
              </div>
            </InfoBox>
          )}
      </Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: Function, ownProps: $Shape<Props>) => ({
  onOpen: () => dispatch(toggleAndSelect(ownProps.account))
});
export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(AccountWarning)
);
