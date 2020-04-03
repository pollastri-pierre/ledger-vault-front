// @flow

import React, { useState, useEffect, useRef } from "react";
import last from "lodash/last";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";

import type { Transaction as RippleTransaction } from "bridge/RippleBridge";
import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";

import FakeInputContainer from "components/base/FakeInputContainer";
import TranslatedError from "components/TriggerErrorNotification";
import DoubleTilde from "components/icons/DoubleTilde";
import Spinner from "components/base/Spinner";
import CounterValue from "components/CounterValue";
import connectData from "restlay/connectData";
import Box from "components/base/Box";
import NotApplicableText from "components/base/NotApplicableText";
import { Label, InputAmount } from "components/base/form";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { getFees } from "utils/transactions";

import colors from "shared/colors";
import RecalculateButton from "./RecalculateButton";

type Props = {
  transaction: RippleTransaction,
  account: Account,
  onChangeTransaction: RippleTransaction => void,
  bridge: WalletBridge<RippleTransaction>,
  restlay: RestlayEnvironment,
};

type FeesStatus = "idle" | "fetching" | "error";

function FeesFieldRippleKind(props: Props) {
  const instanceNonce = useRef(0);

  const { transaction, account, bridge, restlay, onChangeTransaction } = props;
  const currency = getCryptoCurrencyById(account.currency);
  const [feesStatus, setFeesStatus] = useState<FeesStatus>("idle");
  const [feesError, setFeesError] = useState(null);

  const effectDeps = [
    account,
    currency,
    restlay,
    bridge,
    transaction.recipient,
    transaction.amount,
  ];

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
      // check recipient
      const recipientError = await bridge.getRecipientError(
        restlay,
        currency,
        transaction.recipient,
        account,
      );
      if (nonce !== instanceNonce.current || unsubscribed) return;
      if (recipientError) {
        setFeesStatus("idle");
        return;
      }

      if (transaction.amount.isEqualTo(0)) return;

      setFeesStatus("fetching");

      // fetch fees
      const payload = {
        memos: [],
        amount: transaction.amount,
        recipient: transaction.recipient,
      };

      const estimatedFees = await getFees(account, payload, restlay);
      if (nonce !== instanceNonce.current || unsubscribed) return;

      // update tx
      onChangeTransaction({
        ...transaction,
        estimatedFees: estimatedFees.fees,
      });

      setFeesStatus("idle");
    } catch (err) {
      if (nonce !== instanceNonce.current || unsubscribed) return;
      console.error(err);
      setFeesStatus("error");
      setFeesError(err);
    }
  };
  useEffect(() => {
    let unsubscribed = false;
    effect(unsubscribed);
    return () => {
      unsubscribed = true;
    };
  }, effectDeps); // eslint-disable-line react-hooks/exhaustive-deps

  const onFeesChange = estimatedFees => {
    onChangeTransaction({ ...transaction, estimatedFees });
  };

  const reComputeFees = () => {
    onChangeTransaction({
      ...transaction,
      error: null,
      estimatedFees: BigNumber(0),
    });

    effect();
  };
  return (
    <Box horizontal flow={20}>
      <Box noShrink grow>
        <Box horizontal align="flex-start" flow={5}>
          <Label>
            <Trans i18nKey="transactionCreation:steps.account.fees.title" />
          </Label>
          {(transaction.estimatedFees || feesStatus === "error") && (
            <RecalculateButton onClick={reComputeFees} />
          )}
        </Box>
        <Box horizontal justify="space-between">
          <Box width={280}>
            <InputAmount
              width="100%"
              unitLeft
              hideCV
              initialUnit={last(currency.units)}
              currency={currency}
              placeholder={feesStatus === "fetching" ? "Loading..." : "0"}
              onChange={onFeesChange}
              value={transaction.estimatedFees || BigNumber(0)}
              disabled={feesStatus === "fetching"}
            />
          </Box>

          {feesStatus === "error" ? (
            <TranslatedError field="description" error={feesError} />
          ) : (
            <>
              <Box justify="center">
                <DoubleTilde size={14} color={colors.textLight} />
              </Box>
              <FakeInputContainer width={280}>
                {transaction.estimatedFees ? (
                  <CounterValue
                    smallerInnerMargin
                    value={transaction.estimatedFees}
                    from={account.currency}
                  />
                ) : feesStatus === "fetching" ? (
                  <Spinner />
                ) : (
                  <NotApplicableText />
                )}
              </FakeInputContainer>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default connectData(FeesFieldRippleKind);
