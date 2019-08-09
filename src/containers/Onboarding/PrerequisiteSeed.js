// @flow
import React from "react";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import type { Translate } from "data/types";
import { withTranslation } from "react-i18next";
import { Title, Introduction, SubTitle } from "components/Onboarding";
import DialogButton from "components/legacy/DialogButton";
import { withStyles } from "@material-ui/core/styles";
import People from "components/icons/thin/People";
import Footer from "./Footer";

import { RequirementUnit, BlueDevice } from "./Requirements";

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
      background: "#eeeeee",
      left: -39,
      top: 30,
    },
  },
  flexcolumn: {},
  row: {
    display: "flex",
    marginTop: 20,
  },
};
const PrerequisiteSeed = ({
  classes,
  t,
}: {
  classes: { [$Keys<typeof styles>]: string },
  t: Translate,
}) => (
  <div>
    <Title>{t("onboarding:master_seed_prerequisite.title")}</Title>
    <Introduction>
      {t("onboarding:master_seed_prerequisite.description")}
    </Introduction>
    <div className={classes.requirements}>
      <div>
        <SubTitle>{t("onboarding:required")}</SubTitle>
        <div className={classes.flexcolumn}>
          <div className={classes.row}>
            <RequirementUnit
              icon={<People color="#cccccc" style={{ height: 25 }} />}
              style={{ width: 76 }}
            >
              <div>{t("onboarding:shared_owners")}</div>
            </RequirementUnit>
            <RequirementUnit
              icon={<People style={{ height: 25 }} color="#cccccc" />}
            >
              {t("onboarding:team_members")}
            </RequirementUnit>
            <RequirementUnit icon={<BlueDevice color="red" />}>
              <div style={{ width: 96 }}>
                <span>{t("onboarding:blue_red")}</span>
              </div>
            </RequirementUnit>
          </div>
          <div className={classes.row}>
            <RequirementUnit icon={<BlueDevice color="green" />}>
              <div style={{ width: 96 }}>
                <span>{t("onboarding:blue_green")}</span>
              </div>
            </RequirementUnit>
            <RequirementUnit icon={<Cryptosteel style={{ marginLeft: 37 }} />}>
              {t("onboarding:cryptosteels")}
            </RequirementUnit>
          </div>
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

export default withStyles(styles)(withTranslation()(PrerequisiteSeed));
