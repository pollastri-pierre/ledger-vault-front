// @flow

import React, { memo } from "react";
import invariant from "invariant";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { Trans } from "react-i18next";
import DoubleTilde from "components/icons/DoubleTilde";
import FakeInputContainer from "components/base/FakeInputContainer";

import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import CounterValue from "components/CounterValue";
import { Label, InputAmount, InputAmountNoUnits } from "components/base/form";
import {
  AmountTooHigh,
  AmountExceedMax,
  RippleAmountExceedMinBalance,
} from "utils/errors";
import { getMatchingRulesSet } from "utils/multiRules";
import { currencyUnitValueFormat } from "components/CurrencyUnitValue";
import { MIN_RIPPLE_BALANCE } from "bridge/RippleBridge";
import colors from "shared/colors";

import type { TransactionCreationStepProps } from "../types";

import TransactionCreationAccount from "./TransactionCreationAccount";
import WhiteListField from "../WhiteListField";

const TransactionCreationAmount = (
  props: TransactionCreationStepProps<any>,
) => {
  const { payload, updatePayload } = props;
  const { account, transaction, bridge } = payload;

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

  if (gateMaxAmount && transaction.amount.isGreaterThan(gateMaxAmount)) {
    amountErrors.push(
      new AmountExceedMax(null, {
        max: currencyUnitValueFormat(currency.units[0], gateMaxAmount),
      }),
    );
  }

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

  return (
    <Box flow={20}>
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
        <WhiteListField
          account={account}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
          whitelists={props.whitelists.edges.map(n => n.node)}
          bridge={bridge}
        />
      </Box>
      <Box flow={20}>
        <Box>
          <Label>
            <Trans i18nKey="transactionCreation:steps.account.amount" />
          </Label>
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
              {"Amount & recipient are matching "}
              <strong>{matchingRulesSet.name}</strong>
            </span>
          ) : (
            "No rules matched for this amount & recipient"
          )}
        </InfoBox>
      )}
    </Box>
  );
};

export default memo<TransactionCreationStepProps<any>>(
  TransactionCreationAmount,
);
