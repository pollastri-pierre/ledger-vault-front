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
        <Box align="center" mt={40}>
          <Text small>Vault - v{VAULT_FRONT_VERSION}</Text>
        </Box>
      </div>
    </CenteredLayout>
  );
}

const LogoRow = () => (
  <Box horizontal justify="space-between" align="center" mb={10} width={520}>
    <Logo width={100} />
    <HelpLink style={styles.help} subLink="/Content/transactions/signin.htm">
      <Text small uppercase i18nKey="welcome:help" />
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
