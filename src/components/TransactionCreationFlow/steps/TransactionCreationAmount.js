// @flow

import React, { memo } from "react";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { useTranslation } from "react-i18next";
import DoubleTilde from "components/icons/DoubleTilde";
import FakeInputContainer from "components/base/FakeInputContainer";
import { IoMdHelpBuoy } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";

import Modal from "components/base/Modal";
import Button from "components/base/Button";
import VaultLink from "components/VaultLink";
import HelpLink from "components/HelpLink";
import Text from "components/base/Text";
import Box from "components/base/Box";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import ConvertEIP55 from "components/ConvertEIP55";
import InfoBox from "components/base/InfoBox";
import CounterValue from "components/CounterValue";
import {
  Label,
  InputAmount,
  InputAmountNoUnits,
  Form,
} from "components/base/form";
import { AmountTooHigh, RippleAmountExceedMinBalance } from "utils/errors";
import { getMatchingRulesSet } from "utils/multiRules";
import { MIN_RIPPLE_BALANCE } from "bridge/RippleBridge";
import colors from "shared/colors";

import type { Account } from "data/types";
import type { TransactionCreationStepProps } from "../types";

import TransactionCreationAccount from "./TransactionCreationAccount";
import AddressField from "../AddressField";

const TransactionCreationAmount = (
  props: TransactionCreationStepProps<any>,
) => {
  const { payload, updatePayload, onEnter } = props;
  const { account, transaction, bridge } = payload;
  const { t } = useTranslation();
  invariant(account, "transaction has not been chosen yet");
  invariant(transaction, "transaction has not been created yet");
  invariant(bridge, "bridge has not been created yet");

  const { governance_rules } = account;

  invariant(governance_rules, "account has not governance rules");

  const { EditFees, ExtraFields } = bridge;
  const isERC20 = account.account_type === "Erc20";
  const currency = getCryptoCurrencyById(account.currency);
  const transactionError = bridge.getTransactionError(account, transaction);

  const onChangeTransaction = transaction => updatePayload({ transaction });

  const onChangeAmount = value =>
    onChangeTransaction(
      bridge.editTransactionAmount(account, transaction, value),
    );

  const handleChangeRecipient = recipient =>
    onChangeTransaction(
      bridge.editTransactionRecipient(account, transaction, recipient),
    );

  // input amount validation
  const amountErrors = [];
  const gateMaxAmount =
    bridge.getMaxAmount && bridge.getMaxAmount(account, transaction);

  if (account.account_type === "Ripple") {
    const amountExceedRippleLimit = bridge
      .getTotalSpent(account, transaction)
      .isGreaterThan(account.balance.minus(MIN_RIPPLE_BALANCE));
    if (amountExceedRippleLimit) {
      amountErrors.push(new RippleAmountExceedMinBalance());
    }
  } else {
    const amountTooHigh =
      bridge
        .getTotalSpent(account, transaction)
        .isGreaterThan(account.balance) ||
      transactionError instanceof AmountTooHigh;
    if (amountTooHigh) {
      amountErrors.push(new AmountTooHigh());
    }
  }

  const utxoMaxReached =
    !!gateMaxAmount && transaction.amount.isGreaterThan(gateMaxAmount);

  const matchingRulesSet = getMatchingRulesSet({
    transaction: {
      currency: currency.id,
      amount: transaction.amount,
      recipient: transaction.recipient,
    },
    governanceRules: governance_rules,
  });

  const showMatchingRulesSet =
    transaction.amount &&
    transaction.amount.isGreaterThan(0) &&
    transaction.recipient;

  const whitelists = props.whitelists.edges.map(n => n.node);

  const inner = (
    <Box flow={20}>
      <Modal isOpened={utxoMaxReached}>
        {!!payload.account && (
          <UtxoErrorModal
            reset={() => onChangeAmount(BigNumber(0))}
            account={payload.account}
            amount={gateMaxAmount}
          />
        )}
      </Modal>
      <Box grow>
        <TransactionCreationAccount
          accounts={props.accounts}
          updatePayload={props.updatePayload}
          transitionTo={props.transitionTo}
          payload={props.payload}
          initialPayload={props.initialPayload}
          onClose={props.onClose}
        />
      </Box>
      <Box grow>
        <AddressField
          account={account}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
          whitelists={whitelists}
          bridge={bridge}
        />
      </Box>
      {currency.family === "ethereum" && (
        <ConvertEIP55
          value={transaction.recipient}
          onChange={handleChangeRecipient}
        />
      )}
      <Box flow={20}>
        <Box>
          <Label>{t("transactionCreation:steps.account.amount")}</Label>
          <Box horizontal justify="space-between">
            <Box width={280}>
              {isERC20 ? (
                <InputAmountNoUnits
                  width="100%"
                  account={account}
                  bridge={bridge}
                  transaction={transaction}
                  onChangeTransaction={onChangeTransaction}
                  errors={amountErrors}
                />
              ) : (
                <InputAmount
                  width="100%"
                  currency={currency}
                  value={transaction.amount}
                  onChange={onChangeAmount}
                  errors={amountErrors}
                  hideCV
                  unitLeft
                />
              )}
            </Box>
            <Box justify="center">
              <DoubleTilde size={14} color={colors.textLight} />
            </Box>
            <FakeInputContainer width={280}>
              <CounterValue
                smallerInnerMargin
                value={transaction.amount}
                from={currency.id}
              />
            </FakeInputContainer>
          </Box>
        </Box>
      </Box>
      {EditFees && (
        <EditFees
          account={account}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
          bridge={bridge}
        />
      )}
      {ExtraFields && (
        <ExtraFields
          account={account}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
          bridge={bridge}
        />
      )}
      {showMatchingRulesSet && (
        <InfoBox type={matchingRulesSet ? "success" : "error"} withIcon>
          {matchingRulesSet ? (
            <span>
              {"Amount and recipient are matching "}
              <strong>{matchingRulesSet.name}</strong>
            </span>
          ) : (
            "No rules matched for this amount & recipient"
          )}
        </InfoBox>
      )}
    </Box>
  );
  return <Form onSubmit={onEnter}>{inner}</Form>;
};

export default memo<TransactionCreationStepProps<any>>(
  TransactionCreationAmount,
);

const UtxoErrorModal = ({
  reset,
  amount,
  account,
}: {
  reset: void => void,
  amount: BigNumber,
  account: Account,
}) => {
  return (
    <Box p={30} flow={20} align="center" justify="center" width={400}>
      <Box>
        <FaInfoCircle size={36} color="black" />
      </Box>
      <Box>
        <p>
          To create a transaction over{" "}
          <strong>
            <CurrencyAccountValue account={account} value={amount} />
          </strong>
          , you must first consolidate the UTXOs in the{" "}
          <strong>{account.name}</strong> account.
        </p>
      </Box>
      <Box align="center" justify="center" horizontal flow={5}>
        <IoMdHelpBuoy size={20} />{" "}
        <Text fontWeight="semiBold">
          <HelpLink subLink="/Content/transactions/tx_consolidate.html">
            Learn more on UTXO consolidation
          </HelpLink>
        </Text>
      </Box>
      <Box horizontal flow={20} pt={20}>
        <Button type="outline" onClick={reset}>
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
