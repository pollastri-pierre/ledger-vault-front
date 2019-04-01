// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import { defaultExplorers } from "@ledgerhq/live-common/lib/explorers";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import connectData from "restlay/connectData";

import TransactionWithAccountQuery from "api/queries/TransactionWithAccountQuery";
import ProfileQuery from "api/queries/ProfileQuery";

import type { RestlayEnvironment } from "restlay/connectData";

import TryAgain from "components/TryAgain";
import ModalLoading from "components/ModalLoading";
import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "components/base/Modal";
import DialogButton from "components/buttons/DialogButton";
import Overscroll from "components/utils/Overscroll";
import type { Transaction, Account } from "data/types";
import TabHistory from "./TabHistory";
import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
import TabDetails from "./TabDetails";

type Props = {
  close: Function,
  tabIndex: number,
  // injected by decorators:
  transactionWithAccount: {
    transaction: Transaction,
    account: Account,
  },
  match: Object,
};

class TransactionDetails extends Component<Props, *> {
  constructor(props) {
    super(props);

    this.state = {
      value: parseInt(props.match.params.tabIndex, 10) || 0,
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      transactionWithAccount: { transaction, account },
      close,
    } = this.props;
    const note = transaction.notes[0];
    const { value } = this.state;
    return (
      <ModalBody height={700} onClose={close}>
        <ModalHeader>
          <ModalTitle>
            <Trans i18nKey="transactionDetails:title" />
          </ModalTitle>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
          >
            <Tab
              label={<Trans i18nKey="transactionDetails:tabs.overview" />}
              disableRipple
            />
            <Tab
              label={<Trans i18nKey="transactionDetails:tabs.details" />}
              disableRipple
              disabled={!transaction.transaction}
            />
            {transaction.type !== "RECEIVE" && (
              <Tab
                label={<Trans i18nKey="transactionDetails:tabs.label" />}
                disableRipple
              />
            )}
            {transaction.approvals.length > 0 && (
              <Tab
                label={<Trans i18nKey="transactionDetails:tabs.history" />}
                disableRipple
              />
            )}
          </Tabs>
        </ModalHeader>

        {value === 0 && (
          <TabOverview transaction={transaction} account={account} />
        )}
        {value === 1 && (
          <div style={{ height: "330px" }}>
            <Overscroll top={20} bottom={40}>
              <TabDetails transaction={transaction} account={account} />
            </Overscroll>
          </div>
        )}
        {value === 2 && <TabLabel note={note} />}
        {value === 3 && <TabHistory transaction={transaction} />}

        <ModalFooter>
          {account.currency &&
          transaction.transaction &&
          transaction.transaction.hash &&
          defaultExplorers[account.currency] &&
          defaultExplorers[account.currency]() !== null ? (
            <DialogButton>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={defaultExplorers[account.currency](
                  transaction.transaction.hash,
                )}
              >
                <Trans i18nKey="transactionDetails:explore" />
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
  restlay,
}: {
  error: Error,
  restlay: RestlayEnvironment,
}) => (
  <div style={{ width: 500, height: 700 }}>
    <TryAgain error={error} action={restlay.forceFetch} />
  </div>
);

const RenderLoading = () => <ModalLoading height={700} />;

export default connectData(TransactionDetails, {
  RenderError,
  RenderLoading,
  queries: {
    transactionWithAccount: TransactionWithAccountQuery,
    profile: ProfileQuery,
  },
  propsToQueryParams: props => ({
    transactionId: props.match.params.transactionId || "",
  }),
});
