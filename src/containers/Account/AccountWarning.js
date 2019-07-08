// @flow
import { Trans } from "react-i18next";
import { withRouter } from "react-router";
import React, { Component } from "react";
import type { MemoryHistory } from "history";

import { isAccountOutdated } from "utils/accounts";
import InfoBox from "components/base/InfoBox";
import { SoftCard } from "components/base/Card";
import Text from "components/base/Text";
import type { Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import Button from "components/base/Button";
import { Widget } from "components/widgets";
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

    const showViewOnlyWarning =
      account.status === "VIEW_ONLY" &&
      (account.last_request === null ||
        (account.last_request && account.last_request.status === "ABORTED"));

    const isOutdated = isAccountOutdated(account);

    if (!showViewOnlyWarning && !isOutdated) return null;

    return (
      <Widget
        title={
          showViewOnlyWarning ? (
            <Trans i18nKey="accountView:widgetTitle.viewOnly" />
          ) : (
            <Trans i18nKey="accountView:widgetTitle.update" />
          )
        }
        width={350}
      >
        <SoftCard>
          {showViewOnlyWarning && (
            <InfoBox
              type="warning"
              className={classes.infobox}
              Footer={
                <Button
                  size="tiny"
                  customColor="#503d1a"
                  onClick={this.editAccount}
                  variant="text"
                  data-test="view_only_provide_rules"
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
          {isOutdated && (
            <InfoBox
              type="warning"
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
        </SoftCard>
      </Widget>
    );
  }
}

export default withStyles(styles)(withRouter(AccountWarning));
