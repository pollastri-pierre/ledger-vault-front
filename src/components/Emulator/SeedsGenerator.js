// @flow

import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import Modal, { RichModalHeader } from "components/base/Modal";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Form from "components/base/form/Form";
import Button from "components/base/Button";
import InputText from "components/base/form/inputs/InputText";
import Label from "components/base/form/Label";
import { generateWorkspaceSeeds } from "device/generator";
import Switch from "components/base/form/Switch";
import { useEmulatorState, useEmulatorDispatch } from "./EmulatorContext";

const SeedsGenerator = () => {
  const { isSeedsGeneratorOpened } = useEmulatorState();
  const dispatch = useEmulatorDispatch();
  const [salt, setSalt] = useState("");
  const [onboardingSeeds, setOnboardingSeeds] = useState(false);
  const handleClose = () => dispatch({ type: "CLOSE_SEEDS_GENERATOR" });
  const handleSubmit = () => {
    const seeds = generateWorkspaceSeeds(salt, onboardingSeeds);
    dispatch({ type: "GENERATE_SEEDS", payload: seeds });
    handleClose();
  };

  return (
    <Modal isOpened={isSeedsGeneratorOpened} onClose={handleClose} zIndex={301}>
      <RichModalHeader
        Icon={FaList}
        title="Generate bunch of seeds"
        onClose={handleClose}
      />
      <Box p={40} pt={20} width={500}>
        <Form onSubmit={handleSubmit}>
          <Box flow={20}>
            <Box>
              <Label>Salt</Label>
              <InputText
                placeholder="Enter a string"
                value={salt}
                onChange={setSalt}
                autoFocus
              />
            </Box>
            <Box horizontal flow={8}>
              <Label>Generate onboarding seeds</Label>
              <Switch
                onChange={() => setOnboardingSeeds(!onboardingSeeds)}
                value={onboardingSeeds}
              />
            </Box>
            <InfoBox type="info">
              Enter a string that will be used to generated seeds for your
              workspace.
            </InfoBox>
            <Box align="flex-end">
              <Button
                type="filled"
                onClick={handleSubmit}
                disabled={salt === ""}
              >
                Go
              </Button>
            </Box>
          </Box>
        </Form>
      </Box>
    </Modal>
  );
};
export default SeedsGenerator;
