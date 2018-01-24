import React from "react";
import {
  Title,
  SubTitle,
  List,
  ListItem,
  ToContinue,
  Introduction
} from "../../components/Onboarding.js";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";

const ConfigurationSeed = () => {
  return (
    <div>
      <Title>Configuration</Title>
      <Introduction>
        <strong>
          Ask shared owners to configure their Ledger Blue devices by following
          those steps:
        </strong>
      </Introduction>
      <List>
        <ListItem number={1}>
          Open the Ledger Blue sealed box that was given to you. Grab the device
          and its red recovery sheet.
        </ListItem>
        <ListItem number={2}>
          Follow this online tutorial to initialize your device: <br />
          <a href="#">configure my device</a>
        </ListItem>
        <ListItem number={3}>
          Your device is now configured. Keep your recovery sheet with you, it
          is required at the next step.
        </ListItem>
      </List>
      <SubTitle>to Continue</SubTitle>
      <ToContinue>
        Make sure all shared owners have configured their Ledger Blue and that
        all device’s recovery phrases are written down in their respective
        recovery sheets.
      </ToContinue>
      <Footer
        render={(onPrev, onNext) => (
          <DialogButton highlight onTouchTap={onNext}>
            Continue
          </DialogButton>
        )}
      />
    </div>
  );
};

export default ConfigurationSeed;
