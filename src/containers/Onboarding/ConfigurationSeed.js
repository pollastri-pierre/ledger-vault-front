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

const ConfigurationSeed = ({ t }: { t: Translate }) => {
  return (
    <div>
      <Title>{t("onboarding:master_seed_configuration.title")}</Title>
      <Introduction>
        <strong>{t("onboarding:master_seed_configuration.description")}</strong>
      </Introduction>
      <List>
        <ListItem number={1}>
          {t("onboarding:master_seed_configuration.step1")}
        </ListItem>
        <ListItem number={2}>
          {t("onboarding:master_seed_configuration.step2")}
          <br />
          <a href="#">
            {t("onboarding:master_seed_configuration.configure_device")}
          </a>
        </ListItem>
        <ListItem number={3}>
          {t("onboarding:master_seed_configuration.step3")}
        </ListItem>
      </List>
      <SubTitle>{t("onboarding:tocontinue")}</SubTitle>
      <ToContinue>
        {t("onboarding:master_seed_configuration.to_continue")}
      </ToContinue>
      <Footer
        render={onNext => (
          <DialogButton highlight onTouchTap={onNext}>
            {t("common:continue")}
          </DialogButton>
        )}
      />
    </div>
  );
};

export default translate()(ConfigurationSeed);
