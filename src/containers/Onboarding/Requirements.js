//@flow
import React from "react";
import { withStyles } from "material-ui/styles";
import People from "../../components/icons/thin/People";
import Plug from "../../components/icons/thin/Plug";
import Briefcase from "components/icons/thin/Briefcase";
import Box from "components/icons/thin/Box";

const styles = {
  base: {
    display: "flex",
    marginBottom: 40,
    fontSize: 11,
    lineHeight: 1.82
  }
};

const requirement = {
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    maxWidth: 93
  },
  icon: {
    marginBottom: 10
  }
};
export const Requirement = withStyles(
  requirement
)(
  ({
    classes,
    icon,
    children,
    ...props
  }: {
    classes: { [$Keys<typeof requirement>]: string },
    icon: React$Component,
    children: React$Node
  }) => {
    return (
      <div className={classes.base} {...props}>
        <div className={classes.icon}>{icon}</div>
        <div>{children}</div>
      </div>
    );
  }
);
const Requirements = ({
  classes
}: {
  classes: { [$Keys<typeof styles>]: string }
}) => (
  <div className={classes.base}>
    <Requirement icon={<Briefcase style={{ height: 29 }} />}>
      Ledger Vault briefcase
    </Requirement>
    <Requirement icon={<Box style={{ height: 26 }} />}>
      Box of Ledger Blue devices
    </Requirement>
    <Requirement icon={<Plug color="#cccccc" style={{ height: 20 }} />}>
      One-time authenticator
    </Requirement>
    <Requirement icon={<People color="#cccccc" style={{ height: 29 }} />}>
      3 shared owners
    </Requirement>
    <Requirement icon={<People style={{ height: 29 }} color="#cccccc" />}>
      3+ team members
    </Requirement>
  </div>
);

export default withStyles(styles)(Requirements);
