// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import OperationStatus from "components/OperationStatus";
import CopyToClipboardButton from "components/CopyToClipboardButton";
import Box from "components/base/Box";
import type { Operation, Account } from "data/types";
import LineRow from "../LineRow";
import AccountName from "../AccountName";
import DateFormat from "../DateFormat";
import OverviewOperation from "../OverviewOperation";
import Amount from "../Amount";

const styles = {
  operationList: {
    marginTop: "8px"
  }
};

type Props = {
  operation: Operation,
  account: Account,
  classes: Object
};

class TabOverview extends Component<Props> {
  render() {
    const { operation, account, classes } = this.props;
    return (
      <div>
        <OverviewOperation
          amount={operation.amount || operation.price.amount}
          account={account}
          operationType={operation.type}
        />
        <div className={classes.operationList}>
          <LineRow
            label={<Trans i18nKey="operationDetails:overview.identifier" />}
          >
            {operation.transaction.hash && (
              <CopyToClipboardButton textToCopy={operation.transaction.hash} />
            )}
          </LineRow>
          <LineRow label={<Trans i18nKey="operationDetails:overview.status" />}>
            <OperationStatus operation={operation} />
          </LineRow>

          <LineRow label={<Trans i18nKey="operationDetails:overview.date" />}>
            <DateFormat date={operation.created_on} />
          </LineRow>
          <LineRow
            label={<Trans i18nKey="operationDetails:overview.account" />}
          >
            <Box align="flex-end">
              <AccountName account={account} />
            </Box>
          </LineRow>
          <LineRow label={<Trans i18nKey="operationDetails:overview.fees" />}>
            <Amount account={account} value={operation.fees} />
          </LineRow>
          <LineRow label={<Trans i18nKey="operationDetails:overview.total" />}>
            <Amount
              account={account}
              value={operation.amount || operation.price.amount}
              strong
              erc20Format={account.account_type === "ERC20"}
            />
          </LineRow>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TabOverview);
