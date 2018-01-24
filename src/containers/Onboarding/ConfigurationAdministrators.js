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

const ConfigurationAdministrators = () => {
  return (
    <div>
      <Title>Configuration</Title>
      <Introduction>
        To be able to connect and use the Vault, each administrator needs to
        configure his/her Ledger Blue by following those 3 steps:
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
          Make sure to keep your recovery sheet in a safe place. Keep your
          device with you, it will be required at the next step.
        </ListItem>
      </List>
      <SubTitle>to Continue</SubTitle>
      <ToContinue>
        Make sure all administrators have configured their Ledger Blue and that
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

export default ConfigurationAdministrators;
