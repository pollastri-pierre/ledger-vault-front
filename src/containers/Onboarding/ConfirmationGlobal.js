//@flow
import React from "react";
import { Title } from "components/Onboarding";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import Validate from "components/icons/Validate";
import People from "components/icons/thin/People.js";
import Lock from "components/icons/thin/Lock";
import DialogButton from "components/buttons/DialogButton";
import { connect } from "react-redux";
import Footer from "./Footer";

const styles = {
  base: {
    textAlign: "center",
    fontSize: 13
  },
  icon: {
    width: 35,
    height: 35,
    margin: "0 auto 20px",
    borderRadius: "50%",
    border: "3px solid #27d0e2",
    paddingTop: 5,
    textAlign: "center"
  },
  sep: {
    width: 170,
    height: 1,
    background: "#eeeeee",
    margin: "30px auto 30px auto"
  },
  sumary: {
    display: "flex",
    margin: "auto"
  },
  info: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 1.82
  }
};
const ConfirmationGlobal = ({
  classes,
  onboarding,
  match,
  history,
  t
}: {
  classes: { [$Keys<typeof styles>]: string },
  match: *,
  history: *,
  onboarding: *,
  t: Translate
}) => {
  return (
    <div>
      <Title>{t("onboarding:confirmation.title")}</Title>
      <div>
        <div className={classes.base}>
          <div>
            <div className={classes.icon}>
              <Validate color="#27d0e2" style={{ strokeWidth: 4 }} />
            </div>
          </div>
          <strong>{t("onboarding:confirmation.description")}</strong>
          <p>{t("onboarding:confirmation.members_can_signin")}</p>
        </div>
        <div className={classes.sep} />
        <div className={classes.sumary}>
          <div className={classes.info}>
            <div style={{ marginBottom: 12 }}>
              <People color="#cccccc" style={{ height: 29 }} />
            </div>
            3 shared owners
          </div>
          <div className={classes.info}>
            <div style={{ marginBottom: 12 }}>
              <People color="#cccccc" style={{ height: 29 }} />
            </div>
            3 Wrapping Keys Custodians
          </div>
          <div className={classes.info}>
            <div style={{ marginBottom: 12 }}>
              <People color="#cccccc" style={{ height: 29 }} />
            </div>
            {onboarding.registering.admins.length}{" "}
            {t("onboarding:administrators")}
          </div>
          <div className={classes.info}>
            <div style={{ marginBottom: 12 }}>
              <Lock />
            </div>
            {onboarding.quorum}/{onboarding.registering.admins.length}{" "}
            {t("onboarding:confirmation.scheme")}
          </div>
        </div>
      </div>
      <Footer
        render={() => (
          <DialogButton
            highlight
            onTouchTap={() => {
              history.push(`/${match.params.orga_name}`);
            }}
          >
            {t("common:continue")}
          </DialogButton>
        )}
      />
    </div>
  );
};

const mapProps = state => ({
  onboarding: state.onboarding
});

export default connect(mapProps, () => ({}))(
  withStyles(styles)(translate()(ConfirmationGlobal))
);
