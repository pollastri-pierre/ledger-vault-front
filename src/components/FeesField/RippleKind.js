// @flow

import React, { useState, useEffect } from "react";
import last from "lodash/last";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";

import type { Transaction as RippleTransaction } from "bridge/RippleBridge";
import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";

import Spinner from "components/base/Spinner";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import connectData from "restlay/connectData";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { Label, InputAmount } from "components/base/form";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { getFees } from "utils/transactions";

type Props = {
  transaction: RippleTransaction,
  account: Account,
  onChangeTransaction: RippleTransaction => void,
  bridge: WalletBridge<RippleTransaction>,
  restlay: RestlayEnvironment,
};

type FeesStatus = "idle" | "fetching" | "error";

function FeesFieldRippleKind(props: Props) {
  const { transaction, account, bridge, restlay, onChangeTransaction } = props;
  const currency = getCryptoCurrencyById(account.currency);
  const [feesStatus, setFeesStatus] = useState<FeesStatus>("idle");

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
      try {
        // check recipient
        const recipientError = await bridge.getRecipientError(
          restlay,
          currency,
          transaction.recipient,
        );
        if (unsubscribed) return;
        if (recipientError) {
          setFeesStatus("idle");
          return;
        }

        if (transaction.amount.isEqualTo(0)) return;

        setFeesStatus("fetching");

        // fetch fees
        const payload = {
          memos: [],
          send_to: [
            {
              address: transaction.recipient,
              amount: transaction.amount.toFixed(),
            },
          ],
        };

        const estimatedFees = await getFees(account, payload, restlay);
        if (unsubscribed) return;

        // update tx
        onChangeTransaction({
          ...transaction,
          estimatedFees: estimatedFees.fees,
        });

        setFeesStatus("idle");
      } catch (err) {
        console.error(err);
        setFeesStatus("error");
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

  const shouldDisplayFees =
    feesStatus === "fetching" ||
    transaction.estimatedFees ||
    feesStatus === "error";

  return (
    <Box horizontal flow={20}>
      <Box width={175} noShrink>
        <Label>
          <Trans i18nKey="send:details.fees.title" />
        </Label>
        <InputAmount
          unit={last(currency.units)}
          currency={currency}
          placeholder={feesStatus === "fetching" ? "Loading..." : "0"}
          onChange={onFeesChange}
          value={transaction.estimatedFees || BigNumber(0)}
          disabled={feesStatus === "fetching"}
        />
      </Box>

      {shouldDisplayFees && (
        <Box grow align="flex-end">
          <Label>
            <Trans i18nKey="transactionCreation:steps.amount.estimatedFees" />
          </Label>
          <Text small uppercase>
            {feesStatus === "fetching" ? (
              <Spinner />
            ) : transaction.estimatedFees ? (
              <>
                <CurrencyAccountValue
                  account={account}
                  value={transaction.estimatedFees}
                  disableERC20
                />
                {" ("}
                <CounterValue
                  value={transaction.estimatedFees}
                  from={account.currency}
                />
                {")"}
              </>
            ) : (
              "error"
            )}
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default connectData(FeesFieldRippleKind);
