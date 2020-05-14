// @flow

import React, { useCallback } from "react";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { useTranslation } from "react-i18next";

import DoubleTilde from "components/icons/DoubleTilde";
import FakeInputContainer from "components/base/FakeInputContainer";
import Modal from "components/base/Modal";
import Box from "components/base/Box";
import ConvertEIP55 from "components/ConvertEIP55";
import InfoBox from "components/base/InfoBox";
import CounterValue from "components/CounterValue";
import {
  Label,
  InputAmount,
  InputAmountNoUnits,
  Form,
} from "components/base/form";
import UTXOsErrorModal from "components/TransactionCreationFlow/UTXOsErrorModal";
import { AmountTooHigh, RippleAmountExceedMinBalance } from "utils/errors";
import { getMatchingRulesSet } from "utils/multiRules";
import { MIN_RIPPLE_BALANCE } from "bridge/RippleBridge";
import colors from "shared/colors";

import type { TransactionCreationStepProps } from "../types";

import TransactionCreationAccount from "./TransactionCreationAccount";
import AddressField from "../AddressField";

const TransactionCreationAmount = (
  props: TransactionCreationStepProps<any>,
) => {
  const {
    payload,
    accounts,
    whitelists: whitelistsConnection,
    updatePayload,
    onEnter,
  } = props;

  const { account, transaction, bridge } = payload;
  const { t } = useTranslation();

  invariant(account, "transaction has not been chosen yet");
  invariant(transaction, "transaction has not been created yet");
  invariant(bridge, "bridge has not been created yet");

  const { governance_rules } = account;

  invariant(governance_rules, "account has not governance rules");

  const { ExtraFields, FeesField } = bridge;
  const isERC20 = account.account_type === "Erc20";
  const currency = getCryptoCurrencyById(account.currency);
  const onChangeTransaction = useCallback(
    transaction => updatePayload({ transaction }),
    [updatePayload],
  );

  const onChangeAmount = value =>
    onChangeTransaction(bridge.editTransactionAmount(transaction, value));

  const onResetAmount = () => onChangeAmount(BigNumber(0));

  const onChangeRecipient = recipient =>
    onChangeTransaction(
      bridge.editTransactionRecipient(transaction, recipient),
    );

  const amountErrors = collectAmountErrors(bridge, account, transaction);

  const maxAmount = bridge.getMaxAmount(transaction);
  const utxoMaxReached =
    !!maxAmount && transaction.amount.isGreaterThan(maxAmount);

  const matchingRulesSet = getMatchingRulesSet({
    transaction: {
      currency: currency.id,
      amount: transaction.amount,
      recipient: transaction.recipient,
    },
    governanceRules: governance_rules,
  });

  const showMatchingRulesSet =
    transaction.amount.isGreaterThan(0) && transaction.recipient;

  const whitelists = whitelistsConnection.edges.map(n => n.node);

  const inner = (
    <>
      <Modal isOpened={utxoMaxReached}>
        <UTXOsErrorModal
          onReset={onResetAmount}
          account={account}
          amount={maxAmount}
        />
      </Modal>
      <Box flow={24}>
        <TransactionCreationAccount
          accounts={accounts}
          updatePayload={updatePayload}
          payload={payload}
        />
        <AddressField
          account={account}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
          whitelists={whitelists}
          bridge={bridge}
        />
        {currency.family === "ethereum" && (
          <ConvertEIP55
            value={transaction.recipient}
            onChange={onChangeRecipient}
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
              <FakeInputContainer
                width={280}
                style={{ background: "hsl(0, 0%, 95%)" }}
              >
                <CounterValue
                  smallerInnerMargin
                  value={transaction.amount}
                  from={currency.id}
                />
              </FakeInputContainer>
            </Box>
          </Box>
        </Box>
        <FeesField
          bridge={bridge}
          account={account}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
        />
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
    </>
  );
  return <Form onSubmit={onEnter}>{inner}</Form>;
};

function collectAmountErrors(bridge, account, transaction) {
  const amountErrors = [];
  const transactionError = bridge.getTransactionError(transaction);

  if (account.account_type === "Ripple") {
    const amountExceedRippleLimit = bridge
      .getTotalSpent(account, transaction)
      .isGreaterThan(account.balance.minus(MIN_RIPPLE_BALANCE));
    if (amountExceedRippleLimit) {
      amountErrors.push(new RippleAmountExceedMinBalance());
    }
  } else {
    const account_balance =
      account.account_type === "Bitcoin"
        ? account.available_balance
        : account.balance;
    const amountTooHigh =
      bridge
        .getTotalSpent(account, transaction)
        .isGreaterThan(account_balance) ||
      transactionError instanceof AmountTooHigh;
    if (amountTooHigh) {
      amountErrors.push(new AmountTooHigh());
    }
  }
  return amountErrors;
}

export default TransactionCreationAmount;
