// @flow
import React from "react";
import Box from "components/base/Box";
import { GoFileCode } from "react-icons/go";
import colors from "shared/colors";
import { RichModalHeader } from "components/base/Modal";
import styled from "styled-components";
import { useVersions } from "components/VersionsContext";

const Versions = ({ onClose }: { onClose: void => void }) => {
  const { versions } = useVersions();
  if (!versions) return null;
  return (
    <>
      <RichModalHeader Icon={GoFileCode} title="Versions" onClose={onClose} />
      <Container>
        <VersionContainer>
          <VersionLine>
            <Component>Front</Component>
            <ComponentVersion>v{VAULT_FRONT_VERSION}</ComponentVersion>
          </VersionLine>
          <VersionLine>
            <Component>ledger-vault-api</Component>
            <ComponentVersion>{versions.commit_hash}</ComponentVersion>
          </VersionLine>
          <VersionLine>
            <Component>ledger-hsm-driver</Component>
            <ComponentVersion>
              {versions.dependencies.hsm_driver.commit_hash}
            </ComponentVersion>
          </VersionLine>
          <VersionLine>
            <Component>ledger-wallet-daemon</Component>
            <ComponentVersion>
              {versions.dependencies.wallet_daemon.commit_hash}
            </ComponentVersion>
          </VersionLine>
          <VersionLine>
            <Component>libcore</Component>
            <ComponentVersion>
              {versions.dependencies.wallet_daemon.libcore}
            </ComponentVersion>
          </VersionLine>
          <>
            {Object.keys(versions.dependencies.hsm_driver.currencies).map(k => (
              <VersionLine key={k}>
                <Component>{k}</Component>
                <ComponentVersion>
                  {versions.dependencies.hsm_driver.currencies[k]}
                </ComponentVersion>
              </VersionLine>
            ))}
          </>
        </VersionContainer>
      </Container>
    </>
  );
};

const Container = styled(Box).attrs({
  flow: 20,
  width: 800,
  p: 40,
})`
  background: white;
`;
const VersionContainer = styled(Box).attrs({
  flow: 10,
  p: 20,
  justify: "center",
})`
  background: ${colors.legacyLightGrey5};
  border-radius: 5px;
  min-height: 300px;
  border: 1px solid ${colors.lightGrey};
`;

const Component = styled.div`
  font-weight: bold;
`;
const ComponentVersion = styled.div`
  font-family: monospace;
  font-size: 12px;
`;

const VersionLine = styled(Box).attrs({
  horizontal: true,
  align: "center",
  justify: "space-between",
})`
  border-bottom: 1px solid #e8e8e8;
  &:last-child {
    border: none;
  }
`;

export default Versions;
