// @flow
import React from "react";
import type { Translate } from "data/types";
import { withTranslation } from "react-i18next";
import DialogButton from "components/buttons/DialogButton";
import {
  Title,
  List,
  ListItem,
  Introduction,
} from "../../components/Onboarding";
import LinkCongureDevice from "./LinkCongureDevice";
import Footer from "./Footer";

const ConfigurationSeed = ({ t }: { t: Translate }) => (
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

export default withTranslation()(ConfigurationSeed);
