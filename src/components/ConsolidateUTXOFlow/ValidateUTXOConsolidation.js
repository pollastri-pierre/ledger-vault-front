// @flow

import React, { useState, useMemo } from "react";
import invariant from "invariant";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import styled from "styled-components";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import { getMatchingRulesSet } from "utils/multiRules";
import { createAndApprove } from "device/interactions/hsmFlows";
import ApproveRequestButton from "components/ApproveRequestButton";
import { serializePayload } from "components/TransactionCreationFlow";
import InfoBox from "components/base/InfoBox";
import type { ConsolidateUTXOStepProps } from "./types";

const ValidateUTXOConsolidation = (props: ConsolidateUTXOStepProps) => {
  const { goNext, account, bridge, payload } = props;
  const { transaction } = payload;
  const [hasError, setHasError] = useState(false);

  const onDeviceInteractionError = () => {
    setHasError(true);
  };

  const currency = useMemo(() => getCryptoCurrencyById(account.currency), [
    account.currency,
  ]);

  const { governance_rules } = account;
  invariant(governance_rules, "No governance rules in account");

  const matchingRulesSet = getMatchingRulesSet({
    transaction: {
      currency: currency.id,
      amount: transaction.amount,
      recipient: transaction.recipient,
    },
    governanceRules: governance_rules,
  });

  const isValidTx =
    bridge.checkValidTransactionSync(account, transaction) &&
    !!matchingRulesSet;

  const showMatchingRulesSet =
    transaction.amount &&
    transaction.amount.isGreaterThan(0) &&
    transaction.recipient;

  const transactionPayload = serializePayload({
    transaction,
    account,
  });

  return (
    <Container flow={20} horizontal align="center">
      {hasError ? (
        <InfoBox type="error" alignCenter>
          <div>
            <Trans i18nKey="receive:addressRejected_line1" />
            <br />
            <Trans
              i18nKey="receive:addressRejected_line2"
              components={<strong>0</strong>}
            />
          </div>
        </InfoBox>
      ) : showMatchingRulesSet && !matchingRulesSet ? (
        <InfoBox type="error" alignCenter>
          {"No rules matched for this amount & recipient"}
        </InfoBox>
      ) : null}
      <ApproveRequestButton
        interactions={createAndApprove("TRANSACTION")}
        onError={onDeviceInteractionError}
        onSuccess={goNext}
        disabled={!isValidTx}
        additionalFields={{
          type: "CREATE_TRANSACTION",
          targetType: "CREATE_TRANSACTION",
          data: transactionPayload,
        }}
        buttonLabel={<Trans i18nKey="transactionCreation:cta" />}
      />
    </Container>
  );
};

const Container = styled(Box)`
  max-height: 50px;
  display: flex;
`;

export default ValidateUTXOConsolidation;
