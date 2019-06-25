// @flow
import { Trans } from "react-i18next";
import { withRouter } from "react-router";
import React, { Component } from "react";
import type { MemoryHistory } from "history";

import { isAccountOutdated } from "utils/accounts";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import type { Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import Button from "components/base/Button";
import colors, { opacity } from "shared/colors";

const styles = {
  actionButton: {
    background: opacity(colors.blue_orange, 0.5),
    color: "black",
    height: 20,
    fontSize: 11,
  },
  infobox: {
    width: 300,
  },
};

type Props = {
  history: MemoryHistory,
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
};

class AccountWarning extends Component<Props> {
  editAccount = () => {
    const { history, account } = this.props;
    history.push(`${location.pathname}/accounts/edit/${account.id}`);
  };

  render() {
    const { classes, account } = this.props;
    return (
      <>
        {account.status === "VIEW_ONLY" && !account.last_request && (
          <InfoBox
            type="warning"
            withIcon
            className={classes.infobox}
            Footer={
              <Button
                size="small"
                customColor="#503d1a"
                onClick={this.editAccount}
                variant="text"
                className={classes.actionButton}
              >
                <Trans i18nKey="accountView:view_only_provide_rules" />
              </Button>
            }
          >
            <Text>
              <Trans i18nKey="accountView:view_only_warning" />
            </Text>
          </InfoBox>
        )}
        {isAccountOutdated(account) && (
          <InfoBox
            type="warning"
            withIcon
            className={classes.infobox}
            Footer={
              <Button
                onClick={this.editAccount}
                className={classes.actionButton}
              >
                <Trans i18nKey="accountView:updated_provide_rule" />
              </Button>
            }
          >
            <Trans i18nKey="accountView:updated_provide_rule_subtext" />
          </InfoBox>
        )}
      </>
    );
  }
}

export default withStyles(styles)(withRouter(AccountWarning));
