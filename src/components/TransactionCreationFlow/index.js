// @flow

import React, { useMemo, useState } from "react";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import { Trans, useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { FaMoneyCheck, FaInfoCircle } from "react-icons/fa";
import { IoMdHelpBuoy } from "react-icons/io";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import type { RestlayEnvironment } from "restlay/connectData";
import HelpLink from "components/HelpLink";
import VaultLink from "components/VaultLink";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Modal from "components/base/Modal";
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
const mapStateToProps = state => ({
  requestToReplay: state.requestReplay,
});
const mapDispatch = {
  resetRequest,
};

type MaxUtxoErrorType = ?{ amount: BigNumber };

export default connect(
  mapStateToProps,
  mapDispatch,
)(
  connectData(
    props => {
      const { match, accounts, close, resetRequest, requestToReplay } = props;
      const [utxoError, setUtxoError] = useState<MaxUtxoErrorType>(null);
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
          <Modal isOpened={!!utxoError}>
            {!!utxoError && (
              <UtxoErrorModal
                setUtxoError={setUtxoError}
                account={acc}
                amount={utxoError.amount}
              />
            )}
          </Modal>
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
            additionalProps={{ ...props, setUtxoError }}
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

const UtxoErrorModal = ({
  setUtxoError,
  amount,
  account,
}: {
  setUtxoError: MaxUtxoErrorType => void,
  amount: BigNumber,
  account: Account,
}) => {
  return (
    <Box p={30} flow={20} align="center" justify="center" width={400}>
      <Box>
        <FaInfoCircle size={36} color="black" />
      </Box>
      <Box>
        To send more than{" "}
        <CurrencyAccountValue value={amount} account={account} /> , you must
        consolidate the UTXOs in the {account.name} account before proceeding
        with the transaction.
      </Box>
      <Box align="center" justify="center" horizontal flow={5}>
        <IoMdHelpBuoy size={20} />{" "}
        <Text fontWeight="semiBold">
          <HelpLink>Consolidate UTXOs</HelpLink>
        </Text>
      </Box>
      <Box horizontal flow={20} pt={20}>
        <Button type="outline" onClick={() => setUtxoError(null)}>
          Change amount
        </Button>
        <Button type="filled">
          <VaultLink withRole to={`/dashboard/consolidate/${account.id}`}>
            Consolidate
          </VaultLink>
        </Button>
      </Box>
    </Box>
  );
};

const purgePayload = (
  data: *,
  accounts: Account[],
): TransactionCreationPayload<any> => {
  const account = accounts.find(a => a.id === data.account_id);
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
    invariant(transaction.feeLevel, "Invalid payload");
    Object.assign(tx, {
      fees_level: transaction.feeLevel,
    });
  }
  if (transaction.utxoPickingStrategy) {
    Object.assign(tx, {
      utxo_picking_strategy: transaction.utxoPickingStrategy,
    });
  }

  if (account.account_type === "Ethereum" || account.account_type === "Erc20") {
    // $FlowFixMe
    const { gasPrice, gasLimit } = transaction;
    invariant(gasPrice && gasLimit, "Invalid transaction");
    Object.assign(tx, {
      gas_price: gasPrice.toFixed(),
      gas_limit: gasLimit.toFixed(),
    });
  }

  if (account.account_type === "Ripple") {
    invariant(transaction.estimatedFees, "Invalid transaction");
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
