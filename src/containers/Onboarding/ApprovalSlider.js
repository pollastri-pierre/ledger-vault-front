// @flow
import React from "react";
import cx from "classnames";
import type { Translate } from "data/types";
import { translate, Interpolate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import Arrow from "../../components/icons/full/ArrowDown";

const styles = {
  base: { marginBottom: 40 },
  bold: {
    fontSize: 13,
    fontWeight: 600,
  },
  out: {
    fontSize: 12,
    color: "#767676",
  },
  flex: { display: "flex", justifyContent: "space-between" },
  require: {
    color: "#27d0e2",
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
    background: "#e2e2e2",
    display: "inline-block",
    marginRight: 5,
  },
  barSelected: {
    background: "#27d0e2",
  },
  left: {
    fill: "#27d0e2",
    marginRight: 8,
    transform: "rotate(90deg)",
  },
  right: {
    fill: "#27d0e2",
    marginLeft: 8,
    transform: "rotate(-90deg)",
  },
};
const ApprovalSlider = ({
  classes,
  number,
  total,
  onChange,
  t,
}: {
  classes: { [$Keys<typeof styles>]: string },
  number: number,
  total: number,
  onChange: number => void,
  t: Translate,
}) => (
  <div className={classes.base}>
    <div className={classes.flex}>
      <span className={classes.bold}>
        <Interpolate
          i18nKey="onboarding:administrators_scheme.nb_required"
          count={number}
        />
      </span>
      <span className={classes.out}>
        <Interpolate
          i18nKey="onboarding:administrators_scheme.out_of"
          total={total}
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
      <span className={classes.require} onClick={() => onChange(number - 1)}>
        <Arrow className={classes.left} />
        {t("onboarding:administrators_scheme.require_less")}
      </span>
      <span className={classes.require} onClick={() => onChange(number + 1)}>
        {t("onboarding:administrators_scheme.require_more")}
        <Arrow className={classes.right} />
      </span>
    </div>
  </div>
);

export default withStyles(styles)(translate()(ApprovalSlider));
