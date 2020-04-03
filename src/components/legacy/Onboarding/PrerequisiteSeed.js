// @flow
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";

import type { Translate } from "data/types";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import { Introduction, SubTitle, Title } from "components/legacy/Onboarding";
import DialogButton from "components/legacy/DialogButton";
import People from "components/icons/thin/People";
import colors from "shared/colors";
import Footer from "./Footer";

import { BlueDevice, RequirementUnit } from "./Requirements";

const PrerequisiteSeed = ({ t }: { t: Translate }) => (
  <div>
    <Title>{t("onboarding:master_seed_prerequisite.title")}</Title>
    <Introduction>
      {t("onboarding:master_seed_prerequisite.description")}
    </Introduction>
    <Requirements>
      <div>
        <SubTitle>{t("onboarding:required")}</SubTitle>
        <FlexColumn>
          <Row>
            <RequirementUnit
              icon={<People color={colors.legacyGrey} style={{ height: 25 }} />}
              style={{ width: 76 }}
            >
              <div>{t("onboarding:shared_owners")}</div>
            </RequirementUnit>
            <RequirementUnit
              icon={<People style={{ height: 25 }} color={colors.legacyGrey} />}
            >
              {t("onboarding:team_members")}
            </RequirementUnit>
            <RequirementUnit icon={<BlueDevice color="red" />}>
              <div style={{ width: 96 }}>
                <span>{t("onboarding:blue_red")}</span>
              </div>
            </RequirementUnit>
          </Row>
          <Row>
            <RequirementUnit icon={<BlueDevice color="green" />}>
              <div style={{ width: 96 }}>
                <span>{t("onboarding:blue_green")}</span>
              </div>
            </RequirementUnit>
            <RequirementUnit icon={<Cryptosteel style={{ marginLeft: 37 }} />}>
              {t("onboarding:cryptosteels")}
            </RequirementUnit>
          </Row>
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

const Row = styled.div`
  display: flex;
  margin-top: 20px;
`;

export default withTranslation()(PrerequisiteSeed);
