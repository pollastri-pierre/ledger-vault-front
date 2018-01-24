//@flow
import Footer from "./Footer";
import DialogButton from "components/buttons/DialogButton";
import React, { Component } from "react";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "components/Onboarding";
import { viewRoute } from "redux/modules/onboarding.js";
import Requirements from "./Requirements.js";

class Welcome extends Component {
  render() {
    return (
      <div>
        <Title>Welcome</Title>
        <Introduction>
          It looks like your team is using Ledger Vault for the first time.
          Please make sure you have received the Ledger Vault briefcase as well
          as the package containing all the Ledger Blue devices for your team
          members.
        </Introduction>
        <SubTitle>Requirements</SubTitle>
        <Requirements />
        <SubTitle>To continue</SubTitle>
        <ToContinue>
          When ready, open the Ledger Vault briefcase and grab the one-time
          authenticator device in the front pocket. It will be used to
          authenticate during the next step.
        </ToContinue>
        <Footer
          isBack={false}
          render={(onPrev, onNext) => (
            <DialogButton highlight onTouchTap={onNext}>
              Continue
            </DialogButton>
          )}
        />
      </div>
    );
  }
}

export default Welcome;
