// @flow
import React from "react";
import type { Translate } from "data/types";
import { withTranslation } from "react-i18next";
import DialogButton from "components/legacy/DialogButton";
import { Title, List, ListItem, Introduction } from "components/Onboarding";
import LinkCongureDevice from "./LinkCongureDevice";
import Footer from "./Footer";

const ConfigurationAdministrators = ({ t }: { t: Translate }) => (
  <div>
    <Title>{t("onboarding:administrators_configuration.title")}</Title>
    <Introduction>
      {t("onboarding:administrators_configuration.description")}
    </Introduction>
    <List>
      <ListItem number={1}>
        {t("onboarding:administrators_configuration.step1")}
      </ListItem>
      <ListItem number={2}>
        {t("onboarding:administrators_configuration.step2")}
        <br />
        <LinkCongureDevice>
          {t("onboarding:configure_device")}
        </LinkCongureDevice>
      </ListItem>
      <ListItem number={3}>
        {t("onboarding:administrators_configuration.step3")}
      </ListItem>
    </List>
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

export default withTranslation()(ConfigurationAdministrators);
