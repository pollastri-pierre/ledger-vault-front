// @flow

import React, { useState, useEffect, useRef } from "react";
import { BigNumber } from "bignumber.js";
import { useTranslation } from "react-i18next";

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
  const prevStrategy = usePrevious(transaction.utxoPickingStrategy);
  const prevFeeLevel = usePrevious(transaction.feeLevel);
  const { t } = useTranslation();

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
    transaction.utxoPickingStrategy,
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

    // VFE-98: even if we don't fetch fees if amount is equal to 0,
    // we still want to invalidate any pending fees fetching, and
    // reset the loading state
    if (transaction.amount.isEqualTo(0)) {
      setFeesStatus("idle");
      return;
    }

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

      const txGetFees = {};
      Object.assign(txGetFees, {
        fees_level: feeLevel || "normal",
        amount: transaction.amount,
        utxo: transaction.expectedNbUTXOs,
        recipient: transaction.recipient || "",
      });
      if (transaction.utxoPickingStrategy) {
        Object.assign(txGetFees, {
          utxo_picking_strategy: transaction.utxoPickingStrategy,
        });
      }
      const estimatedFees = await getFees(account, txGetFees, restlay);
      if (nonce !== instanceNonce.current || unsubscribed) return;

      // See VFE-161
      //
      // In *some cases* of UTXOs consolidation, the front calculate a certain
      // amount based on UTXOs but the backend-sent max_amount is lower than
      // this, because of fees (sometimes.. it's OK). So in this case, we reset
      // the amount to max_amount, because the tx is created with UTXOs amount
      // anyway, so we don't really care about the amount.
      //
      const isUTXOBasedFees = !!transaction.expectedNbUTXOs;
      const isAmountTooHigh = transaction.amount.isGreaterThan(
        estimatedFees.max_amount,
      );
      const shouldResetToMax = isUTXOBasedFees && isAmountTooHigh;

      onChangeTransaction({
        ...transaction,
        ...(shouldResetToMax ? { amount: estimatedFees.max_amount } : {}),
        estimatedFees: estimatedFees.fees,
        estimatedMaxAmount: estimatedFees.max_amount,
        error: null,
      });
      setFeesStatus("idle");
    } catch (err) {
      if (nonce !== instanceNonce.current || unsubscribed) return;
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
      transaction.recipient !== prevRecipient ||
      !transaction.amount.isEqualTo(prevAmount) ||
      transaction.utxoPickingStrategy !== prevStrategy ||
      transaction.feeLevel !== prevFeeLevel;

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
          <Label>{t("transactionCreation:steps.account.fees.title")}</Label>
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
            {t("transactionCreation:steps.account.feesInfos")}
          </InfoBox>
        </Box>
      </Box>
    </Box>
  );
}
export default connectData(FeesBitcoinKind);
