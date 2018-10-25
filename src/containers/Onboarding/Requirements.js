//@flow
import React from "react";
import colors from "shared/colors";
import cx from "classnames";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import People from "../../components/icons/thin/People";
import Briefcase from "components/icons/thin/Briefcase";
import RecoverySheet from "components/icons/thin/RecoverySheet";

const blue = {
  base: {
    border: "2px solid",
    borderRadius: 2,
    height: 33,
    padding: 1,
    width: 25,
    marginBottom: 5
  },
  inner: {
    border: "1px solid #cccccc",
    background: "#fbfbfb",
    height: "100%"
  },
  red: {
    borderColor: colors.blue_red
  },
  green: {
    borderColor: colors.blue_green
  },
  orange: {
    borderColor: colors.blue_orange
  }
};
export const BlueDevice = withStyles(
  blue
)(
  ({
    classes,
    color
  }: {
    classes: { [_: $Keys<typeof blue>]: string },
    color: string
  }) => (
    <div
      className={cx(classes.base, {
        [classes.red]: color === "red",
        [classes.orange]: color === "orange",
        [classes.green]: color === "green"
      })}
    >
      <div
        className={cx(classes.inner, {
          [classes.red]: color === "red",
          [classes.orange]: color === "orange",
          [classes.green]: color === "green"
        })}
      />
    </div>
  )
);
const styles = {
  base: {
    marginBottom: 40,
    fontSize: 11,
    lineHeight: 1.82
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 13
  }
};

const requirement = {
  base: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    maxWidth: 110
  },
  icon: {
    marginBottom: 2,
    height: 31,
    display: "flex",
    justifyContent: "center"
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
    icon: any,
    children: any
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
  classes,
  t
}: {
  classes: { [$Keys<typeof styles>]: string },
  t: Translate
}) => (
  <div className={classes.base}>
    <div className={classes.row}>
      <RequirementUnit icon={<Briefcase style={{ height: 25 }} />}>
        {t("onboarding:vault_briefcase")}
      </RequirementUnit>
      <RequirementUnit icon={<Cryptosteel style={{ marginLeft: 37 }} />}>
        {t("onboarding:nb_cryptosteels")}
      </RequirementUnit>
      <RequirementUnit icon={<RecoverySheet style={{ height: 25 }} />}>
        {t("onboarding:nb_recovery_sheets")}
      </RequirementUnit>
    </div>
    <div className={classes.row}>
      <RequirementUnit icon={<People color="#cccccc" style={{ height: 25 }} />}>
        {t("onboarding:wkey_custodians")}
      </RequirementUnit>
      <RequirementUnit icon={<People color="#cccccc" style={{ height: 25 }} />}>
        {t("onboarding:shared_owners")}
      </RequirementUnit>
      <RequirementUnit icon={<People style={{ height: 25 }} color="#cccccc" />}>
        {t("onboarding:team_members")}
      </RequirementUnit>
    </div>

    <div className={classes.row}>
      <RequirementUnit icon={<BlueDevice color="orange" />}>
        <div>{t("onboarding:blue_orange")}</div>
      </RequirementUnit>
      <RequirementUnit icon={<BlueDevice color="green" />}>
        {t("onboarding:blue_green")}
      </RequirementUnit>
      <RequirementUnit icon={<BlueDevice color="red" />}>
        {t("onboarding:blue_red")}
      </RequirementUnit>
    </div>
  </div>
);

export default withStyles(styles)(translate()(Requirements));
