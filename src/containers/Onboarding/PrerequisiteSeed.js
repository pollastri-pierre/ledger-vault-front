import React from "react";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";

import { withStyles } from "material-ui/styles";
import { Requirement } from "./Requirements";
import People from "components/icons/thin/People.js";
import Box from "components/icons/thin/Box.js";
import Briefcase from "components/icons/thin/Briefcase.js";

const styles = {
  requirements: {
    display: "flex",
    fontSize: 11,
    lineHeight: 1.82,
    justifyContent: "space-between",
    marginBottom: 40
  },
  notrequired: {
    opacity: 0.5,
    position: "relative",
    "&:before": {
      content: '""',
      position: "absolute",
      width: 1,
      height: 80,
      background: "#eeeeee",
      left: -50,
      top: 30
    }
  },
  flexcolumn: {
    display: "flex"
  }
};
const PrerequisiteSeed = ({ classes }: { [$keys<typeof styles>]: string }) => {
  return (
    <div>
      <Title>Prerequisite</Title>
      <Introduction>
        These final steps will generate your company’s master seed that is
        shared among 3 owners. It is a critical piece of information from which
        all your accounts will be created. Shared owners are not team members
        and will not be able to access the Ledger Vault.
      </Introduction>
      <div className={classes.requirements}>
        <div className={classes.required}>
          <SubTitle>required</SubTitle>
          <div className={classes.flexcolumn}>
            <Requirement icon={<Briefcase style={{ height: 29 }} />}>
              Ledger Vault Briefcase
            </Requirement>
            <Requirement
              icon={<People color="#cccccc" style={{ height: 29 }} />}
              style={{ width: 76 }}
            >
              3 shared owners
            </Requirement>
          </div>
        </div>
        <div className={classes.notrequired}>
          <SubTitle>Not required</SubTitle>
          <div className={classes.flexcolumn}>
            <Requirement icon={<Box style={{ height: 29 }} />}>
              Box of Ledger Blue devices
            </Requirement>
            <Requirement
              icon={<People color="#cccccc" style={{ height: 29 }} />}
              style={{ width: 76 }}
            >
              Team members
            </Requirement>
          </div>
        </div>
      </div>
      <SubTitle>To Continue</SubTitle>
      <ToContinue>
        Gather all 3 shared owners that will be part of the master seed
        provisionning. Give one Ledger Blue box and one Ledger Cryptosteel to
        each shared owner and ask them to take possession of the devices and
        their recovery sheets.
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
};

export default withStyles(styles)(PrerequisiteSeed);
