// @flow
import React, { Component } from "react";
import TryAgain from "components/TryAgain";
import { defaultExplorers } from "@ledgerhq/live-common/lib/explorers";

import ModalLoading from "components/ModalLoading";
import { withStyles } from "@material-ui/core/styles";
import TabHistory from "./TabHistory";
import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
import connectData from "restlay/connectData";
import OperationWithAccountQuery from "api/queries/OperationWithAccountQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import type { Operation, Account } from "data/types";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import modals from "shared/modals";
import TabDetails from "./TabDetails";
import { DialogButton, Overscroll } from "..";

type Props = {
  close: Function,
  classes: Object,
  tabIndex: number,
  // injected by decorators:
  operationWithAccount: {
    operation: Operation,
    account: Account
  },
  match: Object
};

const styles = {
  base: {
    ...modals.base,
    width: 440,
    height: 615
  }
};

class OperationDetails extends Component<Props, *> {
  constructor(props) {
    super(props);

    this.state = {
      value: parseInt(props.match.params.tabIndex, 10) || 0
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      operationWithAccount: { operation, account },
      close,
      classes
    } = this.props;
    const note = operation.notes[0];
    const { value } = this.state;
    return (
      <div className={classes.base}>
        <header>
          <h2>Operation details</h2>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
          >
            <Tab label="Overview" disableRipple />
            <Tab
              label="Details"
              disableRipple
              disabled={!operation.transaction}
            />
            {operation.type !== "RECEIVE" && (
              <Tab label="Label" disableRipple />
            )}
            {operation.approvals.length > 0 && (
              <Tab label="History" disableRipple />
            )}
          </Tabs>
        </header>
        {value === 0 && <TabOverview operation={operation} account={account} />}
        {value === 1 && (
          <div style={{ height: "330px" }}>
            <Overscroll top={20} bottom={40}>
              <TabDetails operation={operation} account={account} />
            </Overscroll>
          </div>
        )}
        {value === 2 && <TabLabel note={note} />}
        {value === 3 && <TabHistory operation={operation} />}
        <div className="footer">
          {account.currency_id &&
          operation.transaction &&
          operation.transaction.hash &&
          defaultExplorers[account.currency_id] &&
          defaultExplorers[account.currency_id]() !== null ? (
            <DialogButton>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={defaultExplorers[account.currency_id](
                  operation.transaction.hash
                )}
              >
                Explore
              </a>
            </DialogButton>
          ) : null}
          <DialogButton highlight right onTouchTap={close}>
            Done
          </DialogButton>
        </div>
      </div>
    );
  }
}

const RenderError = withStyles(styles)(({ classes, error, restlay }) => (
  <div className={classes.base}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </div>
));

export default connectData(withStyles(styles)(OperationDetails), {
  RenderError,
  RenderLoading: ModalLoading,
  queries: {
    operationWithAccount: OperationWithAccountQuery,
    profile: ProfileQuery
  },
  propsToQueryParams: props => ({
    operationId: props.match.params.operationId || ""
  })
});
