// @flow

import React, { PureComponent } from "react";
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

import Spinner from "components/base/Spinner";
import TranslatedError from "components/TranslatedError";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import { Label } from "components/base/form";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import { getFees } from "utils/transactions";

import FeeSelect from "./FeeSelect";

type Status = "idle" | "fetching";

type State = {
  status: Status,
  error: Error | null,
};

type Props<BridgeTransaction> = {
  account: Account,
  onChangeTransaction: BridgeTransaction => void,
  restlay: RestlayEnvironment,
  transaction: BridgeTransaction,
  bridge: WalletBridge<BridgeTransaction>,
};

class FeesBitcoinKind extends PureComponent<Props<BitcoinLikeTx>, State> {
  nonce = 0;

  state = {
    status: "idle",
    error: null,
  };

  async fetchFees() {
    const {
      account,
      transaction,
      restlay,
      onChangeTransaction,
      bridge,
    } = this.props;

    this.setState({ error: null });
    if (transaction.amount.isEqualTo(0)) return null;
    const feeLevel =
      bridge.getTransactionFeeLevel &&
      bridge.getTransactionFeeLevel(account, transaction);
    const nonce = ++this.nonce;
    const currency = getCryptoCurrencyById(account.currency);
    const recipientError = await bridge.getRecipientError(
      restlay,
      currency,
      transaction.recipient,
    );
    if (nonce !== this.nonce) return;
    if (!recipientError) {
      this.setState({ status: "fetching" });
      try {
        const txGetFees = {
          fees_level: feeLevel || "normal",
          amount: transaction.amount,
          recipient: transaction.recipient || "",
        };
        const estimatedFees = await getFees(account, txGetFees, restlay);
        if (nonce !== this.nonce) return;
        onChangeTransaction({
          ...transaction,
          estimatedFees: estimatedFees.fees,
          estimatedMaxAmount: estimatedFees.max_amount,
        });
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
        this.setState({ error: err });
        if (nonce !== this.nonce) return;
        onChangeTransaction({
          ...transaction,
          estimatedFees: null,
          estimatedMaxAmount: null,
        });
      } finally {
        this.setState({ status: "idle" });
      }
    }
  }

  async componentDidUpdate(prevProps: Props<*>) {
    const { transaction } = this.props;
    const feesInvalidated =
      transaction.recipient !== prevProps.transaction.recipient ||
      !transaction.amount.isEqualTo(prevProps.transaction.amount) ||
      transaction.feeLevel !== prevProps.transaction.feeLevel;

    if (feesInvalidated) {
      await this.fetchFees();
    }
  }

  onChangeFee = (feesSelected: Speed) => {
    const { bridge, account, transaction, onChangeTransaction } = this.props;
    bridge.editTransactionFeeLevel &&
      onChangeTransaction(
        bridge.editTransactionFeeLevel(account, transaction, feesSelected),
      );
  };

  render() {
    const { account, transaction, bridge } = this.props;
    const { status, error } = this.state;
    const feeLevel =
      bridge.getTransactionFeeLevel &&
      bridge.getTransactionFeeLevel(account, transaction);
    const shouldDisplayFeesField = !!(
      status === "fetching" ||
      transaction.estimatedFees ||
      error
    );
    return (
      <Box horizontal flow={20}>
        <Box width={370} noShrink>
          <Label>
            <Trans i18nKey="send:details.fees.title" />
          </Label>
          <Box flow={10} align="flex-start">
            <Box width={240} noShrink>
              <Box width={240}>
                <FeeSelect
                  value={feeLevel || "normal"}
                  onChange={this.onChangeFee}
                />
                <Box
                  alignSelf="flex-end"
                  horizontal
                  flow={5}
                  color={colors.textLight}
                />
              </Box>
            </Box>
            <InfoBox type="info">
              <Trans i18nKey="transactionCreation:steps.amount.feesInfos" />
            </InfoBox>
          </Box>
        </Box>
        {shouldDisplayFeesField && (
          <Box grow align="flex-end">
            <Label>
              <Trans i18nKey="transactionCreation:steps.amount.estimatedFees" />
            </Label>
            {error ? (
              <Text color={colors.grenade}>
                <TranslatedError field="description" error={error} />
              </Text>
            ) : status === "fetching" ? (
              <Spinner />
            ) : (
              <Text small uppercase>
                <CurrencyAccountValue
                  account={account}
                  value={BigNumber(transaction.estimatedFees)}
                />
                <span>
                  {" ("}
                  <CounterValue
                    value={transaction.estimatedFees}
                    from={account.currency}
                  />
                  )
                </span>
              </Text>
            )}
          </Box>
        )}
      </Box>
    );
  }
}

export default connectData(FeesBitcoinKind);
