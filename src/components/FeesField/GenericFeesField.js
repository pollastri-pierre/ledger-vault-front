// @flow

import React from "react";
import { BigNumber } from "bignumber.js";
import { useTranslation } from "react-i18next";

import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import { Switch, Label } from "components/base/form";
import TranslatedError from "components/TranslatedError";
import RecalculateButton from "components/FeesField/RecalculateButton";
import useFetchFees from "hooks/useFetchFees";

import type { RestlayEnvironment } from "restlay/connectData";
import type { FeesQueryResponse } from "api/queries/AccountCalculateFeeQuery";
import type { EditProps } from "bridge/types";

import FeesLevelChooser from "./FeesLevelChooser";
import DisplayFeesBanner from "./DisplayFeesBanner";

type Props<T, P> = {
  ...EditProps<T>,
  restlay: RestlayEnvironment,
  estimateFeesPayload: P,
  patchFromSuccess: (FeesQueryResponse, T) => $Shape<T>,
  patchFromError: (Error, T) => $Shape<T>,
  shouldFetchFees?: T => boolean,
  EditFees?: React$ComponentType<EditProps<T>>,
  DisplayFees?: React$ComponentType<{| transaction: T |}>,
};

const TransactionFeesLevel = <
  T: {
    amount: BigNumber,
    recipient: string,
    // tried to better type but.. failed
    fees: Object,
  },
  P,
>(
  props: Props<T, P>,
) => {
  const {
    bridge,
    restlay,
    account,
    transaction,
    onChangeTransaction,
    estimateFeesPayload,
    patchFromSuccess,
    patchFromError,
    shouldFetchFees,

    // optional custom fees edit & display
    EditFees,
    DisplayFees,
  } = props;

  const { t } = useTranslation();

  const { isFetching, refresh } = useFetchFees<T, P>({
    restlay,
    account,
    transaction,
    bridge,
    onChangeTransaction,
    estimateFeesPayload,
    patchFromSuccess,
    patchFromError,
    shouldFetchFees,
  });

  const error = bridge.getTransactionError(transaction);

  const isCustom = transaction.fees.fees_level === "custom";

  const handleToggleCustom = isCustom =>
    onChangeTransaction(
      bridge.editTransactionFeesLevel(
        transaction,
        isCustom ? "custom" : "normal",
      ),
    );

  const handleChangeFeesLevel = level =>
    onChangeTransaction(bridge.editTransactionFeesLevel(transaction, level));

  const feesHasBeenFetched = bridge.getEstimatedFees(transaction) !== null;

  return (
    <Box flow={8}>
      <Box horizontal justify="space-between">
        <Box horizontal align="center" flow={8}>
          <Label noPadding>
            {t("transactionCreation:steps.account.fees.title")}
          </Label>
          {feesHasBeenFetched && !isCustom && (
            <RecalculateButton disabled={isFetching} onClick={refresh} />
          )}
        </Box>
        {EditFees && (
          <Box horizontal align="center" flow={8}>
            <Label noPadding>
              {t("transactionCreation:steps.account.fees.custom")}
            </Label>
            <Switch value={isCustom} onChange={handleToggleCustom} />
          </Box>
        )}
      </Box>

      {isCustom && EditFees ? (
        <EditFees
          account={account}
          transaction={transaction}
          bridge={bridge}
          onChangeTransaction={onChangeTransaction}
        />
      ) : (
        <FeesLevelChooser
          // $FlowFixMe let's assume all transactions type have a `fees` field
          value={transaction.fees.fees_level}
          onChange={handleChangeFeesLevel}
        />
      )}

      {error ? (
        <InfoBox type="error">
          <strong>
            <TranslatedError error={error} />
          </strong>
          <TranslatedError error={error} field="description" />
        </InfoBox>
      ) : (
        <DisplayFeesBanner
          bridge={bridge}
          account={account}
          transaction={transaction}
          isFetching={isFetching}
          DisplayFees={DisplayFees}
        />
      )}
    </Box>
  );
};

export default TransactionFeesLevel;
