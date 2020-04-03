// @flow
import React from "react";
import type { Translate } from "data/types";
import { withTranslation } from "react-i18next";
import styled from "styled-components";

import DialogButton from "components/legacy/DialogButton";
import { Title, Introduction, SubTitle } from "components/legacy/Onboarding";
import People from "components/icons/thin/People";
import colors from "shared/colors";
import { RequirementUnit, BlueDevice } from "./Requirements";
import Footer from "./Footer";

const Prerequisite = ({ t }: { t: Translate }) => (
  <div>
    <Title>{t("onboarding:administrators_prerequisite.title")}</Title>
    <Introduction>
      {t("onboarding:administrators_prerequisite.description")}
    </Introduction>
    <Requirements>
      <div>
        <SubTitle>{t("onboarding:required")}</SubTitle>
        <FlexColumn>
          <RequirementUnit
            icon={<People color={colors.legacyGrey} style={{ height: 29 }} />}
          >
            <div style={{ width: 93 }}>{t("onboarding:team_members")}</div>
          </RequirementUnit>
          <RequirementUnit icon={<BlueDevice color="green" />}>
            <div style={{ width: 96 }}>{t("onboarding:blue_green")}</div>
          </RequirementUnit>
        </FlexColumn>
      </div>
    </Requirements>
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

const Requirements = styled.div`
  font-size: 11px;
  line-height: 1.82;
  margin-bottom: 40px;
`;

const FlexColumn = styled.div`
  display: flex;
`;

export default withTranslation()(Prerequisite);
