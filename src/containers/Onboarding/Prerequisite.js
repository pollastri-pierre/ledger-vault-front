//@flow
import React, { Fragment } from "react";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";
import { Title, Introduction, SubTitle } from "components/Onboarding";

import { withStyles } from "@material-ui/core/styles";
import { RequirementUnit, BlueDevice } from "./Requirements";
import People from "components/icons/thin/People.js";

const styles = {
  requirements: {
    fontSize: 11,
    lineHeight: 1.82,
    marginBottom: 40
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
      left: -26,
      top: 30
    }
  },
  flexcolumn: {
    display: "flex"
  }
};
const Prerequisite = ({
  classes,
  t
}: {
  classes: { [$Keys<typeof styles>]: string },
  t: Translate
}) => {
  return (
    <div>
      <Title>{t("onboarding:administrators_prerequisite.title")}</Title>
      <Introduction>
        {t("onboarding:administrators_prerequisite.description")}
      </Introduction>
      <div className={classes.requirements}>
        <div>
          <SubTitle>{t("onboarding:required")}</SubTitle>
          <div className={classes.flexcolumn}>
            <RequirementUnit icon={<BlueDevice color="green" />}>
              <div style={{ width: 96 }}>{t("onboarding:blue_green")}</div>
            </RequirementUnit>
            <RequirementUnit
              icon={<People color="#cccccc" style={{ height: 29 }} />}
            >
              <div style={{ width: 93 }}>{t("onboarding:team_members")}</div>
            </RequirementUnit>
          </div>
        </div>
      </div>
      <Footer
        render={(onNext, onPrevious) => (
          <Fragment>
            <DialogButton onTouchTap={onPrevious}>
              {t("common:back")}
            </DialogButton>
            <DialogButton highlight onTouchTap={onNext}>
              {t("common:continue")}
            </DialogButton>
          </Fragment>
        )}
      />
    </div>
  );
};

export default withStyles(styles)(translate()(Prerequisite));
