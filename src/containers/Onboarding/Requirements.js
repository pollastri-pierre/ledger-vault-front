//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
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
    justifyContent: "center",
    maxWidth: 115
  },
  icon: {
    marginBottom: 10,
    height: 31,
    display: "flex"
  }
};
export const RequirementUnit = withStyles(
  requirement
)(
  ({
    classes,
    icon,
    children,
    ...props
  }: {
    classes: { [$Keys<typeof requirement>]: string },
    icon: React$Node,
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
    <RequirementUnit icon={<Briefcase style={{ height: 29 }} />}>
      <div>Ledger Vault briefcase</div>
    </RequirementUnit>
    <RequirementUnit icon={<Box style={{ height: 26 }} />}>
      <div>Box of Ledger Blue devices</div>
    </RequirementUnit>
    <RequirementUnit icon={<Plug color="#cccccc" style={{ height: 20 }} />}>
      <div>One-time authenticator</div>
    </RequirementUnit>
    <RequirementUnit icon={<People color="#cccccc" style={{ height: 29 }} />}>
      <div>3 shared owners</div>
    </RequirementUnit>
    <RequirementUnit icon={<People style={{ height: 29 }} color="#cccccc" />}>
      <div>3+ team members</div>
    </RequirementUnit>
  </div>
);

export default withStyles(styles)(Requirements);
