//@flow
import React from "react";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import {
  Title,
  SubTitle,
  List,
  ListItem,
  ToContinue,
  Introduction
} from "../../components/Onboarding.js";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";

const ConfigurationAdministrators = ({ t }: { t: Translate }) => {
  return (
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
          <a href="#">
            {t("onboarding:administrators_configuration.configure_device")}
          </a>
        </ListItem>
        <ListItem number={3}>
          {t("onboarding:administrators_configuration.step3")}
        </ListItem>
      </List>
      <SubTitle>{t("onboarding:tocontinue")}</SubTitle>
      <ToContinue>
        {t("onboarding:administrators_configuration.to_continue")}
      </ToContinue>
      <Footer
        render={(onPrev, onNext) => (
          <DialogButton highlight onTouchTap={onNext}>
            {t("common:continue")}
          </DialogButton>
        )}
      />
    </div>
  );
};

export default translate()(ConfigurationAdministrators);
