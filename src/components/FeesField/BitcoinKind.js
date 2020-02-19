// @flow

import React, { useState, useEffect, useRef } from "react";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";

import type { Account } from "data/types";
import connectData from "restlay/connectData";
import colors from "shared/colors";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Transaction as BitcoinLikeTx } from "bridge/BitcoinBridge";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import FakeInputContainer from "components/base/FakeInputContainer";
import DoubleTilde from "components/icons/DoubleTilde";
import { remapError, AmountTooHigh } from "utils/errors";
import TranslatedError from "components/TranslatedError";
import Box from "components/base/Box";
import Spinner from "components/base/Spinner";
import Text from "components/base/Text";
import NotApplicableText from "components/base/NotApplicableText";
import InfoBox from "components/base/InfoBox";
import { Label } from "components/base/form";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import { getFees } from "utils/transactions";
import usePrevious from "hooks/usePrevious";
import RecalculateButton from "./RecalculateButton";

import FeeSelect from "./FeeSelect";

type FeesStatus = "idle" | "fetching" | "error";

type Props = {
  account: Account,
  onChangeTransaction: BitcoinLikeTx => void,
  restlay: RestlayEnvironment,
  transaction: BitcoinLikeTx,
  bridge: WalletBridge<BitcoinLikeTx>,
};

function FeesBitcoinKind(props: Props) {
  const instanceNonce = useRef(0);

  const { account, transaction, restlay, onChangeTransaction, bridge } = props;
  const currency = getCryptoCurrencyById(account.currency);
  const prevRecipient = usePrevious(transaction.recipient);
  const prevAmount = usePrevious(transaction.amount);
  const prevFeeLevel = usePrevious(transaction.feeLevel);

  const feeLevel =
    bridge.getTransactionFeeLevel &&
    bridge.getTransactionFeeLevel(account, transaction);

  const [feesStatus, setFeesStatus] = useState<FeesStatus>("idle");
  const [feesError, setFeesError] = useState(null);
  const effectDeps = [
    account,
    currency,
    restlay,
    bridge,
    transaction.recipient,
    transaction.amount,
    transaction.feeLevel,
  ];

  const reComputeFees = () => {
    onChangeTransaction({
      ...transaction,
      estimatedFees: null,
      estimatedMaxAmount: null,
      error: null,
    });
    effect();
  };

  const effect = async unsubscribed => {
    const nonce = ++instanceNonce.current;
    try {
      const recipientError = await bridge.getRecipientError(
        restlay,
        currency,
        transaction.recipient,
      );

      if (nonce !== instanceNonce.current || unsubscribed) return;
      if (recipientError) {
        setFeesStatus("idle");
        return;
      }

      setFeesStatus("fetching");

      const txGetFees = {
        fees_level: feeLevel || "normal",
        amount: transaction.amount,
        recipient: transaction.recipient || "",
      };
      const estimatedFees = await getFees(account, txGetFees, restlay);
      if (nonce !== instanceNonce.current || unsubscribed) return;

      onChangeTransaction({
        ...transaction,
        estimatedFees: estimatedFees.fees,
        estimatedMaxAmount: estimatedFees.max_amount,
        error: null,
      });
      setFeesStatus("idle");
    } catch (err) {
      console.error(err); // eslint-disable-line no-console

      const error = remapError(err);

      if (!(error instanceof AmountTooHigh)) {
        setFeesError(error);
      }
      setFeesStatus("error");

      onChangeTransaction({
        ...transaction,
        error,
        estimatedFees: null,
        estimatedMaxAmount: null,
      });
    }
  };
  useEffect(() => {
    let unsubscribed = false;

    const feesInvalidated =
      (transaction.recipient !== prevRecipient ||
        !transaction.amount.isEqualTo(prevAmount) ||
        transaction.feeLevel !== prevFeeLevel) &&
      !transaction.amount.isEqualTo(0);

    if (feesInvalidated) {
      effect(unsubscribed);
    }
    return () => {
      unsubscribed = true;
    };
  }, effectDeps); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeFee = (feesSelected: Speed) => {
    bridge.editTransactionFeeLevel &&
      onChangeTransaction(
        bridge.editTransactionFeeLevel(account, transaction, feesSelected),
      );
  };

  return (
    <Box horizontal flow={20}>
      <Box noShrink grow>
        <Box horizontal align="flex-start" flow={10}>
          <Label>
            <Trans i18nKey="transactionCreation:steps.account.fees.title" />
          </Label>
          {(transaction.estimatedFees || feesStatus === "error") && (
            <RecalculateButton onClick={reComputeFees} />
          )}
        </Box>
        <Box flow={20}>
          <Box horizontal justify="space-between">
            <Box width={180}>
              <FeeSelect value={feeLevel || "normal"} onChange={onChangeFee} />
            </Box>
            {feesStatus === "error" ? (
              <Text color={colors.grenade}>
                <TranslatedError field="description" error={feesError} />
              </Text>
            ) : (
              <Box horizontal flow={15}>
                <FakeInputContainer width={180}>
                  {transaction.estimatedFees ? (
                    <CurrencyAccountValue
                      account={account}
                      value={BigNumber(transaction.estimatedFees)}
                    />
                  ) : feesStatus === "fetching" ? (
                    <Spinner size="small" />
                  ) : (
                    <NotApplicableText />
                  )}
                </FakeInputContainer>
                <Box justify="center">
                  <DoubleTilde size={14} color={colors.textLight} />
                </Box>
                <FakeInputContainer width={180}>
                  {transaction.estimatedFees ? (
                    <CounterValue
                      smallerInnerMargin
                      value={transaction.estimatedFees}
                      from={account.currency}
                    />
                  ) : feesStatus === "fetching" ? (
                    <Spinner size="small" />
                  ) : (
                    <NotApplicableText />
                  )}
                </FakeInputContainer>
              </Box>
            )}
          </Box>
          <InfoBox type="info">
            <Trans i18nKey="transactionCreation:steps.account.feesInfos" />
          </InfoBox>
        </Box>
      </Box>
    </Box>
  );
}
export default connectData(FeesBitcoinKind);
