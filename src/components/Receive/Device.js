//@flow
import React, { Component } from "react";
import BluePlug from "components/icons/BluePlug";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import { withStyles } from "@material-ui/core/styles";
import type { Translate } from "data/types";
import { translate } from "react-i18next";

const styles = {
  base: {},
  row: {
    display: "flex",
    background: "#fbfbfb",
    padding: 5,
    marginBottom: 5,
    alignItems: "center",
    position: "relative",
    fontSize: 13,
    height: 58
  },
  steps: {
    padding: "0 40px 0"
  },
  step: {
    lineHeight: "22px",
    display: "flex",
    marginBottom: 16
  },
  number: {
    fontSize: 11,
    marginRight: 15,
    fontWeight: "bold"
  },
  step_label: {
    fontSize: 15
  }
};
type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  t: Translate
};
class ReceiveDevice extends Component<Props> {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.base}>
        <ModalSubTitle>{t("receive:device")}</ModalSubTitle>
        <div style={{ margin: "0 0 20px 192px" }}>
          <BluePlug size={50} />
        </div>
        <div className={classes.steps}>
          <div className={classes.step}>
            <div className={classes.number}>1</div>
            <div className={classes.step_label}>
              {t("receive:device_step1")}
            </div>
          </div>
          <div className={classes.step}>
            <div className={classes.number}>2</div>
            <div className={classes.step_label}>
              {t("receive:device_step2")}
            </div>
          </div>
          <div className={classes.step}>
            <div className={classes.number}>3</div>
            <div className={classes.step_label}>
              {t("receive:device_step3")}
            </div>
          </div>
          <div className={classes.step}>
            <div className={classes.number}>4</div>
            <div className={classes.step_label}>
              {t("receive:device_step4")}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(translate()(ReceiveDevice));
