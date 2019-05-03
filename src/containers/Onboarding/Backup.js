// @flow
import React from "react";
import colors from "shared/colors";
import Warning from "components/icons/TriangleWarning";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import Trash from "components/icons/thin/Trash";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import RecoverySheet from "components/icons/thin/RecoverySheet";
import { withStyles } from "@material-ui/core/styles";
import DialogButton from "components/buttons/DialogButton";
import { Title, Introduction } from "../../components/Onboarding";
import Footer from "./Footer";

const step = {
  base: { fontSize: 11, lineHeight: 1.82, flex: 0.3 },
  number: { fontSize: 16, marginRight: 10, verticalAlign: "bottom" },
};
const Step = withStyles(step)(({ number, icon, children, classes }) => (
  <div className={classes.base}>
    <div style={{ marginBottom: 13 }}>
      <span className={classes.number}>{number}.</span>
      {icon}
    </div>
    {children}
  </div>
));
const styles = {
  steps: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  careful: {
    background: "#ea2e492b",
    fontSize: 13,
    color: "#b14656",
    lineHeight: 1.54,
    padding: 20,
    paddingLeft: 52,
    position: "relative",
    fontWeight: "bold",
    margin: 0,
    borderRadius: 4,
    marginBottom: 22,
  },
  icon: {
    position: "absolute",
    color: colors.grenade,
    left: 21,
    top: 31,
  },
  toContinue: {
    marginBottom: 15,
  },
};
const Backup = ({
  classes,
  t,
}: {
  classes: { [$Keys<typeof styles>]: string },
  t: Translate,
}) => (
  <div>
    <Title>{t("onboarding:backup.title")}</Title>
    <Introduction>{t("onboarding:backup.description")}</Introduction>
    <div className={classes.steps}>
      <Step
        number="1"
        icon={<RecoverySheet style={{ height: 32, width: 22 }} />}
      >
        {t("onboarding:backup.step1")}
      </Step>
      <Step number="2" icon={<Cryptosteel style={{ height: 31, width: 32 }} />}>
        {t("onboarding:backup.step2")}
      </Step>
      <Step number="3" icon={<Trash color="#cccccc" style={{ height: 28 }} />}>
        {t("onboarding:backup.step3")}
      </Step>
    </div>
    <div className={classes.careful}>
      <Warning className={classes.icon} width={20} height={20} />
      {t("onboarding:backup.warning")}
    </div>
    <Footer
      nextState
      render={(onNext, onPrevious) => (
        <>
          <DialogButton onTouchTap={onPrevious}>
            {t("common:back")}
          </DialogButton>
          <DialogButton highlight onTouchTap={onNext}>
            {t("common:continue")}
          </DialogButton>
        </>
      )}
    />
  </div>
);

export default withStyles(styles)(translate()(Backup));
