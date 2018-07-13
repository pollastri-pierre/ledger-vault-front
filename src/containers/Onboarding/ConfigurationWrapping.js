//@flow
import React from "react";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import {
  Title,
  List,
  ListItem,
  Introduction
} from "../../components/Onboarding.js";
import DialogButton from "components/buttons/DialogButton";
import Footer from "./Footer";

const ConfigurationWrapping = ({ t }: { t: Translate }) => {
  return (
    <div>
      <Title>{t("onboarding:wrapping_key_init.title")}</Title>
      <Introduction>
        {t("onboarding:wrapping_key_init.description")}
      </Introduction>
      <List>
        <ListItem number={1}>
          {t("onboarding:wrapping_key_init.step1")}
        </ListItem>
        <ListItem number={2}>
          {t("onboarding:wrapping_key_init.step2")}
          <br />
          <a
            href="https://help.vault.ledger.com/Content/devices/ledgerblueneterprise.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("onboarding:configure_device")}
          </a>
        </ListItem>
        <ListItem number={3}>
          {t("onboarding:wrapping_key_init.step3")}
        </ListItem>
      </List>
      <Footer
        nextState
        render={onNext => (
          <DialogButton highlight onTouchTap={onNext}>
            {t("common:continue")}
          </DialogButton>
        )}
      />
    </div>
  );
};

export default translate()(ConfigurationWrapping);
