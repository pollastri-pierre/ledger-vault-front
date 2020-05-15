// @flow
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  getDefaultExplorerView,
  getTransactionExplorer,
} from "@ledgerhq/live-common/lib/explorers";
import { FaExchangeAlt, FaExternalLinkAlt } from "react-icons/fa";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import connectData from "restlay/connectData";
import TransactionQuery from "api/queries/TransactionQuery";
import AccountQuery from "api/queries/AccountQuery";
import { isAccountNotSpendableWithReason } from "utils/transactions";
import { GrowingSpinner } from "components/base/GrowingCard";
import { CardError } from "components/base/Card";
import Button from "components/base/Button";
import Box from "components/base/Box";
import Text from "components/base/Text";
import EntityModal from "components/EntityModal";
import { FetchEntityHistory } from "components/EntityHistory";
import type { Account, Transaction } from "data/types";

import TabOverview from "./TabOverview";
import TabLabel from "./TabLabel";
import TabDetails from "./TabDetails";

type Props = {
  close: () => void,
  transaction: Transaction,
  account: Account,
};

function TransactionDetailsComponent(props: Props) {
  const { close, transaction, account } = props;
  const { t } = useTranslation();

  const note = transaction.notes[0];
  const currency = getCryptoCurrencyById(account.currency);
  const url = transaction.tx_hash
    ? getTransactionExplorer(
        getDefaultExplorerView(currency),
        transaction.tx_hash || "",
      )
    : null;

  const footer = url ? (
    <Box horizontal>
      <a target="_blank" rel="noopener noreferrer" href={url}>
        <Button type="outline" variant="info">
          <Box horizontal align="center" flow={5}>
            <Text>{t("transactionDetails:explore")}</Text>
            <FaExternalLinkAlt />
          </Box>
        </Button>
      </a>
    </Box>
  ) : null;

  const refreshDataQuery = useMemo(
    () => new TransactionQuery({ transactionId: String(transaction.id) }),
    [transaction.id],
  );
  return (
    <EntityModal
      growing
      entity={transaction}
      Icon={FaExchangeAlt}
      title="Transaction details"
      onClose={close}
      footer={footer}
      refreshDataQuery={refreshDataQuery}
    >
      <TabOverview key="overview" transaction={transaction} account={account} />
      {transaction.status === "SUBMITTED" && (
        <TabDetails key="details" transaction={transaction} account={account} />
      )}
      <TabLabel key="note" note={note} />
      <FetchEntityHistory
        key="history"
        url={`/transactions/${transaction.id}/history`}
        entityType="transaction"
        entity={transaction}
        preventReplay={isAccountNotSpendableWithReason(account)}
      />
    </EntityModal>
  );
}

export default connectData(
  (props) => (
    <TransactionDetails accountId={props.transaction.account_id} {...props} />
  ),
  {
    RenderError: CardError,
    RenderLoading: GrowingSpinner,
    queries: {
      transaction: TransactionQuery,
    },
    propsToQueryParams: (props) => ({
      transactionId: props.match.params.transactionId,
    }),
  },
);

const TransactionDetails = connectData(TransactionDetailsComponent, {
  RenderError: CardError,
  RenderLoading: GrowingSpinner,
  queries: {
    account: AccountQuery,
  },
  propsToQueryParams: (props) => ({
    accountId: props.accountId,
  }),
});
