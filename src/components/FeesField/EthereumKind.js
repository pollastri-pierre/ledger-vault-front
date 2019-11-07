// @flow

import React, { PureComponent } from "react";
import last from "lodash/last";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";

import type { Transaction as EthereumTransaction } from "bridge/EthereumBridge";
import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";
import colors from "shared/colors";

import Spinner from "components/base/Spinner";
import TranslatedError from "components/TriggerErrorNotification";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import connectData from "restlay/connectData";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import { Label, InputAmount } from "components/base/form";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { getFees } from "utils/transactions";

type Props<Transaction> = {
  transaction: Transaction,
  account: Account,
  onChangeTransaction: Transaction => void,
  bridge: WalletBridge<Transaction>,
  restlay: RestlayEnvironment,
};

type Status = "idle" | "fetching";

type State = {
  status: Status,
  error: Error | null,
};

class FeesFieldEthereumKind extends PureComponent<
  Props<EthereumTransaction>,
  State,
> {
  componentDidMount() {
    const { transaction } = this.props;
    if (!transaction.gasPrice || !transaction.gasLimit) {
      this.loadGasPrice();
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  async componentDidUpdate(prevProps) {
    const { transaction } = this.props;
    if (prevProps.transaction.recipient !== transaction.recipient) {
      this.loadGasPrice();
    }
  }

  _unmounted = false;

  async loadGasPrice() {
    const {
      account,
      transaction,
      onChangeTransaction,
      bridge,
      restlay,
    } = this.props;
    this.setState({ status: "fetching" });
    const currency = getCryptoCurrencyById(account.currency);

    try {
      const recipientError = await bridge.getRecipientError(
        restlay,
        currency,
        transaction.recipient,
      );
      if (this._unmounted) return;
      if (recipientError) return;

      const txGetFees = {
        amount: transaction.amount,
        recipient: transaction.recipient,
        gas_price: transaction.gasPrice,
        gas_limit: transaction.gasLimit,
      };
      const estimatedFees = await getFees(account, txGetFees, restlay);
      if (this._unmounted) return;
      if (!estimatedFees) return;

      onChangeTransaction({
        ...transaction,
        estimatedFees: estimatedFees.fees,
        gasPrice: estimatedFees.gas_price,
        gasLimit: estimatedFees.gas_limit,
      });
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
      this.setState({ error: err });
      onChangeTransaction({
        ...transaction,
        estimatedFees: BigNumber(0),
        gasPrice: BigNumber(0),
        gasLimit: BigNumber(0),
      });
    } finally {
      this.setState({ status: "idle" });
    }
  }

  state = {
    status: "idle",
    error: null,
  };

  createMutation = (field: string) => (value: string) => {
    const { transaction, onChangeTransaction } = this.props;
    const patch = { ...transaction, [field]: BigNumber(value) };
    if (patch.gasPrice && patch.gasLimit) {
      patch.estimatedFees = patch.gasPrice.times(patch.gasLimit);
    }
    onChangeTransaction(patch);
  };

  onGasLimitChange = this.createMutation("gasLimit");

  onGasPriceChange = this.createMutation("gasPrice");

  render() {
    const { transaction, account } = this.props;
    const { status, error } = this.state;
    const currency = getCryptoCurrencyById(account.currency);

    // this is selecting gwei. to be double checked.
    const gasPriceUnit = currency.units[1];

    const erc20FeesExceedParentBalance =
      account.account_type === "Erc20" &&
      transaction.estimatedFees &&
      account.parent_balance &&
      transaction.estimatedFees.isGreaterThan(account.parent_balance);
    const shouldDisplayFeesField = !!(
      status === "fetching" ||
      transaction.estimatedFees ||
      error
    );

    return (
      <Box horizontal flow={20}>
        <Box flow={10}>
          <Box horizontal flow={20} align="flex-start">
            <Box width={175} noShrink>
              <Label>
                <Trans i18nKey="send:details.gasPrice" />
                {` (${gasPriceUnit.code})`}
              </Label>
              <InputAmount
                width={175}
                hideUnit
                hideCV
                unit={gasPriceUnit}
                currency={currency}
                placeholder={status === "fetching" ? "Loading..." : "0"}
                onChange={this.onGasPriceChange}
                value={transaction.gasPrice || BigNumber(0)}
                disabled={status === "fetching"}
              />
            </Box>
            <Box width={175} noShrink>
              <Label>
                <Trans i18nKey="send:details.gasLimit" />
              </Label>
              <InputAmount
                width={175}
                hideUnit
                hideCV
                unit={last(currency.units)}
                currency={currency}
                placeholder={status === "fetching" ? "Loading..." : "0"}
                onChange={this.onGasLimitChange}
                value={transaction.gasLimit || BigNumber(0)}
                disabled={status === "fetching"}
              />
            </Box>
          </Box>
          {erc20FeesExceedParentBalance ? (
            <InfoBox type="error">
              <Trans i18nKey="errors:ERC20FeesExceedParentAccountBalance.description" />
            </InfoBox>
          ) : (
            <InfoBox type="info">
              Transaction confirmation will be faster with higher fees
            </InfoBox>
          )}
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
              <Text size="small" uppercase>
                <CurrencyAccountValue
                  account={account}
                  value={transaction.estimatedFees}
                  disableERC20
                />
                {" ("}
                <CounterValue
                  smallerInnerMargin
                  value={transaction.estimatedFees}
                  from={account.currency}
                />
                {")"}
              </Text>
            )}
          </Box>
        )}
      </Box>
    );
  }
}

export default connectData(FeesFieldEthereumKind);
