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
import Text from "components/base/Text";
import { Label, InputAmount } from "components/base/form";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { getFees } from "utils/transactions";

import colors from "shared/colors";

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

  useEffect(() => {
    let unsubscribed = false;
    const effect = async () => {
      const nonce = ++instanceNonce.current;

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
        console.error(err);
        setFeesStatus("error");
        setFeesError(err);
      }
    };
    effect();
    return () => {
      unsubscribed = true;
    };
  }, effectDeps); // eslint-disable-line react-hooks/exhaustive-deps

  const onFeesChange = estimatedFees => {
    onChangeTransaction({ ...transaction, estimatedFees });
  };

  return (
    <Box horizontal flow={20}>
      <Box noShrink grow>
        <Label>
          <Trans i18nKey="transactionCreation:steps.account.fees.title" />
        </Label>
        <Box horizontal justify="space-between">
          <Box width={280}>
            <InputAmount
              width="100%"
              unitLeft
              hideCV
              unit={last(currency.units)}
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
                  <Text
                    color={colors.textLight}
                    i18nKey="common:not_applicable"
                  />
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
