// @flow
import React from "react";
import { Trans } from "react-i18next";
import InfoBox from "components/base/InfoBox";
import LineRow from "components/LineRow";
import Box from "components/base/Box";
import NotApplicableText from "components/base/NotApplicableText";
import Address from "components/Address";
import {
  hasEditOccuredWhitelist,
  onlyDescriptionChangedWhitelist,
} from "utils/creationFlows";
import type { Whitelist } from "data/types";
import type { WhitelistCreationStepProps } from "./types";

type Props = WhitelistCreationStepProps;

const WhitelistCreationConfirmation = (props: Props) => {
  const { payload, payloadToCompareTo } = props;
  return (
    <Box flow={20}>
      <WhitelistDetails whitelist={payload} />
      {!hasEditOccuredWhitelist(payload, payloadToCompareTo) ? (
        <InfoBox type="info" withIcon>
          <Trans i18nKey="whitelists:create.no_edit" />
        </InfoBox>
      ) : (
        onlyDescriptionChangedWhitelist(payload, payloadToCompareTo) && (
          <InfoBox type="info" withIcon>
            <Trans i18nKey="whitelists:create.no_hsm_validation" />
          </InfoBox>
        )
      )}
    </Box>
  );
};

export default WhitelistCreationConfirmation;

type WhitelistDetailsProps = {
  whitelist: $Shape<Whitelist>,
};

export const WhitelistDetails = (props: WhitelistDetailsProps) => {
  const { name, description, addresses } = props.whitelist;
  return (
    <Box>
      <LineRow label="name">{name}</LineRow>
      <LineRow label="description">
        {description || <NotApplicableText inline />}
      </LineRow>
      <LineRow label="addresses" vertical noOverflowHidden>
        <Box flow={20} pt={10}>
          {addresses
            .filter(a => a.name !== "" && a.address !== "")
            .map(addr => (
              <Address key={`${addr.name}-${addr.currency}`} address={addr} />
            ))}
        </Box>
      </LineRow>
    </Box>
  );
};
