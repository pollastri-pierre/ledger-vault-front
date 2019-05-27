// @flow

import React from "react";
import invariant from "invariant";
import { Trans } from "react-i18next";
import { FaMoneyCheck } from "react-icons/fa";

import connectData from "restlay/connectData";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import MultiStepsFlow from "components/base/MultiStepsFlow";
import ApproveRequestButton from "components/ApproveRequestButton";
import AccountsQuery from "api/queries/AccountsQuery";
import { CardError } from "components/base/Card";
import { createAndApprove } from "device/interactions/hsmFlows";

import TransactionCreationAccount, {
  getBridgeAndTransactionFromAccount,
} from "./steps/TransactionCreationAccount";
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
    Step: TransactionCreationAccount,
  },
  {
    id: "amount",
    name: <Trans i18nKey="transactionCreation:steps.amount.title" />,
    Step: TransactionCreationAmount,
    requirements: (payload: TransactionCreationPayload<any>) =>
      !!payload.transaction,
  },
  {
    id: "note",
    name: <Trans i18nKey="transactionCreation:steps.note.title" />,
    Step: TransactionCreationNote,
    requirements: (payload: TransactionCreationPayload<any>) => {
      const { bridge, transaction, account } = payload;
      if (!bridge || !transaction || !account) return false;
      return bridge.checkValidTransactionSyncSync(account, transaction);
    },
  },
  {
    id: "confirmation",
    name: <Trans i18nKey="transactionCreation:steps.confirmation.title" />,
    Step: TransactionCreationConfirmation,
    Cta: ({
      payload,
      onClose,
    }: {
      payload: TransactionCreationPayload<any>,
      onClose: Function,
    }) => {
      const data = serializePayload(payload);
      return (
        <ApproveRequestButton
          interactions={createAndApprove}
          onSuccess={data => {
            console.log(data); // eslint-disable-line no-console
            onClose();
          }}
          disabled={false}
          additionalFields={{ type: "CREATE_TRANSACTION", data }}
          buttonLabel={<Trans i18nKey="transactionCreation:cta" />}
        />
      );
    },
  },
];

const title = <Trans i18nKey="transactionCreation:title" />;

export default connectData(
  props => {
    const { match, accounts } = props;
    let cursor = 0;
    let payload = initialPayload;

    if (match.params && match.params.id) {
      const acc = accounts.edges
        .map(e => e.node)
        .find(a => a.id === parseInt(match.params.id, 10));

      if (acc) {
        const {
          bridge,
          account,
          transaction,
        } = getBridgeAndTransactionFromAccount(acc);
        cursor = 1;
        payload = { ...initialPayload, account, transaction, bridge };
      }
    }
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
    },
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

  if (account.account_type === "Ethereum" || account.account_type === "ERC20") {
    Object.assign(tx, {
      gas_price: transaction.gasPrice.toFixed(),
      gas_limit: transaction.gasLimit.toFixed(),
    });
  }

  const request = {
    account_id: account.id,
    transaction: tx,
  };

  return request;
}
