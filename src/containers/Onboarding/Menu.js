//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import LabelLink from "components/LabelLink";
import MenuLinkOnboarding from "./MenuLinkOnboarding";

const styles = {
  menu: {
    flex: 0.6,
    width: 161,
    position: "relative",
    "&:after": {
      content: '""',
      background: "#eeeeee",
      width: 1,
      height: 436,
      display: "block",
      position: "absolute",
      right: 42,
      top: 0
    }
  }
};
const Menu = ({
  classes,
  nbMember,
  onboarding
}: {
  classes: { [$Keys<typeof styles>]: string },
  onboarding: Object,
  nbMember: number
}) => {
  return (
    <div className={classes.menu}>
      <MenuLinkOnboarding step={0} allowed={onboarding.currentStep < 2} heading>
        <span style={{ textTransform: "uppercase" }}>welcome</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={1} allowed={false} heading>
        <span style={{ textTransform: "uppercase" }}>authentication</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 10, marginBottom: 7 }}>
        <LabelLink
          label="administrators"
          selected={[2, 3, 4, 5, 6].indexOf(onboarding.currentStep) > -1}
        />
      </div>
      <MenuLinkOnboarding step={2} allowed={false}>
        <span>Prerequisite</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={3} allowed={false}>
        <span>Configuration</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={4} allowed={false}>
        <span>Registration ({nbMember})</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={5} allowed={false}>
        <span>Administration scheme</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={6} allowed={false}>
        <span>Confirmation</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 20 }}>
        <LabelLink
          label="master seed"
          selected={[7, 8, 9, 10, 11].indexOf(onboarding.currentStep) > -1}
        />
      </div>
      <MenuLinkOnboarding step={7}>
        <span>Sign-in</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={8}>
        <span>Prerequisite</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={9}>
        <span>Configuration</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={10}>
        <span>Backup</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={11}>
        <span>Provisioning</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 5 }}>
        <MenuLinkOnboarding step={12}>
          <span style={{ textTransform: "uppercase" }}>confirmation</span>
        </MenuLinkOnboarding>
      </div>
    </div>
  );
};

export default withStyles(styles)(Menu);
