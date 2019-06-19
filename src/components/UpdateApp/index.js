// @flow

import React from "react";
import styled from "styled-components";
import { FaCloudDownloadAlt } from "react-icons/fa";

import { Trans } from "react-i18next";
import colors from "shared/colors";
import { urls } from "utils/urls";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";

const Update = () => (
  <Box p={30} flow={20} width={500}>
    <Text uppercase i18nKey="update:title"></Text>
    <InfoBox type="error" withIcon>
      <Trans i18nKey="update:infobox" />
    </InfoBox>
    <Box horizontal align="center" justify="space-between" flow={20}>
      <Support href={urls.customer_support}>
        <Trans i18nKey="update:support" />
      </Support>
      <Link href={urls.ledger_updater}>
        <FaCloudDownloadAlt style={{ marginRight: 5 }} color="white" />
        <Trans i18nKey="update:link-updater" />
      </Link>
    </Box>
  </Box>
);

export default Update;

const Support = styled.a`
  color: ${colors.black};
  text-decoration: underline;
  cursor: pointer;
`;
const Link = styled.a`
  display: flex;
  align-items: center;
  padding: 6px;
  border: 1px solid ${colors.ocean}
  border-radius: 4px;
  color: white;
  background: ${colors.ocean};
`;
