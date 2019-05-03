// @flow

import React, { memo } from "react";
import invariant from "invariant";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { Trans } from "react-i18next";

import colors from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";
import AccountName from "components/AccountName";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import InputAddress from "components/TransactionCreationFlow/InputAddress";
import { Label, InputAmount, InputAmountNoUnits } from "components/base/form";
import { AmountTooHigh, AmountExceedMax } from "utils/errors";
import { currencyUnitValueFormat } from "components/CurrencyUnitValue";

import type { TransactionCreationStepProps } from "../types";

const amountTooHighError = new AmountTooHigh();

const TransactionCreationAmount = (
  props: TransactionCreationStepProps<any>,
) => {
  const { payload, updatePayload } = props;
  const { account, transaction, bridge } = payload;

  invariant(account, "transaction has not been chosen yet");
  invariant(transaction, "transaction has not been created yet");
  invariant(bridge, "bridge has not been created yet");

  const { EditFees } = bridge;
  const isERC20 = account.account_type === "ERC20";
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
  const amountTooHigh = bridge
    .getTotalSpent(account, transaction)
    .isGreaterThan(account.balance);
  if (amountTooHigh) {
    amountErrors.push(amountTooHighError);
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
      <Box horizontal justify="space-between" flow={20}>
        <Box grow style={{ maxWidth: 370 }}>
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
        <Box align="flex-end">
          <Label>Sending from</Label>
          <Box
            horizontal
            align="center"
            flow={10}
            style={{ height: 40, border: `1px solid ${colors.form.border}` }}
            px={10}
            borderRadius={4}
            bg={colors.form.bg}
          >
            <AccountName account={account} />
            <Text color={colors.textLight} mt={2} small>
              <CurrencyAccountValue account={account} value={account.balance} />
            </Text>
          </Box>
        </Box>
      </Box>
      <Box horizontal flow={20}>
        <Box grow>
          <Label>
            <Trans i18nKey="transactionCreation:steps.amount.amount" />
          </Label>
          <Box grow>
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
    </Box>
  );
};

export default memo<TransactionCreationStepProps<any>>(
  TransactionCreationAmount,
);
