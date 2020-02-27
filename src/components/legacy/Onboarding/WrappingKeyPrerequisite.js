// @flow
import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";

import Cryptosteel from "components/icons/thin/Cryptosteel";
import type { Translate } from "data/types";
import DialogButton from "components/legacy/DialogButton";
import { Title, Introduction, SubTitle } from "components/Onboarding";
import People from "components/icons/thin/People";
import colors from "shared/colors";
import { RequirementUnit, BlueDevice } from "./Requirements";
import Footer from "./Footer";

const Prerequisite = ({ t }: { t: Translate }) => (
  <div>
    <Title>{t("onboarding:wrapping_key_prerequisite.title")}</Title>
    <Introduction>
      {t("onboarding:wrapping_key_prerequisite.description")}
    </Introduction>
    <Requirements>
      <div>
        <SubTitle>{t("onboarding:required")}</SubTitle>
        <FlexColumn>
          <RequirementUnit
            icon={<People color={colors.legacyGrey} style={{ height: 29 }} />}
          >
            <div style={{ width: 93 }}>{t("onboarding:wkey_custodians")}</div>
          </RequirementUnit>
          <RequirementUnit icon={<BlueDevice color="orange" />}>
            <div style={{ width: 96 }}>{t("onboarding:blue_orange")}</div>
          </RequirementUnit>
          <RequirementUnit icon={<Cryptosteel style={{ marginLeft: 37 }} />}>
            {t("onboarding:cryptosteels")}
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
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  line-height: 1.82;
  margin-bottom: 40px;
`;

const FlexColumn = styled.div`
  display: flex;
`;

export default withTranslation()(Prerequisite);
