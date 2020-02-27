// @flow
import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";

import type { Translate } from "data/types";
import Cryptosteel from "components/icons/thin/Cryptosteel";
import Briefcase from "components/icons/thin/Briefcase";
import RecoverySheet from "components/icons/thin/RecoverySheet";
import People from "components/icons/thin/People";
import colors from "shared/colors";

const BlueDeviceOuter = styled.div`
  border: 2px solid;
  border-radius: 2px;
  height: 33px;
  padding: 1px;
  width: 25px;
  margin-bottom: 5px;
  border-color: ${p =>
    p.color === "orange"
      ? colors.blue_orange
      : p.color === "green"
      ? colors.blue_green
      : colors.blue_red};
`;

const BlueDeviceInner = styled.div`
  border: 1px solid ${colors.legacyGrey};
  background: ${colors.legacyLightGrey4};
  height: 100%;
  border-color: ${p =>
    p.color === "orange"
      ? colors.blue_orange
      : p.color === "green"
      ? colors.blue_green
      : colors.blue_red};
`;

export const BlueDevice = ({ color }: { color: string }) => (
  <BlueDeviceOuter color={color}>
    <BlueDeviceInner color={color} />
  </BlueDeviceOuter>
);

const RequirementUnitBase = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-right: 20px;
  width: 80px;
`;
const RequirementUnitIcon = styled.div`
  margin-bottom: 2px;
  height: 31px;
  display: flex;
  justify-content: center;
`;
export const RequirementUnit = ({
  icon,
  children,
  ...props
}: {
  icon: any,
  children: any,
}) => (
  <RequirementUnitBase {...props}>
    <RequirementUnitIcon>{icon}</RequirementUnitIcon>
    <div>{children}</div>
  </RequirementUnitBase>
);
const Requirements = ({ t }: { t: Translate }) => (
  <Base>
    <Row>
      <RequirementUnit icon={<Briefcase style={{ height: 25 }} />}>
        {t("onboarding:vault_briefcase")}
      </RequirementUnit>
      <RequirementUnit icon={<Cryptosteel style={{ marginLeft: 37 }} />}>
        {t("onboarding:nb_cryptosteels")}
      </RequirementUnit>
      <RequirementUnit icon={<RecoverySheet style={{ height: 25 }} />}>
        {t("onboarding:nb_recovery_sheets")}
      </RequirementUnit>
    </Row>
    <Row>
      <RequirementUnit
        icon={<People color={colors.legacyGrey} style={{ height: 25 }} />}
      >
        {t("onboarding:wkey_custodians")}
      </RequirementUnit>
      <RequirementUnit
        icon={<People style={{ height: 25 }} color={colors.legacyGrey} />}
      >
        {t("onboarding:team_members")}
      </RequirementUnit>
      <RequirementUnit
        icon={<People color={colors.legacyGrey} style={{ height: 25 }} />}
      >
        {t("onboarding:shared_owners")}
      </RequirementUnit>
    </Row>

    <Row>
      <RequirementUnit icon={<BlueDevice color="orange" />}>
        <div>{t("onboarding:blue_orange")}</div>
      </RequirementUnit>
      <RequirementUnit icon={<BlueDevice color="green" />}>
        {t("onboarding:blue_green")}
      </RequirementUnit>
      <RequirementUnit icon={<BlueDevice color="red" />}>
        {t("onboarding:blue_red")}
      </RequirementUnit>
    </Row>
  </Base>
);

const Base = styled.div`
  margin-bottom: 40px;
  font-size: 11px;
  line-height: 1.82;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 13px;
`;

export default withTranslation()(Requirements);
