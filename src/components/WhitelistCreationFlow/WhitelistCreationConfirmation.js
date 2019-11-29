// @flow
import React from "react";
import { Trans } from "react-i18next";
import InfoBox from "components/base/InfoBox";
import LineRow from "components/LineRow";
import Box from "components/base/Box";
import AccountIcon from "components/legacy/AccountIcon";
import Text from "components/base/Text";
import NotApplicableText from "components/base/NotApplicableText";
import colors from "shared/colors";
import {
  hasEditOccuredWhitelist,
  onlyDescriptionChangedWhitelist,
} from "utils/creationFlows";
import type { Whitelist } from "data/types";
import type { WhitelistCreationStepProps } from "./types";

type Props = WhitelistCreationStepProps;

const WhitelistCreationConfirmation = (props: Props) => {
  const { payload, initialPayload } = props;
  return (
    <Box flow={20}>
      <WhitelistDetails whitelist={payload} />
      {!hasEditOccuredWhitelist(payload, initialPayload) ? (
        <InfoBox type="info" withIcon>
          <Trans i18nKey="whitelists:create.no_edit" />
        </InfoBox>
      ) : (
        onlyDescriptionChangedWhitelist(payload, initialPayload) && (
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
              <Box
                horizontal
                flow={20}
                align="center"
                justify="space-between"
                key={addr.id}
              >
                <Box horizontal flow={10}>
                  {addr.currency && <AccountIcon currencyId={addr.currency} />}
                  <Text size="small" uppercase color={colors.shark}>
                    {addr.name}
                  </Text>
                </Box>
                <Text>{addr.address}</Text>
              </Box>
            ))}
        </Box>
      </LineRow>
    </Box>
  );
};
