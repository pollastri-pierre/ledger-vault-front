// @flow
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";

import DialogButton from "components/legacy/DialogButton";
import type { Translate } from "data/types";
import { Title, Introduction, SubTitle } from "components/legacy/Onboarding";
import Footer from "./Footer";
import Requirements from "./Requirements";

const Welcome = ({ t }: { t: Translate }) => (
  <div>
    <Title>{t("onboarding:welcome.title")}</Title>
    <Introduction>{t("onboarding:welcome.description")}</Introduction>
    <div>
      <Step>
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
      </Step>
    </div>
    <SubTitle>{t("onboarding:requirements")}</SubTitle>
    <Requirements />
    <Footer
      isBack={false}
      nextState
      render={onNext => (
        <>
          <div />
          <DialogButton highlight onTouchTap={onNext}>
            {t("onboarding:welcome.start")}
          </DialogButton>
        </>
      )}
    />
  </div>
);

const Step = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  font-size: 13px;
  margin-bottom: 20px;
  & li {
    line-height: 22px;
  }
`;

export default withTranslation()(Welcome);
