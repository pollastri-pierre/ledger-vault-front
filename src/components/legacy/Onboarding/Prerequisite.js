// @flow
import React from "react";
import type { Translate } from "data/types";
import { withTranslation } from "react-i18next";
import DialogButton from "components/legacy/DialogButton";
import { Title, Introduction, SubTitle } from "components/Onboarding";

import { withStyles } from "@material-ui/core/styles";
import People from "components/icons/thin/People";
import colors from "shared/colors";
import { RequirementUnit, BlueDevice } from "./Requirements";
import Footer from "./Footer";

const styles = {
  requirements: {
    fontSize: 11,
    lineHeight: 1.82,
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
      background: colors.argile,
      left: -26,
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
    <Title>{t("onboarding:administrators_prerequisite.title")}</Title>
    <Introduction>
      {t("onboarding:administrators_prerequisite.description")}
    </Introduction>
    <div className={classes.requirements}>
      <div>
        <SubTitle>{t("onboarding:required")}</SubTitle>
        <div className={classes.flexcolumn}>
          <RequirementUnit
            icon={<People color={colors.legacyGrey} style={{ height: 29 }} />}
          >
            <div style={{ width: 93 }}>{t("onboarding:team_members")}</div>
          </RequirementUnit>
          <RequirementUnit icon={<BlueDevice color="green" />}>
            <div style={{ width: 96 }}>{t("onboarding:blue_green")}</div>
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
