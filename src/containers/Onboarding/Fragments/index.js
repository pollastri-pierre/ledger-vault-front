// @flow

import React from "react";
import styled from "styled-components";

import Box from "components/base/Box";
import Text from "components/base/Text";
import DeviceInteraction from "components/DeviceInteraction";
import ValidateBadge from "components/icons/full/ValidateBadge";
import { ProfileIcon } from "components/Onboarding";

import type { GateError } from "data/types";
import type { Interaction } from "components/DeviceInteraction";

type Props = {
  loading?: boolean,
  disabled?: boolean,
  label: string,
  generated?: boolean,
  onSuccess: Object => void,
  onError: (Error | GateError | { statusCode: number }) => void,
  generate: number => void,
  additionalFields?: Object,
  interactions: Interaction[],
};
const Fragment = ({
  loading,
  disabled,
  label,
  generated,
  onSuccess,
  onError,
  generate,
  additionalFields,
  interactions,
}: Props) => (
  <FragmentContainer disabled={disabled} onClick={generate}>
    <ProfileIcon />
    {!loading && !generated && (
      <FragmentStatus className="fragment">{label}</FragmentStatus>
    )}
    {loading && (
      <Box>
        <DeviceInteraction
          onSuccess={onSuccess}
          interactions={interactions}
          onError={onError}
          additionalFields={additionalFields}
        />
      </Box>
    )}
    {generated && (
      <Box horizontal align="center" flow={5}>
        <ValidateBadge />
        <Text className="fragment">received</Text>
      </Box>
    )}
  </FragmentContainer>
);

export default Fragment;

const FragmentStatus = styled.div`
  text-transform: uppercase;
  cursor: pointer;
  text-align: center;
`;

const FragmentContainer = styled(Box).attrs({ align: "center" })`
  width: 150px;
  font-size: 11px;
  font-weight: 600;
  color: #27d0e2;
  opacity: ${p => (p.disabled ? "0.3" : "1")};
  pointer-events: ${p => (p.disabled ? "none" : "auto")};
`;