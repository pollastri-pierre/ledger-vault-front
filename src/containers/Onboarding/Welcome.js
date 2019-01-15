// @flow
import DialogButton from "components/buttons/DialogButton";
import { withStyles } from "@material-ui/core/styles";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import React, { Fragment } from "react";
import { Title, Introduction, SubTitle } from "components/Onboarding";
import Footer from "./Footer";
import Requirements from "./Requirements";

const styles = {
  list: {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    fontSize: 13,
    marginBottom: 20,
    "& li": {
      lineHeight: "22px"
    }
  }
};
const Welcome = ({
  t,
  classes
}: {
  t: Translate,
  classes: { [$Keys<typeof styles>]: string }
}) => (
  <div>
    <Title>{t("onboarding:welcome.title")}</Title>
    <Introduction>{t("onboarding:welcome.description")}</Introduction>
    <div>
      <ul className={classes.list}>
        <li>
          <strong>1 - </strong>
          {t("onboarding:welcome.step1")}
        </li>
        <li>
          <strong>2 - </strong>
          {t("onboarding:welcome.step2")}
        </li>
        <li>
          <strong>3 - </strong>
          {t("onboarding:welcome.step3")}
        </li>
      </ul>
    </div>
    <SubTitle>{t("onboarding:requirements")}</SubTitle>
    <Requirements />
    <Footer
      isBack={false}
      nextState
      render={onNext => (
        <Fragment>
          <div />
          <DialogButton highlight onTouchTap={onNext}>
            {t("onboarding:welcome.start")}
          </DialogButton>
        </Fragment>
      )}
    />
  </div>
);

export default withStyles(styles)(translate()(Welcome));
