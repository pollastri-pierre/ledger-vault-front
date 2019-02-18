// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import { defaultExplorers } from "@ledgerhq/live-common/lib/explorers";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import connectData from "restlay/connectData";

import OperationWithAccountQuery from "api/queries/OperationWithAccountQuery";
import ProfileQuery from "api/queries/ProfileQuery";

import type { RestlayEnvironment } from "restlay/connectData";

import TryAgain from "components/TryAgain";
import ModalLoading from "components/ModalLoading";
import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from "components/base/Modal";
import type { Operation, Account } from "data/types";
import TabHistory from "./TabHistory";
import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
import TabDetails from "./TabDetails";
import { DialogButton, Overscroll } from "..";

type Props = {
  close: Function,
  tabIndex: number,
  // injected by decorators:
  operationWithAccount: {
    operation: Operation,
    account: Account
  },
  match: Object
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
      close
    } = this.props;
    const note = operation.notes[0];
    const { value } = this.state;
    return (
      <ModalBody height={700} onClose={close}>
        <ModalHeader>
          <ModalTitle>
            <Trans i18nKey="operationDetails:title" />
          </ModalTitle>
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
        </ModalHeader>

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

        <ModalFooter>
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
        </ModalFooter>
      </ModalBody>
    );
  }
}

const RenderError = ({
  error,
  restlay
}: {
  error: Error,
  restlay: RestlayEnvironment
}) => (
  <div style={{ width: 500, height: 700 }}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </div>
);

const RenderLoading = () => <ModalLoading height={700} />;

export default connectData(OperationDetails, {
  RenderError,
  RenderLoading,
  queries: {
    operationWithAccount: OperationWithAccountQuery,
    profile: ProfileQuery
  },
  propsToQueryParams: props => ({
    operationId: props.match.params.operationId || ""
  })
});
