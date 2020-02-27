// @flow
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";

import colors from "shared/colors";
import Warning from "components/icons/TriangleWarning";
import type { Translate } from "data/types";
import Trash from "components/icons/thin/Trash";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import RecoverySheet from "components/icons/thin/RecoverySheet";
import DialogButton from "components/legacy/DialogButton";
import { Title, Introduction } from "components/Onboarding";
import Footer from "./Footer";

type StepProps = {
  number: string,
  icon: React$Node,
  children: React$Node,
};

const Step = ({ number, icon, children }: StepProps) => (
  <StepElements>
    <div style={{ marginBottom: 13 }}>
      <StepNumber>{number}.</StepNumber>
      {icon}
    </div>
    {children}
  </StepElements>
);

const Backup = ({ t }: { t: Translate }) => (
  <div>
    <Title>{t("onboarding:backup.title")}</Title>
    <Introduction>{t("onboarding:backup.description")}</Introduction>
    <StepsContainer>
      <Step
        number="1"
        icon={<RecoverySheet style={{ height: 32, width: 22 }} />}
      >
        {t("onboarding:backup.step1")}
      </Step>
      <Step number="2" icon={<Cryptosteel style={{ height: 31, width: 32 }} />}>
        {t("onboarding:backup.step2")}
      </Step>
      <Step
        number="3"
        icon={<Trash color={colors.legacyGrey} style={{ height: 28 }} />}
      >
        {t("onboarding:backup.step3")}
      </Step>
    </StepsContainer>
    <Careful>
      <StyleWarning width={20} height={20} />
      {t("onboarding:backup.warning")}
    </Careful>
    <Footer
      nextState
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

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StepElements = styled.div`
  font-size: 11px;
  line-height: 1.82;
  flex: 0.3;
`;

const StepNumber = styled.div`
  font-size: 16px;
  margin-right: 10px;
  vertical-align: bottom;
`;

const Careful = styled.div`
  background: ${colors.legacyTranslucentGrenade};
  font-size: 13px;
  color: ${colors.legacyGrenade};
  line-height: 1.54;
  padding: 20px;
  padding-left: 52px;
  position: relative;
  font-weight: bold;
  margin: 0;
  border-radius: 4px;
  margin-bottom: 22px;
`;

const StyleWarning = styled(Warning)`
  position: absolute;
  color: ${colors.grenade};
  left: 21px;
  top: 31px;
`;

export default withTranslation()(Backup);
