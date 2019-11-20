// @flow

import React, { useMemo } from "react";
import invariant from "invariant";
import { Trans } from "react-i18next";
import { FaMoneyCheck } from "react-icons/fa";

import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import SearchTransactions from "api/queries/SearchTransactions";
import SearchWhitelists from "api/queries/SearchWhitelists";
import MultiStepsFlow from "components/base/MultiStepsFlow";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Button from "components/base/Button";
import MultiStepsSuccess from "components/base/MultiStepsFlow/MultiStepsSuccess";
import ApproveRequestButton from "components/ApproveRequestButton";
import { handleCancelOnDevice } from "utils/request";
import { getMatchingRulesSet } from "utils/multiRules";
import AccountsQuery from "api/queries/AccountsQuery";
import { CardError } from "components/base/Card";
import { createAndApprove } from "device/interactions/hsmFlows";
import Amount from "components/Amount";
import { isAccountSpendable } from "utils/transactions";

import { getBridgeAndTransactionFromAccount } from "./steps/TransactionCreationAccount";
import TransactionCreationAmount from "./steps/TransactionCreationAmount";
import TransactionCreationNote from "./steps/TransactionCreationNote";
import TransactionCreationConfirmation from "./steps/TransactionCreationConfirmation";

import type { TransactionCreationPayload } from "./types";

const initialPayload: TransactionCreationPayload<any> = {
  transaction: null,
  account: null,
  bridge: null,
};

const steps = [
  {
    id: "account",
    name: <Trans i18nKey="transactionCreation:steps.account.title" />,
    Step: TransactionCreationAmount,
    CustomFooterElementLeft: ({
      payload,
    }: {
      payload: TransactionCreationPayload<any>,
    }) => {
      const { account, transaction, bridge } = payload;
      const totalSpent =
        account &&
        bridge &&
        transaction &&
        bridge.getTotalSpent(account, transaction);
      return (
        <Box flow={5} mx={25}>
          <Text
            i18nKey="transactionCreation:steps.account.total"
            fontWeight="bold"
            size="header"
          />
          <Amount
            smallerInnerMargin
            account={account}
            value={totalSpent}
            strong
          />
        </Box>
      );
    },
  },
  {
    id: "note",
    name: <Trans i18nKey="transactionCreation:steps.note.title" />,
    Step: TransactionCreationNote,
    requirements: (payload: TransactionCreationPayload<any>) => {
      const { bridge, transaction, account } = payload;
      if (!bridge || !transaction || !account) return false;
      const isValidTx = bridge.checkValidTransactionSync(account, transaction);
      const matchingRulesSet = getMatchingRulesSet({
        transaction: {
          currency: account.currency,
          amount: transaction.amount,
          recipient: transaction.recipient,
        },
        governanceRules: account.governance_rules,
      });
      return isValidTx && !!matchingRulesSet;
    },
  },
  {
    id: "confirmation",
    name: <Trans i18nKey="transactionCreation:steps.confirmation.title" />,
    Step: TransactionCreationConfirmation,
    Cta: (props: {
      payload: TransactionCreationPayload<any>,
      onClose: Function,
      restlay: RestlayEnvironment,
      onSuccess: () => void,
    }) => {
      const { payload, onClose, restlay, onSuccess } = props;
      const data = serializePayload(payload);
      return (
        <ApproveRequestButton
          interactions={createAndApprove("TRANSACTION")}
          onError={handleCancelOnDevice(restlay, onClose)}
          onSuccess={async () => {
            try {
              if (payload.account) {
                await restlay.fetchQuery(
                  new SearchTransactions({
                    account: [`${payload.account.id}`],
                  }),
                );
              }
            } finally {
              onSuccess();
            }
          }}
          disabled={false}
          additionalFields={{
            type: "CREATE_TRANSACTION",
            targetType: "CREATE_TRANSACTION",
            data,
          }}
          buttonLabel={<Trans i18nKey="transactionCreation:cta" />}
        />
      );
    },
  },
  {
    id: "finish",
    name: <Trans i18nKey="transactionCreation:finish" />,
    hideBack: true,
    Step: () => {
      return (
        <MultiStepsSuccess
          title={<Trans i18nKey="transactionCreation:finishTitle" />}
          desc={<Trans i18nKey="transactionCreation:finishDesc" />}
        />
      );
    },
    Cta: ({ onClose }: { onClose: () => void }) => {
      return (
        <Box my={10}>
          <Button type="filled" onClick={onClose}>
            <Trans i18nKey="common:done" />
          </Button>
        </Box>
      );
    },
  },
];

const title = <Trans i18nKey="transactionCreation:title" />;

export default connectData(
  props => {
    const { match, accounts } = props;
    const cursor = 0;
    let payload = initialPayload;

    const filteredAccounts = useMemo(
      () => accounts.edges.map(el => el.node).filter(isAccountSpendable),
      [accounts],
    );
    const acc =
      match.params && match.params.id
        ? filteredAccounts.find(a => a.id === parseInt(match.params.id, 10))
        : filteredAccounts[0];
    const { bridge, account, transaction } = getBridgeAndTransactionFromAccount(
      acc,
    );
    payload = { ...initialPayload, account, transaction, bridge };
    return (
      <GrowingCard>
        <MultiStepsFlow
          Icon={FaMoneyCheck}
          title={title}
          initialPayload={payload}
          steps={steps}
          additionalProps={props}
          initialCursor={cursor}
          onClose={props.close}
        />
      </GrowingCard>
    );
  },
  {
    RenderLoading: GrowingSpinner,
    RenderError: CardError,
    queries: {
      accounts: AccountsQuery,
      whitelists: SearchWhitelists,
    },
    propsToQueryParams: () => ({
      pageSize: -1,
    }),
  },
);

function serializePayload(payload: TransactionCreationPayload<*>) {
  const { transaction, account } = payload;

  invariant(transaction && account, "invalid payload");

  const tx: Object = {
    recipient: transaction.recipient,
    amount: transaction.amount.toFixed(),
    note: transaction.note,
  };

  if (account.account_type === "Bitcoin") {
    Object.assign(tx, {
      fees_level: transaction.feeLevel,
    });
  }

  if (account.account_type === "Ethereum" || account.account_type === "Erc20") {
    Object.assign(tx, {
      gas_price: transaction.gasPrice.toFixed(),
      gas_limit: transaction.gasLimit.toFixed(),
    });
  }

  if (account.account_type === "Ripple") {
    Object.assign(tx, {
      memos: [],
      destination_tag: transaction.destinationTag || null,
      fees: transaction.estimatedFees.toFixed(),
    });
  }

  const request = {
    account_id: account.id,
    transaction: tx,
  };

  return request;
}
