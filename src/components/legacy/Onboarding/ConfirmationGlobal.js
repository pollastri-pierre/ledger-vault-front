// @flow
import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import colors from "shared/colors";
import { Title } from "components/legacy/Onboarding";
import type { Translate } from "data/types";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Validate from "components/icons/Validate";
import People from "components/icons/thin/People";
import Lock from "components/icons/thin/Lock";
import DialogButton from "components/legacy/DialogButton";
import Footer from "./Footer";

const ConfirmationGlobal = ({
  onboarding,
  match,
  history,
  t,
}: {
  match: *,
  history: *,
  onboarding: *,
  t: Translate,
}) => (
  <Box flow={20}>
    <Title>{t("onboarding:confirmation.title")}</Title>
    <Box flow={40}>
      <Box align="center" flow={20}>
        <Validate color={colors.ocean} style={{ strokeWidth: 4 }} />
        <Text fontWeight="bold" i18nKey="onboarding:confirmation.description" />
        <Text i18nKey="onboarding:confirmation.members_can_signin" />
      </Box>
      <Sep />
      <Box horizontal flow={20}>
        <Info icon={<People color={colors.blue_red} style={{ height: 29 }} />}>
          3 Shared-Owners
        </Info>
        <Info
          icon={<People color={colors.blue_orange} style={{ height: 29 }} />}
        >
          3 Wrapping Keys Custodians
        </Info>
        <Info
          icon={<People color={colors.blue_green} style={{ height: 29 }} />}
        >
          {onboarding.registering.admins.length}{" "}
          {t("onboarding:administrators")}
        </Info>
        <Info icon={<Lock />}>
          {onboarding.quorum}/{onboarding.registering.admins.length}{" "}
          {t("onboarding:confirmation.scheme")}
        </Info>
      </Box>
    </Box>
    <Footer
      render={() => (
        <>
          <div />
          <DialogButton
            highlight
            onTouchTap={() => {
              history.push(`/${match.params.orga_name}`);
            }}
          >
            {t("common:continue")}
          </DialogButton>
        </>
      )}
    />
  </Box>
);

const mapProps = state => ({
  onboarding: state.onboarding,
});

const InfoContainer = styled(Box).attrs({
  align: "center",
  justify: "center",
  flow: 10,
})``;

const Info = ({
  icon,
  children,
}: {
  icon: React$Node,
  children: React$Node,
}) => (
  <InfoContainer>
    {icon}
    <Box style={{ textAlign: "center" }}>{children}</Box>
  </InfoContainer>
);

export default connect(mapProps, () => ({}))(
  withTranslation()(ConfirmationGlobal),
);

const Sep = styled.div`
  width: 170px;
  margin: auto;
  height: 1px;
  background: ${colors.argile};
`;
