// @flow
import React from "react";
import { withTranslation } from "react-i18next";

import colors from "shared/colors";
import { Title } from "components/legacy/Onboarding";
import type { Translate } from "data/types";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Validate from "components/icons/Validate";
import DialogButton from "components/legacy/DialogButton";
import Footer from "./Footer";

const ConfirmationGlobal = ({ history, t }: { history: *, t: Translate }) => (
  <Box flow={20}>
    <Title>{t("onboarding:confirmation.title")}</Title>
    <Box flow={40}>
      <Box align="center" flow={20}>
        <Validate color={colors.ocean} style={{ strokeWidth: 4 }} />
        <Text fontWeight="bold" i18nKey="onboarding:confirmation.description" />
        <Text i18nKey="onboarding:confirmation.members_can_signin" />
      </Box>
    </Box>
    <Footer
      render={() => (
        <>
          <div />
          <DialogButton
            highlight
            onTouchTap={() => {
              const redirect = "/";
              if (process.env.NODE_ENV === "production") {
                window.location.href = redirect;
              } else {
                history.push(redirect);
              }
            }}
          >
            {t("common:continue")}
          </DialogButton>
        </>
      )}
    />
  </Box>
);

export default withTranslation()(ConfirmationGlobal);
