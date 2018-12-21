//@flow
import React, { Component, Fragment } from "react";
import BluePlug from "components/icons/BluePlug";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";
import ReceiveLayout from "./ReceiveLayout";
import DeviceStep from "./DeviceStep";

const styles = {
  steps: {
    padding: "0 20px 0"
  },
  blue_icon: {
    display: "flex",
    justifyContent: "center"
  }
};
type Props = {
  classes: { [_: $Keys<typeof styles>]: string }
};
class ReceiveDevice extends Component<Props> {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes } = this.props;
    return (
      <ReceiveLayout
        header={
          <ModalSubTitle>{<Trans i18nKey="receive:device" />}</ModalSubTitle>
        }
        content={
          <Fragment>
            <div className={classes.blue_icon}>
              <BluePlug size={50} />
            </div>
            <div className={classes.steps}>
              <DeviceStep
                stepNumber={1}
                desc={<Trans i18nKey="receive:device_step1" />}
              />
              <DeviceStep
                stepNumber={2}
                desc={<Trans i18nKey="receive:device_step2" />}
              />
              <DeviceStep
                stepNumber={3}
                desc={<Trans i18nKey="receive:device_step3" />}
              />
              <DeviceStep
                stepNumber={4}
                desc={<Trans i18nKey="receive:device_step4" />}
              />
            </div>
          </Fragment>
        }
        footer={null}
      />
    );
  }
}

export default withStyles(styles)(ReceiveDevice);
