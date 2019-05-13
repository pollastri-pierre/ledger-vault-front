// @flow
import React from "react";
import { Trans } from "react-i18next";
import {
  getTransactionExplorer,
  getDefaultExplorerView,
} from "@ledgerhq/live-common/lib/explorers";
import { FaExchangeAlt, FaExternalLinkAlt } from "react-icons/fa";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import connectData from "restlay/connectData";
import TransactionWithAccountQuery from "api/queries/TransactionWithAccountQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import { GrowingSpinner } from "components/base/GrowingCard";
import { CardError } from "components/base/Card";
import { ModalFooterButton } from "components/base/Modal";
import Box from "components/base/Box";
import EntityModal from "components/EntityModal";
import type { Transaction, Account } from "data/types";

import TabHistory from "./TabHistory";
import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
import TabDetails from "./TabDetails";

type Props = {
  close: () => void,
  transactionWithAccount: {
    transaction: Transaction,
    account: Account,
  },
};

function TransactionDetails(props: Props) {
  const {
    transactionWithAccount: { transaction, account },
    close,
  } = props;

  const note = transaction.notes[0];
  const currency = getCryptoCurrencyById(account.currency);
  const url = transaction.tx_hash
    ? getTransactionExplorer(
        getDefaultExplorerView(currency),
        transaction.tx_hash || "",
      )
    : null;

  const footer = url ? (
    <Box grow align="flex-end">
      <a target="_blank" rel="noopener noreferrer" href={url}>
        <ModalFooterButton>
          <Box horizontal align="center" flow={5}>
            <FaExternalLinkAlt />
            <span>
              <Trans i18nKey="transactionDetails:explore" />
            </span>
          </Box>
        </ModalFooterButton>
      </a>
    </Box>
  ) : null;

  return (
    <EntityModal
      growing
      entity={transaction}
      Icon={FaExchangeAlt}
      title="Transaction details"
      onClose={close}
      footer={footer}
    >
      <TabOverview key="overview" transaction={transaction} account={account} />
      {transaction.status === "SUBMITTED" && (
        <TabDetails key="details" transaction={transaction} account={account} />
      )}
      <TabLabel key="note" note={note} />
      {transaction.approvals && (
        <TabHistory key="history" transaction={transaction} />
      )}
    </EntityModal>
  );
}

export default connectData(TransactionDetails, {
  RenderError: CardError,
  RenderLoading: GrowingSpinner,
  queries: {
    transactionWithAccount: TransactionWithAccountQuery,
    profile: ProfileQuery,
  },
  propsToQueryParams: props => ({
    transactionId: props.match.params.transactionId || "",
  }),
});
