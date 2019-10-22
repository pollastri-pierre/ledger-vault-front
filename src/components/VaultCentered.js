// @flow

import React from "react";

import Box from "components/base/Box";
import Logo from "components/icons/Logo";
import HelpLink from "components/HelpLink";
import Text from "components/base/Text";
import CenteredLayout from "components/base/CenteredLayout";

export default function VaultCentered({ children }: { children: React$Node }) {
  return (
    <CenteredLayout>
      <div width={540}>
        <LogoRow />
        {children}
      </div>
      <Box align="center" mt={40}>
        <Text size="small">Vault - v{VAULT_FRONT_VERSION}</Text>
      </Box>
    </CenteredLayout>
  );
}

const LogoRow = () => (
  <Box horizontal justify="space-between" align="center" mb={10} width={520}>
    <Logo width={120} />
    <HelpLink
      style={styles.help}
      role="OPERATOR"
      subLink="/Content/overview/signin.htm"
    >
      <Text size="small" uppercase i18nKey="welcome:help" />
    </HelpLink>
  </Box>
);

const styles = {
  help: {
    cursor: "pointer",
    opacity: "0.5",
    textDecoration: "none",
    transition: "opacity 0.2s ease",
  },
};
