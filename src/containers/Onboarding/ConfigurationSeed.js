//@flow
import React, { Fragment } from "react";
import LinkCongureDevice from "./LinkCongureDevice";
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
          <LinkCongureDevice>
            {t("onboarding:configure_device")}
          </LinkCongureDevice>
        </ListItem>
        <ListItem number={3}>
          {t("onboarding:master_seed_configuration.step3")}
        </ListItem>
      </List>
      <Footer
        render={(onNext, onPrevious) => (
          <Fragment>
            <DialogButton onTouchTap={onPrevious}>
              {t("common:back")}
            </DialogButton>
            <DialogButton highlight onTouchTap={onNext}>
              {t("common:continue")}
            </DialogButton>
          </Fragment>
        )}
      />
    </div>
  );
};

export default translate()(ConfigurationSeed);
