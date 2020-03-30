// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
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

  const isValidTx = bridge.checkValidTransactionSync(account, transaction);
  const transactionPayload = serializePayload({
    transaction,
    account,
  });
  return (
    <Container flow={20} horizontal align="center">
      {hasError && (
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
      )}
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
