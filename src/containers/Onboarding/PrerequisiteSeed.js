//@flow
import React, { Fragment } from "react";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { Title, Introduction, SubTitle } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";

import { withStyles } from "@material-ui/core/styles";
import { RequirementUnit, BlueDevice } from "./Requirements";
import People from "components/icons/thin/People.js";

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
      left: -39,
      top: 30
    }
  },
  flexcolumn: {
    display: "flex"
  }
};
const PrerequisiteSeed = ({
  classes,
  t
}: {
  classes: { [$Keys<typeof styles>]: string },
  t: Translate
}) => {
  return (
    <div>
      <Title>{t("onboarding:master_seed_prerequisite.title")}</Title>
      <Introduction>
        {t("onboarding:master_seed_prerequisite.description")}
      </Introduction>
      <div className={classes.requirements}>
        <div>
          <SubTitle>{t("onboarding:required")}</SubTitle>
          <div className={classes.flexcolumn}>
            <RequirementUnit icon={<BlueDevice color="red" />}>
              <div style={{ width: 96 }}>
                <span>{t("onboarding:blue_red")}</span>
              </div>
            </RequirementUnit>
            <RequirementUnit icon={<BlueDevice color="green" />}>
              <div style={{ width: 96 }}>
                <span>{t("onboarding:blue_green")}</span>
              </div>
            </RequirementUnit>
            <RequirementUnit
              icon={<People color="#cccccc" style={{ height: 29 }} />}
              style={{ width: 76 }}
            >
              <div>{t("onboarding:shared_owners")}</div>
            </RequirementUnit>
            <RequirementUnit icon={<Cryptosteel style={{ marginLeft: 37 }} />}>
              {t("onboarding:cryptosteels")}
            </RequirementUnit>
          </div>
        </div>
      </div>
      <Footer
        render={(onNext, onPrevious) => (
          <Fragment>
            <DialogButton onTouchTap={onPrevious}>
              {t("commom:back")}
            </DialogButton>
            <DialogButton highlight onTouchTap={onNext}>
              {t("commom:continue")}
            </DialogButton>
          </Fragment>
        )}
      />
    </div>
  );
};

export default withStyles(styles)(translate()(PrerequisiteSeed));
