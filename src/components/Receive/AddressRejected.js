// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import IconShield from "components/icons/Shield";
import SupportLink from "components/SupportLink";
import BlueError from "components/icons/BlueError";
import colors from "shared/colors";

import ReceiveLayout from "./ReceiveLayout";

type Props = {
  checkAgain: () => void,
  classes: { [_: $Keys<typeof styles>]: string },
};

class AddressRejected extends PureComponent<Props, *> {
  render() {
    const { classes, checkAgain } = this.props;
    return (
      <ReceiveLayout
        header={
          <div className={classes.error_title_container}>
            <div className={classes.shieldIcon}>
              <IconShield height={30} width={28} color={colors.grenade} />
            </div>
            <span className={classes.error_title}>
              <Trans i18nKey="receive:address_rejected" />
            </span>
          </div>
        }
        content={
          <div className={classes.error_container}>
            <p className={classes.error_desc}>
              <Trans i18nKey="receive:address_rejected1" />
            </p>
            <div className={classes.error_blue}>
              <BlueError size={50} />
            </div>
            <p className={classes.error_desc}>
              <Trans i18nKey="receive:address_rejected2" />
            </p>
          </div>
        }
        footer={
          <div className={classes.actions}>
            <div className={classes.icon} onClick={checkAgain}>
              <span className={classes.actionText}>
                <Trans i18nKey="receive:retry" />
              </span>
            </div>
            <div className={classes.icon}>
              <SupportLink
                label={
                  <span className={classes.actionText}>
                    <Trans i18nKey="receive:support" />
                  </span>
                }
              />
            </div>
          </div>
        }
      />
    );
  }
}

const styles = {
  error_container: {
    padding: "0 40px",
  },
  error_desc: {
    fontSize: 13,
    textAlign: "center",
  },
  error_title_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  error_title: {
    alignSelf: "center",
    fontSize: 13,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: colors.grenade,
  },
  error_blue: {
    marginTop: 35,
    display: "flex",
    justifyContent: "center",
  },
  actions: {
    marginTop: 27,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  icon: {
    cursor: "pointer",
    opacity: 0.5,
    transition: "opacity 200ms ease",
    "&:hover": {
      opacity: 1,
    },
  },
  shieldIcon: {
    marginRight: 10,
    alignSelf: "center",
  },
  actionText: {
    fontSize: 12,
  },
};
export default withStyles(styles)(AddressRejected);
