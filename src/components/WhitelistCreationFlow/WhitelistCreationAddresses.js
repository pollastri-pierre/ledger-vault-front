// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MdCancel } from "react-icons/md";

import Disabled from "components/Disabled";
import AddAddressForm from "components/AddAddressForm";
import InfoBox from "components/base/InfoBox";
import Button from "components/base/Button";
import Box from "components/base/Box";
import { getNumberOfAddressesChanged } from "utils/creationFlows";
import { MAX_EDIT } from "components/WhitelistCreationFlow";
import type { WhitelistCreationStepProps } from "./types";

const WhitelistCreationAddresses = (props: WhitelistCreationStepProps) => {
  const { payload, updatePayload, initialPayload, isEditMode } = props;
  const onChange = useCallback((addresses) => updatePayload({ addresses }), [
    updatePayload,
  ]);
  const { t } = useTranslation();
  const nbChanges = getNumberOfAddressesChanged(initialPayload, payload);
  const hasReachMax = nbChanges >= MAX_EDIT && isEditMode;

  return (
    <Box flow={20}>
      <Disabled disabled={hasReachMax}>
        <AddAddressForm addresses={payload.addresses} onChange={onChange} />
      </Disabled>
      <Box align="center" flow={20}>
        {hasReachMax && (
          <InfoBox type="warning" withIcon>
            {t("whitelists:update.more_than_max", { max: MAX_EDIT })}
          </InfoBox>
        )}
        {nbChanges > 0 && (
          <Button onClick={() => onChange(initialPayload.addresses)}>
            <Box horizontal flow={5} align="center">
              <MdCancel />
              <Box>{t("whitelists:update.reset_changes")}</Box>
            </Box>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default WhitelistCreationAddresses;
