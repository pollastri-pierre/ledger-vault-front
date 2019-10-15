// @flow

import React, { memo } from "react";
import invariant from "invariant";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import Text from "components/base/Text";
import AccountName from "components/AccountName";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import InputAddress from "components/TransactionCreationFlow/InputAddress";
import { Label, InputAmount, InputAmountNoUnits } from "components/base/form";
import {
  AmountTooHigh,
  AmountExceedMax,
  RippleAmountExceedMinBalance,
} from "utils/errors";
import { currencyUnitValueFormat } from "components/CurrencyUnitValue";
import { MIN_RIPPLE_BALANCE } from "bridge/RippleBridge";

import type { TransactionCreationStepProps } from "../types";

const TransactionCreationAmount = (
  props: TransactionCreationStepProps<any>,
) => {
  const { payload, updatePayload } = props;
  const { account, transaction, bridge } = payload;

  invariant(account, "transaction has not been chosen yet");
  invariant(transaction, "transaction has not been created yet");
  invariant(bridge, "bridge has not been created yet");

  const { EditFees, ExtraFields } = bridge;
  const isERC20 = account.account_type === "Erc20";
  const currency = getCryptoCurrencyById(account.currency);

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
    const amountTooHigh = bridge
      .getTotalSpent(account, transaction)
      .isGreaterThan(account.balance);
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

  return (
    <Box flow={20}>
      <Box grow flow={20}>
        <Box horizontal align="center" justify="space-between" mb={20}>
          <Box>
            <Label>
              <Trans i18nKey="transactionCreation:steps.amount.accountToDebit" />
            </Label>
            <Text bold large>
              <AccountName account={account} />
            </Text>
          </Box>
          <Box>
            <Label>
              <Trans i18nKey="transactionCreation:steps.amount.balance" />
            </Label>
            <Text bold large lineHeight={1}>
              <CurrencyAccountValue account={account} value={account.balance} />
            </Text>
          </Box>
        </Box>
        <Box grow>
          <Label>
            <Trans i18nKey="transactionCreation:steps.amount.recipient" />
          </Label>
          <InputAddress
            placeholder="Recipient address"
            autoFocus
            account={account}
            transaction={transaction}
            onChangeTransaction={onChangeTransaction}
            bridge={bridge}
          />
        </Box>
      </Box>
      <Box horizontal flow={20}>
        <Box>
          <Label>
            <Trans i18nKey="transactionCreation:steps.amount.amount" />
          </Label>
          <Box grow horizontal>
            {isERC20 ? (
              <InputAmountNoUnits
                width={370}
                account={account}
                bridge={bridge}
                transaction={transaction}
                onChangeTransaction={onChangeTransaction}
                errors={amountErrors}
              />
            ) : (
              <InputAmount
                currency={currency}
                value={transaction.amount}
                onChange={onChangeAmount}
                errors={amountErrors}
              />
            )}
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
    </Box>
  );
};

export default memo<TransactionCreationStepProps<any>>(
  TransactionCreationAmount,
);
