//@flow
import React from "react";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "components/Onboarding";

import { withStyles } from "@material-ui/core/styles";
import { RequirementUnit } from "./Requirements";
import People from "components/icons/thin/People.js";
import Box from "components/icons/thin/Box";
import Briefcase from "components/icons/thin/Briefcase";

const styles = {
  requirements: {
    display: "flex",
    fontSize: 11,
    lineHeight: 1.82,
    justifyContent: "space-between",
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
      left: -50,
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
            <RequirementUnit icon={<Box style={{ height: 29 }} />}>
              <div style={{ width: 96 }}>
                {t("onboarding:box_blue_devices")}
              </div>
            </RequirementUnit>
            <RequirementUnit
              icon={<People color="#cccccc" style={{ height: 29 }} />}
            >
              <div style={{ width: 93 }}>{t("onboarding:team_members")}</div>
            </RequirementUnit>
          </div>
        </div>
        <div className={classes.notrequired}>
          <SubTitle>{t("onboarding:not_required")}</SubTitle>
          <div className={classes.flexcolumn}>
            <RequirementUnit icon={<Briefcase style={{ height: 29 }} />}>
              <div style={{ width: 96 }}>{t("onboarding:vault_briefcase")}</div>
            </RequirementUnit>
            <RequirementUnit
              icon={<People color="#cccccc" style={{ height: 29 }} />}
              style={{ width: 76 }}
            >
              <div>{t("onboarding:shared_owners")}</div>
            </RequirementUnit>
          </div>
        </div>
      </div>
      <SubTitle>{t("onboarding:tocontinue")}</SubTitle>
      <ToContinue>
        {t("onboarding:administrators_prerequisite.to_continue")}
      </ToContinue>
      <Footer
        render={onNext => (
          <DialogButton highlight onTouchTap={onNext}>
            {t("common:continue")}
          </DialogButton>
        )}
      />
    </div>
  );
};

export default withStyles(styles)(translate()(Prerequisite));
