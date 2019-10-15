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
import Button from "components/base/Button";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Absolute from "components/base/Absolute";
import EntityModal from "components/EntityModal";
import { FetchEntityHistory } from "components/EntityHistory";
import type { Transaction, Account } from "data/types";

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
    <Absolute top={25} right={20}>
      <a target="_blank" rel="noopener noreferrer" href={url}>
        <Button type="outline" variant="info">
          <Box horizontal align="center" flow={5}>
            <Text>
              <Trans i18nKey="transactionDetails:explore" />
            </Text>
            <FaExternalLinkAlt />
          </Box>
        </Button>
      </a>
    </Absolute>
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
      <FetchEntityHistory
        key="history"
        url={`/transactions/${transaction.id}/history`}
        entityType="transaction"
      />
      {transaction.status === "SUBMITTED" && (
        <TabDetails key="details" transaction={transaction} account={account} />
      )}
      <TabLabel key="note" note={note} />
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
