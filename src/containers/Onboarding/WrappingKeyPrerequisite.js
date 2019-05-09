// @flow
import React from "react";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import type { Translate } from "data/types";
import { withTranslation } from "react-i18next";
import DialogButton from "components/buttons/DialogButton";
import { Title, Introduction, SubTitle } from "components/Onboarding";

import { withStyles } from "@material-ui/core/styles";
import People from "components/icons/thin/People";
import { RequirementUnit, BlueDevice } from "./Requirements";
import Footer from "./Footer";

const styles = {
  requirements: {
    display: "flex",
    fontSize: 11,
    lineHeight: 1.82,
    justifyContent: "space-between",
    marginBottom: 40,
  },
  notrequired: {
    opacity: 0.5,
    position: "relative",
    "&:before": {
      content: '""',
      position: "absolute",
      width: 1,
      height: 80,
      background: "#eeeeee",
      left: -30,
      top: 30,
    },
  },
  flexcolumn: {
    display: "flex",
  },
};
const Prerequisite = ({
  classes,
  t,
}: {
  classes: { [$Keys<typeof styles>]: string },
  t: Translate,
}) => (
  <div>
    <Title>{t("onboarding:wrapping_key_prerequisite.title")}</Title>
    <Introduction>
      {t("onboarding:wrapping_key_prerequisite.description")}
    </Introduction>
    <div className={classes.requirements}>
      <div>
        <SubTitle>{t("onboarding:required")}</SubTitle>
        <div className={classes.flexcolumn}>
          <RequirementUnit
            icon={<People color="#cccccc" style={{ height: 29 }} />}
          >
            <div style={{ width: 93 }}>{t("onboarding:wkey_custodians")}</div>
          </RequirementUnit>
          <RequirementUnit icon={<BlueDevice color="orange" />}>
            <div style={{ width: 96 }}>{t("onboarding:blue_orange")}</div>
          </RequirementUnit>
          <RequirementUnit icon={<Cryptosteel style={{ marginLeft: 37 }} />}>
            {t("onboarding:cryptosteels")}
          </RequirementUnit>
        </div>
      </div>
    </div>
    <Footer
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

export default withStyles(styles)(withTranslation()(Prerequisite));
