// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { FaHistory, FaMobileAlt } from "react-icons/fa";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import Button from "components/base/Button";
import Text from "components/base/Text";
import DeviceInteraction from "components/DeviceInteraction";
import { verifyAddressFlow } from "device/interactions/hsmFlows";
import InfoBox from "components/base/InfoBox";
import type { ConsolidateUTXOStepProps } from "./types";

const ICON_SIZE = 14;
const IconRetry = () => <FaHistory size={ICON_SIZE} />;
const IconBlue = () => <FaMobileAlt size={ICON_SIZE} />;

const VerifyAddressDeviceInteraction = (props: ConsolidateUTXOStepProps) => {
  const { goNext, account, updatePayload, freshAddress } = props;
  const [isVerifying, setVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const onDeviceInteractionSuccess = () => {
    setVerifying(false);
    updatePayload({ hasValidatedAddress: true }, goNext);
  };
  const onDeviceInteractionError = () => {
    setHasError(true);
    setVerifying(false);
  };

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
      {isVerifying ? (
        <DeviceInteraction
          interactions={verifyAddressFlow}
          noCheckVersion
          additionalFields={{
            accountId: account.id,
            fresh_address: freshAddress,
          }}
          onSuccess={onDeviceInteractionSuccess}
          onError={onDeviceInteractionError}
        />
      ) : (
        <Button type="filled" onClick={() => setVerifying(true)}>
          <Box horizontal flow={10} align="center" justify="center">
            {hasError ? <IconRetry /> : <IconBlue />}
            {hasError ? (
              <Text i18nKey="receive:verifyAgain" noWrap />
            ) : (
              <Text i18nKey="receive:verify" noWrap />
            )}
          </Box>
        </Button>
      )}
    </Container>
  );
};

const Container = styled(Box)`
  max-height: 50px;
  display: flex;
`;

export default VerifyAddressDeviceInteraction;
