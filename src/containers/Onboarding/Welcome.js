//@flow
import Footer from "./Footer";
import DialogButton from "components/buttons/DialogButton";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import React from "react";
import { Title, Introduction, SubTitle } from "components/Onboarding";
import Requirements from "./Requirements.js";

const Welcome = ({ t }: { t: Translate }) => (
  <div>
    <Title>{t("onboarding:welcome.title")}</Title>
    <Introduction>{t("onboarding:welcome.description")}</Introduction>
    <div>
      <div>{t("onboarding:welcome.step1")}</div>
      <div>{t("onboarding:welcome.step2")}</div>
      <div>{t("onboarding:welcome.step3")}</div>
    </div>
    <SubTitle>{t("onboarding:requirements")}</SubTitle>
    <Requirements />
    <Footer
      isBack={false}
      nextState
      render={onNext => (
        <DialogButton highlight onTouchTap={onNext}>
          {t("onboarding:welcome.start")}
        </DialogButton>
      )}
    />
  </div>
);

export default translate()(Welcome);
