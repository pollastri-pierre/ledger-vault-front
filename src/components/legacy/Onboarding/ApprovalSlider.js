// @flow
import React from "react";
import cx from "classnames";
import Disabled from "components/Disabled";
import type { Translate } from "data/types";
import { withTranslation, Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import Arrow from "components/icons/full/ArrowDown";

const styles = {
  base: { marginBottom: 40 },
  bold: {
    fontSize: 13,
    fontWeight: 600,
  },
  out: {
    fontSize: 12,
    color: colors.steel,
  },
  flex: { display: "flex", justifyContent: "space-between" },
  require: {
    color: colors.ocean,
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: 600,
    cursor: "pointer",
  },
  requireDisable: {
    opacity: 0.5,
    cursor: "default",
  },
  bars: {
    marginTop: 20,
    marginBottom: 20,
  },
  bar: {
    height: 3,
    width: 60,
    background: colors.mouse,
    display: "inline-block",
    marginRight: 5,
  },
  barSelected: {
    background: colors.ocean,
  },
  left: {
    fill: colors.ocean,
    marginRight: 8,
    transform: "rotate(90deg)",
  },
  right: {
    fill: colors.ocean,
    marginLeft: 8,
    transform: "rotate(-90deg)",
  },
};
const ApprovalSlider = ({
  classes,
  number,
  total,
  min,
  max,
  onChange,
  t,
}: {
  classes: { [$Keys<typeof styles>]: string },
  number: number,
  min?: number,
  max?: number,
  total: number,
  onChange: number => void,
  t: Translate,
}) => (
  <div className={classes.base}>
    <div className={classes.flex}>
      <span className={classes.bold}>
        <Trans
          i18nKey="onboarding:administrators_scheme.nb_required"
          count={number}
        />
      </span>
      <span className={classes.out}>
        <Trans
          i18nKey="onboarding:administrators_scheme.out_of"
          values={{ total }}
        />
      </span>
    </div>
    <div className={classes.bars}>
      {Array(total)
        .fill()
        .map((o, i) => {
          const width = `calc(${100 / total}% - 5px)`;
          return (
            <div
              key={i} // eslint-disable-line react/no-array-index-key
              className={cx(classes.bar, {
                [classes.barSelected]: i < number,
              })}
              style={{ width }}
            />
          );
        })}
    </div>
    <div className={classes.flex}>
      <Disabled disabled={min && number === min}>
        <span
          data-test="edit-admin-rule_less"
          className={classes.require}
          onClick={() => {
            if (!min || number - 1 >= min) {
              onChange(number - 1);
            }
          }}
        >
          <Arrow className={classes.left} />
          {t("onboarding:administrators_scheme.require_less")}
        </span>
      </Disabled>
      <Disabled disabled={max && number === max}>
        <span
          data-test="edit-admin-rule_more"
          className={classes.require}
          onClick={() => {
            if (number + 1 <= total && (!max || number + 1 <= max)) {
              onChange(number + 1);
            }
          }}
        >
          {t("onboarding:administrators_scheme.require_more")}
          <Arrow className={classes.right} />
        </span>
      </Disabled>
    </div>
  </div>
);

export default withStyles(styles)(withTranslation()(ApprovalSlider));