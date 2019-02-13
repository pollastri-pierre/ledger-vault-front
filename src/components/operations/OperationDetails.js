// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import { defaultExplorers } from "@ledgerhq/live-common/lib/explorers";
import { withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import cx from "classnames";

import connectData from "restlay/connectData";

import OperationWithAccountQuery from "api/queries/OperationWithAccountQuery";
import ProfileQuery from "api/queries/ProfileQuery";

import TryAgain from "components/TryAgain";
import ModalLoading from "components/ModalLoading";
import { ModalClose } from "components/base/Modal";
import modals from "shared/modals";
import type { Operation, Account } from "data/types";
import TabHistory from "./TabHistory";
import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
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
    width: 450,
    height: 615
  },
  footerContainer: {
    display: "flex",
    justifyContent: "flex-end"
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
          <h2>
            <Trans i18nKey="operationDetails:title" />
          </h2>
          <ModalClose onClick={close} />
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
          >
            <Tab
              label={<Trans i18nKey="operationDetails:tabs.overview" />}
              disableRipple
            />
            <Tab
              label={<Trans i18nKey="operationDetails:tabs.details" />}
              disableRipple
              disabled={!operation.transaction}
            />
            {operation.type !== "RECEIVE" && (
              <Tab
                label={<Trans i18nKey="operationDetails:tabs.label" />}
                disableRipple
              />
            )}
            {operation.approvals.length > 0 && (
              <Tab
                label={<Trans i18nKey="operationDetails:tabs.history" />}
                disableRipple
              />
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
        <div className={cx("footer", classes.footerContainer)}>
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
                <Trans i18nKey="operationDetails:explore" />
              </a>
            </DialogButton>
          ) : null}
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
