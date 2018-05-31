//@flow
import React from "react";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "components/Onboarding";

import { withStyles } from "@material-ui/core/styles";
import { RequirementUnit } from "./Requirements";
import People from "components/icons/thin/People.js";
import Box from "components/icons/thin/Box";
import Briefcase from "components/icons/thin/Briefcase";

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
const Prerequisite = ({
  classes
}: {
  classes: { [$Keys<typeof styles>]: string }
}) => {
  return (
    <div>
      <Title>Prerequisite</Title>
      <Introduction>
        The following steps let you add administrators to your team.
        Administrators are privileged team members that can create accounts,
        spend funds and access metrics about your company.
      </Introduction>
      <div className={classes.requirements}>
        <div>
          <SubTitle>required</SubTitle>
          <div className={classes.flexcolumn}>
            <RequirementUnit icon={<Box style={{ height: 29 }} />}>
              <div style={{ width: 96 }}>Box of Ledger Blue devices</div>
            </RequirementUnit>
            <RequirementUnit
              icon={<People color="#cccccc" style={{ height: 29 }} />}
            >
              <div style={{ width: 93 }}>3+ team members</div>
            </RequirementUnit>
          </div>
        </div>
        <div className={classes.notrequired}>
          <SubTitle>Not required</SubTitle>
          <div className={classes.flexcolumn}>
            <RequirementUnit icon={<Briefcase style={{ height: 29 }} />}>
              <div style={{ width: 96 }}>Ledger Vault briefcase</div>
            </RequirementUnit>
            <RequirementUnit
              icon={<People color="#cccccc" style={{ height: 29 }} />}
              style={{ width: 76 }}
            >
              <div>Shared owners</div>
            </RequirementUnit>
          </div>
        </div>
      </div>
      <SubTitle>To Continue</SubTitle>
      <ToContinue>
        Gather all the teams members that will be allowed to connect and use
        your company’s Ledger Vault (do NOT ask shared owners to join at this
        moment). Give one Ledger Blue box to each team member and ask them to
        take possession of the devices and their recovery sheets.
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

export default withStyles(styles)(Prerequisite);
