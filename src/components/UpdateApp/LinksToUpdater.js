// @flow
import React from "react";
import styled from "styled-components";
import { DiApple, DiWindows, DiLinux } from "react-icons/di";
import { Trans } from "react-i18next";
import colors from "shared/colors";
import VaultCentered from "components/VaultCentered";
import Card from "components/base/Card";
import { urls } from "utils/urls";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";

const Update = () => (
  <VaultCentered>
    <Card flow={20} width={600}>
      <Text uppercase i18nKey="update:title" />
      <InfoBox type="info" withIcon>
        <Trans i18nKey="update:infobox" />
      </InfoBox>
      <Box target="_blank" horizontal align="center" justify="center" flow={10}>
        <Link href={urls.ledger_updater_mac}>
          <DiApple style={{ marginRight: 5 }} />
          Download for Mac
        </Link>
        <Link target="_blank" href={urls.ledger_updater_windows}>
          <DiWindows style={{ marginRight: 5 }} />
          Download for Windows
        </Link>
        <Link target="_blank" href={urls.ledger_updater_linux}>
          <DiLinux style={{ marginRight: 5 }} />
          Download for Linux
        </Link>
      </Box>
      <Box horizontal align="center" justify="space-between" flow={20}>
        <Support target="_blank" href={urls.help_updater}>
          <Trans i18nKey="update:help" />
        </Support>
        <Support target="_blank" href={urls.customer_support}>
          <Trans i18nKey="update:support" />
        </Support>
      </Box>
    </Card>
  </VaultCentered>
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
