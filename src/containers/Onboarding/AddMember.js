// @flow
import React, { useState } from "react";
import styled from "styled-components";

import Button from "components/base/Button";
import InputField from "components/InputField";
import colors from "shared/colors";
import DeviceInteraction from "components/DeviceInteraction";
import { onboardingRegisterFlow } from "device/interactions/hsmFlows";
import ProfileIcon from "components/icons/thin/Profile";
import Box from "components/base/Box";
import Text from "components/base/Text";
import type { Organization } from "data/types";

type Props = {
  close: Function,
  finish: Function,
  organization: Organization,
};

const AddMember = ({ close, finish, organization }: Props) => {
  const [username, setUsername] = useState("");
  const [registering, setRegistering] = useState("");

  const onSuccess = data => {
    setRegistering(false);
    finish({ ...data.register_input, username });
  };

  const onError = () => {
    setRegistering(false);
    close();
  };

  return (
    <Box p={40} pb={20} flow={20} width={500}>
      <Text large>Add new admin</Text>
      <Box horizontal flow={30} mt={80} align="center">
        <ProfileIconContainer>
          <ProfileIcon color="white" />
        </ProfileIconContainer>
        <Box flow={20}>
          <InputField
            placeholder="Username"
            name="username"
            maxLength={19}
            onlyAscii
            value={username}
            onChange={setUsername}
          />
        </Box>
      </Box>
      <Box horizontal justify="flex-end" pt={20}>
        {registering ? (
          <DeviceInteraction
            onSuccess={onSuccess}
            interactions={onboardingRegisterFlow}
            onError={onError}
            additionalFields={{
              organization,
              role: "admin",
            }}
          />
        ) : (
          <Button
            type="submit"
            disabled={!username}
            variant="outlined"
            data-test="dialog-button"
            onClick={() => setRegistering(!registering)}
          >
            Continue
          </Button>
        )}
      </Box>
    </Box>
  );
};

const ProfileIconContainer = styled(Box).attrs({
  align: "center",
  justify: "center",
})`
  width: 80px;
  height: 80px;
  background-color: ${colors.argile};
  border-radius: 50%;
`;

export default AddMember;
