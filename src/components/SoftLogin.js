// @flow

import React, { useState } from "react";

import VaultCentered from "components/VaultCentered";
import Card from "components/base/Card";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Button from "components/base/Button";
import DeviceInteraction from "components/DeviceInteraction";
import TranslatedError from "components/TranslatedError";
import { getConfidentialityPublicKey } from "device/interactions/common";
import InfoBox from "components/base/InfoBox";

// TODO this is only validating that the user has a device, but we
// are not sure if the attestation / endorsement is correct
const INTERACTIONS = [getConfidentialityPublicKey];

const SoftLogin = ({ children }: { children: React$Node }) => {
  const [isSoftLogged, setSoftLogged] = useState(false);
  const [isConnecting, setConnecting] = useState(false);
  const [error, setError] = useState<?Error>(null);

  if (isSoftLogged) return children;

  const handleClickConnect = () => setConnecting(true);
  const handleError = (err) => setError(err);
  const handleSuccess = () => setSoftLogged(true);
  const handleReset = () => {
    setSoftLogged(false);
    setConnecting(false);
    setError(null);
  };

  return (
    <VaultCentered>
      <Card
        width={540}
        style={styles.card}
        align="center"
        justify="center"
        flow={20}
      >
        {error ? (
          <DisplayError error={error} onReset={handleReset} />
        ) : (
          <>
            <Box style={{ textAlign: "center" }} width={300}>
              <div>
                In order to access onboarding, please connect a valid device and
                click <strong>Connect</strong>.
              </div>
            </Box>
            {isConnecting ? (
              <DeviceInteraction
                interactions={INTERACTIONS}
                onError={handleError}
                onSuccess={handleSuccess}
              />
            ) : (
              <Button type="filled" onClick={handleClickConnect}>
                Connect
              </Button>
            )}
          </>
        )}
      </Card>
    </VaultCentered>
  );
};

type DisplayErrorProps = {
  error: Error,
  onReset: () => any,
};

const DisplayError = ({ error, onReset }: DisplayErrorProps) => (
  <Box justify="center" align="center" flow={20} height={400}>
    <InfoBox type="error">
      <b>
        <TranslatedError error={error} />
      </b>
      <TranslatedError error={error} field="description" />
    </InfoBox>
    <Button type="filled" onClick={onReset}>
      <Text i18nKey="common:back" />
    </Button>
  </Box>
);

const styles = {
  card: { height: 300 },
};

export default SoftLogin;
