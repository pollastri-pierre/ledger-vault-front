// @flow
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import OperationStatus from "components/OperationStatus";
import Copy from "components/icons/Copy";
import colors from "shared/colors";
import type { Operation, Account } from "data/types";
import LineRow from "../LineRow";
import AccountName from "../AccountName";
import DateFormat from "../DateFormat";
import OverviewOperation from "../OverviewOperation";
import Amount from "../Amount";

const styles = {
  operationList: {
    marginTop: "8px"
  },
  hashContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "&:hover $buttonCopy": {
      display: "flex",
      backgroundColor: colors.cream
    }
  },
  hash: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  buttonCopy: {
    display: "none",
    position: "fixed",
    alignSelf: "flex-end",
    color: colors.ocean,
    fontSize: "11px"
  },
  copyIcon: {
    marginRight: "3px"
  }
};

type Props = {
  operation: Operation,
  account: Account,
  classes: Object
};

type State = {
  copied: boolean
};
class TabOverview extends Component<Props, State> {
  state = {
    copied: false
  };

  componentWillUnmount() {
    if (this._timeout) clearTimeout(this._timeout);
  }

  onCopy = () => {
    this.setState({ copied: true });
    this._timeout = setTimeout(() => this.setState({ copied: false }), 1e3);
  };

  _timeout: ?TimeoutID = null;

  render() {
    const { operation, account, classes } = this.props;
    const { copied } = this.state;
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
              <div className={classes.hashContainer}>
                <span className={classes.hash}>
                  {operation.transaction.hash}
                </span>
                <CopyToClipboard
                  text={operation.transaction.hash}
                  onCopy={this.onCopy}
                >
                  <Button
                    className={classes.buttonCopy}
                    variant="contained"
                    size="small"
                  >
                    {copied ? (
                      <span>
                        <Trans i18nKey="operationDetails:overview.copied" />
                      </span>
                    ) : (
                      <Fragment>
                        <div className={classes.copyIcon}>
                          <Copy color={colors.ocean} size={12} />
                        </div>
                        <span>
                          <Trans i18nKey="operationDetails:overview.copy" />
                        </span>
                      </Fragment>
                    )}
                  </Button>
                </CopyToClipboard>
              </div>
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
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={`/account/${account.id}`}
            >
              <AccountName account={account} />
            </Link>
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
