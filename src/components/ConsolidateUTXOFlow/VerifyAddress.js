// @flow

import React from "react";
import noop from "lodash/noop";

import Box from "components/base/Box";
import Copy from "components/base/Copy";
import InfoBox from "components/base/InfoBox";
import { InputText, Label } from "components/base/form";
import type { ConsolidateUTXOStepProps } from "./types";

const VerifyAddress = ({ account, freshAddress }: ConsolidateUTXOStepProps) => {
  return (
    <Box flow={30}>
      <Box>
        <Label>Account to consolidate</Label>
        <InputText onChange={noop} disabled value={account.name} />
      </Box>
      <Box>
        <Label>Address</Label>
        <Copy grow text={freshAddress.address} />
      </Box>
      <Box>
        <InfoBox type="info" withIcon>
          UTXOs are always consolidated on the index 0 address of the account. Save this address in a safe location. You'll be required to verify it when completing the consolidation process.
        </InfoBox>
      </Box>
    </Box>
  );
};

export default VerifyAddress;
