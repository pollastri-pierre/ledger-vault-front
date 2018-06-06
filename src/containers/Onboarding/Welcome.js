//@flow
import Footer from "./Footer";
import DialogButton from "components/buttons/DialogButton";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import React from "react";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "components/Onboarding";
import Requirements from "./Requirements.js";

const Welcome = ({ t }: { t: Translate }) => (
  <div>
    <Title>{t("onboarding:welcome.title")}</Title>
    <Introduction>{t("onboarding:welcome.description")}</Introduction>
    <SubTitle>{t("onboarding:requirements")}</SubTitle>
    <Requirements />
    <SubTitle>{t("onboarding:tocontinue")}</SubTitle>
    <ToContinue>{t("onboarding:welcome.to_continue")}</ToContinue>
    <Footer
      isBack={false}
      nextState
      render={(onPrev, onNext) => (
        <DialogButton highlight onTouchTap={onNext}>
          {t("common:continue")}
        </DialogButton>
      )}
    />
  </div>
);

export default translate()(Welcome);
