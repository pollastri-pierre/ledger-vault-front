// @flow

import React, { useMemo } from "react";
import invariant from "invariant";
import { Trans, useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { FaMoneyCheck } from "react-icons/fa";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import type { RestlayEnvironment } from "restlay/connectData";
import connectData from "restlay/connectData";
import { getBridgeForCurrency } from "bridge";
import { resetRequest } from "redux/modules/requestReplayStore";
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
import type { Account } from "data/types";
import type { Transaction as BTCLikeTransaction } from "bridge/BitcoinBridge";
import type { Transaction as ETHLikeTransaction } from "bridge/EthereumBridge";
import type { Transaction as XRPLikeTransaction } from "bridge/RippleBridge";

import { getBridgeAndTransactionFromAccount } from "./steps/TransactionCreationAccount";
import TransactionCreationAmount from "./steps/TransactionCreationAmount";
import TransactionCreationNote from "./steps/TransactionCreationNote";
import TransactionCreationConfirmation from "./steps/TransactionCreationConfirmation";

import type {
  TransactionCreationPayload,
  serializePayloadProps,
} from "./types";

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
          {account && (
            <Amount
              smallerInnerMargin
              account={account}
              value={totalSpent}
              strong
            />
          )}
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
      const { governance_rules } = account;
      if (!governance_rules) return false;
      const isValidTx = bridge.checkValidTransactionSync(account, transaction);
      const matchingRulesSet = getMatchingRulesSet({
        transaction: {
          currency: account.currency,
          amount: transaction.amount,
          recipient: transaction.recipient,
        },
        governanceRules: governance_rules,
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
      const { t } = useTranslation();
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
          buttonLabel={t("transactionCreation:cta")}
        />
      );
    },
  },
  {
    id: "finish",
    name: <Trans i18nKey="transactionCreation:finish" />,
    hideBack: true,
    Step: () => {
      const { t } = useTranslation();
      return (
        <MultiStepsSuccess
          title={t("transactionCreation:finishTitle")}
          desc={t("transactionCreation:finishDesc")}
        />
      );
    },
    Cta: ({ onClose }: { onClose: () => void }) => {
      const { t } = useTranslation();
      return (
        <Box my={10}>
          <Button type="filled" onClick={onClose}>
            {t("common:done")}
          </Button>
        </Box>
      );
    },
  },
];

const title = <Trans i18nKey="transactionCreation:title" />;
const mapStateToProps = (state) => ({
  requestToReplay: state.requestReplay,
});
const mapDispatch = {
  resetRequest,
};

export default connect(
  mapStateToProps,
  mapDispatch,
)(
  connectData(
    (props) => {
      const { match, accounts, close, resetRequest, requestToReplay } = props;
      const cursor = 0;
      let payload = initialPayload;

      const filteredAccounts = useMemo(
        () => accounts.edges.map((el) => el.node).filter(isAccountSpendable),
        [accounts],
      );
      const acc =
        match.params && match.params.id
          ? filteredAccounts.find((a) => a.id === parseInt(match.params.id, 10))
          : filteredAccounts[0];
      const {
        bridge,
        account,
        transaction,
      } = getBridgeAndTransactionFromAccount(acc);
      payload = { ...initialPayload, account, transaction, bridge };
      const closeAndEmptyStore = () => {
        resetRequest();
        close();
      };

      return (
        <GrowingCard>
          <MultiStepsFlow
            Icon={FaMoneyCheck}
            title={title}
            payloadToCompareTo={initialPayload}
            initialPayload={
              (requestToReplay &&
                purgePayload(requestToReplay.entity, filteredAccounts)) ||
              payload
            }
            steps={steps}
            additionalProps={{ ...props }}
            initialCursor={cursor}
            onClose={closeAndEmptyStore}
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
  ),
);

const purgePayload = (
  data: *,
  accounts: Account[],
): TransactionCreationPayload<any> => {
  const account = accounts.find((a) => a.id === data.account_id);
  const currency = getCryptoCurrencyById(data.currency);
  if (!account) throw new Error("Account not spendable");
  if (!currency) throw new Error("no valid currency");
  return {
    transaction: {
      fees_level: data.fees_level,
      note: data.notes[0] || { title: null, note: null },
      gas_price: null,
      gas_limit: null,
      fees: null,
      recipient: data.recipient,
      amount: data.amount,
      whitelist_id: data.whitelist_id,
    },
    account,
    bridge: getBridgeForCurrency(currency),
  };
};

export function serializePayload(payload: serializePayloadProps) {
  const { transaction, account } = payload;

  invariant(transaction && account, "invalid payload");

  const tx: Object = {
    recipient: transaction.recipient,
    amount: transaction.amount.toFixed(),
    note: transaction.note,
  };

  if (account.account_type === "Bitcoin") {
    // $FlowFixMe we KNOW it's a BTCLikeTransaction
    const bitcoinTx = (transaction: BTCLikeTransaction);

    Object.assign(tx, {
      fees_level: bitcoinTx.fees.fees_level.toUpperCase(),
      fees_per_byte: bitcoinTx.fees_per_byte,
      max_fees: bitcoinTx.estimatedFees,
    });

    if (bitcoinTx.utxoPickingStrategy) {
      Object.assign(tx, {
        utxo_picking_strategy: bitcoinTx.utxoPickingStrategy,
      });
    }

    if (bitcoinTx.fees.fees_level === "custom") {
      throw new Error("Not implemented yet");
    }
  }

  if (account.account_type === "Ethereum" || account.account_type === "Erc20") {
    // $FlowFixMe we KNOW it's a XRPLikeTransaction
    const ethTx = (transaction: ETHLikeTransaction);

    const { gasPrice, gasLimit } = ethTx;
    invariant(gasPrice, "Gas price is missing");
    invariant(gasLimit, "Gas limit is missing");
    Object.assign(tx, {
      fees_level: ethTx.fees.fees_level.toUpperCase(),
      max_fees: gasPrice.times(gasLimit),
      gas_price: gasPrice,
      gas_limit: gasLimit,
    });
  }

  if (account.account_type === "Ripple") {
    // $FlowFixMe we KNOW it's a XRPLikeTransaction
    const xrpTx = (transaction: XRPLikeTransaction);

    Object.assign(tx, {
      memos: [],
      destination_tag: xrpTx.destinationTag || null,
      max_fees: xrpTx.estimatedFees,
      fees_level: xrpTx.fees.fees_level.toUpperCase(),
    });
  }

  const request = {
    account_id: account.id,
    transaction: tx,
  };

  return request;
}
