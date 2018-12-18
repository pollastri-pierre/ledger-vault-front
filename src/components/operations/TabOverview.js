//@flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import LineRow from "../LineRow";
import AccountName from "../AccountName";
import DateFormat from "../DateFormat";
import OperationStatus from "components/OperationStatus";
import OverviewOperation from "../OverviewOperation";
import Amount from "../Amount";
import type { Operation, Account } from "data/types";
import Copy from "components/icons/Copy";
import colors from "shared/colors";

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
          <LineRow label="Identifier">
            {operation.transaction.hash && (
              <div className={classes.hashContainer}>
                <span className={classes.hash}>
                  {operation.transaction.hash}
                </span>
                <CopyToClipboard
                  text={operation.transaction.hash}
                  onCopy={this.onCopy}
                >
                  {copied ? (
                    <Button
                      className={classes.buttonCopy}
                      variant="contained"
                      size="small"
                    >
                      Copied
                    </Button>
                  ) : (
                    <Button
                      className={classes.buttonCopy}
                      variant="contained"
                      size="small"
                    >
                      <div className={classes.copyIcon}>
                        <Copy color={colors.ocean} size={12} />
                      </div>
                      Copy
                    </Button>
                  )}
                </CopyToClipboard>
              </div>
            )}
          </LineRow>
          <LineRow label="status">
            <OperationStatus operation={operation} />
          </LineRow>

          <LineRow label="send date">
            <DateFormat date={operation.created_on} />
          </LineRow>
          <LineRow label="account">
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={`/account/${account.id}`}
            >
              <AccountName name={account.name} currency={account.currency} />
            </Link>
          </LineRow>
          <LineRow label="fees">
            <Amount account={account} value={operation.fees} />
          </LineRow>
          <LineRow label="Total spent">
            <Amount
              account={account}
              value={operation.amount || operation.price.amount}
              strong
            />
          </LineRow>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TabOverview);
