// @flow

import React, { useState, useEffect, useRef } from "react";
import last from "lodash/last";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";

import type { Transaction as EthereumTransaction } from "bridge/EthereumBridge";
import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";
import colors from "shared/colors";
import { FaTimes } from "react-icons/fa";

import Spinner from "components/base/Spinner";
import TranslatedError from "components/TriggerErrorNotification";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import connectData from "restlay/connectData";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import FakeInputContainer from "components/base/FakeInputContainer";
import { Label, InputAmount } from "components/base/form";
import DoubleTilde from "components/icons/DoubleTilde";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { getFees } from "utils/transactions";
import { usePrevious } from "utils/customHooks";

type Props = {
  transaction: EthereumTransaction,
  account: Account,
  onChangeTransaction: EthereumTransaction => void,
  bridge: WalletBridge<EthereumTransaction>,
  restlay: RestlayEnvironment,
};

type FeesStatus = "idle" | "fetching" | "error";

function FeesFieldEthereumKind(props: Props) {
  const instanceNonce = useRef(0);

  const { transaction, account, bridge, restlay, onChangeTransaction } = props;
  const currency = getCryptoCurrencyById(account.currency);
  const prevRecipient = usePrevious(transaction.recipient);

  const gasPriceUnit = currency.units[1];

  const erc20FeesExceedParentBalance =
    account.account_type === "Erc20" &&
    transaction.estimatedFees &&
    account.parent_balance &&
    transaction.estimatedFees.isGreaterThan(account.parent_balance);

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
          amount: transaction.amount,
          recipient: transaction.recipient,
          gas_price: transaction.gasPrice,
          gas_limit: transaction.gasLimit,
        };
        const estimatedFees = await getFees(account, txGetFees, restlay);

        if (nonce !== instanceNonce.current || unsubscribed) return;

        onChangeTransaction({
          ...transaction,
          estimatedFees: estimatedFees.fees,
          gasPrice: estimatedFees.gas_price,
          gasLimit: estimatedFees.gas_limit,
        });

        setFeesStatus("idle");
      } catch (err) {
        console.error(err);
        onChangeTransaction({
          ...transaction,
          estimatedFees: BigNumber(0),
          gasPrice: BigNumber(0),
          gasLimit: BigNumber(0),
        });
        setFeesError(err);

        setFeesStatus("error");
      }
    };
    if (prevRecipient !== transaction.recipient) {
      effect();
    }
    return () => {
      unsubscribed = true;
    };
  }, effectDeps); // eslint-disable-line react-hooks/exhaustive-deps

  const createMutation = (field: string) => (value: string) => {
    const patch = { ...transaction, [field]: BigNumber(value) };
    if (patch.gasPrice && patch.gasLimit) {
      patch.estimatedFees = patch.gasPrice.times(patch.gasLimit);
    }
    onChangeTransaction(patch);
  };

  const onGasLimitChange = createMutation("gasLimit");

  const onGasPriceChange = createMutation("gasPrice");

  return (
    <Box flow={20}>
      <Box flow={10}>
        <Label noPadding>
          <Trans i18nKey="transactionCreation:steps.account.transactionFees" />
        </Label>
        <Box horizontal flow={20} justify="space-between">
          <Box noShrink width={280}>
            <Label>
              <Trans i18nKey="transactionCreation:steps.account.gasPrice" />
              {` (${gasPriceUnit.code})`}
            </Label>
            {feesStatus === "fetching" ? (
              <FakeInputContainer width={280}>
                <Box>
                  <Spinner />
                </Box>
              </FakeInputContainer>
            ) : (
              <InputAmount
                width="100%"
                hideUnit
                hideCV
                unit={gasPriceUnit}
                currency={currency}
                placeholder={feesStatus === "fetching" ? "Loading..." : "0"}
                onChange={onGasPriceChange}
                value={transaction.gasPrice || BigNumber(0)}
                disabled={status === "fetching"}
              />
            )}
          </Box>
          <Box justify="center" mt={30}>
            <FaTimes color={colors.textLight} />
          </Box>
          <Box noShrink width={280}>
            <Label>
              <Trans i18nKey="transactionCreation:steps.account.gasLimit" />
            </Label>
            {feesStatus === "fetching" ? (
              <FakeInputContainer width={280}>
                <Spinner />
              </FakeInputContainer>
            ) : (
              <InputAmount
                hideUnit
                unitLeft
                unitsWidth={80}
                width="100%"
                hideCV
                unit={last(currency.units)}
                currency={currency}
                placeholder={status === "fetching" ? "Loading..." : "0"}
                onChange={onGasLimitChange}
                value={transaction.gasLimit || BigNumber(0)}
                disabled={status === "fetching"}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box grow>
        <Label>
          <Trans i18nKey="transactionCreation:steps.account.fees.title" />
        </Label>
        {feesStatus === "error" ? (
          <Text color={colors.grenade}>
            <TranslatedError field="description" error={feesError} />
          </Text>
        ) : (
          <Box horizontal flow={15} justify="space-between">
            <FakeInputContainer width={280}>
              {transaction.estimatedFees ? (
                <CurrencyAccountValue
                  account={account}
                  value={transaction.estimatedFees}
                  disableERC20
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
          </Box>
        )}
      </Box>
      {erc20FeesExceedParentBalance ? (
        <InfoBox type="error">
          <Trans i18nKey="errors:ERC20FeesExceedParentAccountBalance.description" />
        </InfoBox>
      ) : (
        <InfoBox type="info">
          <Trans i18nKey="transactionCreation:steps.account.feesInfos" />
        </InfoBox>
      )}
    </Box>
  );
}

export default connectData(FeesFieldEthereumKind);
