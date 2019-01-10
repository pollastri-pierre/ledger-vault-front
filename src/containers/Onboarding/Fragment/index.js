//@flow
import React from "react";
import cx from "classnames";
import { ProfileIcon } from "components/Onboarding";
import { withStyles } from "@material-ui/core/styles";
import ValidateBadge from "components/icons/full/ValidateBadge";

const status = {
  base: {
    fontSize: 11,
    fontWeight: 600,
    color: "#27d0e2",
    textTransform: "uppercase",
    cursor: "pointer"
  },
  icon: {
    width: 11,
    fill: "#27d0e2",
    verticalAlign: "middle",
    marginRight: 10
  },
  generated: {
    fontSize: 11
  }
};
export const SeedStatus = withStyles(status)(
  ({
    classes,
    label,
    generated,
    open
  }: {
    classes: { [$Keys<typeof status>]: string },
    label: string,
    open: Function,
    generated: boolean
  }) => {
    if (generated) {
      return (
        <div className={classes.generated}>
          <ValidateBadge className={classes.icon} />
          received
        </div>
      );
    }
    return (
      <div className={cx(classes.base, "fragment-click")} onClick={open}>
        {label}
      </div>
    );
  }
);

const styles = {
  base: {
    paddingRight: 13,
    textAlign: "center",
    paddingLeft: 25,
    "&:first-child": {
      paddingLeft: 0
    },
    transition: "all 200ms ease"
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    margin: "0 0 12px 0"
  },
  disabled: {
    opacity: 0.2
  }
};
const Fragment = ({
  classes,
  label,
  disabled,
  labelGenerate,
  generated,
  generate
}: {
  label: string,
  classes: { [$Keys<typeof styles>]: string },
  disabled: boolean,
  labelGenerate: string,
  generated: boolean,
  generate: Function
}) => (
  <div
    className={cx(classes.base, "fragment", { [classes.disabled]: disabled })}
  >
    <ProfileIcon />
    <div className={classes.title}>{label}</div>
    <SeedStatus label={labelGenerate} generated={generated} open={generate} />
  </div>
);
export default withStyles(styles)(Fragment);
