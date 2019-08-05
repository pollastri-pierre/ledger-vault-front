// @flow
import React from "react";
import type { Translate } from "data/types";
import { withTranslation } from "react-i18next";
import DialogButton from "components/legacy/DialogButton";
import LinkCongureDevice from "./LinkCongureDevice";
import {
  Title,
  List,
  ListItem,
  Introduction,
} from "../../components/Onboarding";
import Footer from "./Footer";

const ConfigurationWrapping = ({ t }: { t: Translate }) => (
  <div>
    <Title>{t("onboarding:wrapping_key_init.title")}</Title>
    <Introduction>{t("onboarding:wrapping_key_init.description")}</Introduction>
    <List>
      <ListItem number={1}>{t("onboarding:wrapping_key_init.step1")}</ListItem>
      <ListItem number={2}>
        {t("onboarding:wrapping_key_init.step2")}
        <br />
        <LinkCongureDevice>
          {t("onboarding:configure_device")}
        </LinkCongureDevice>
      </ListItem>
      <ListItem number={3}>{t("onboarding:wrapping_key_init.step3")}</ListItem>
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

export default withTranslation()(ConfigurationWrapping);
