//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import LabelLink from "components/LabelLink";
import MenuLinkOnboarding from "./MenuLinkOnboarding";
import type { Translate } from "data/types";
import { translate } from "react-i18next";

const styles = {
  menu: {
    flex: 0.6,
    width: 161,
    position: "relative",
    "&:after": {
      content: '""',
      background: "#eeeeee",
      width: 1,
      height: 436,
      display: "block",
      position: "absolute",
      right: 42,
      top: 0
    }
  }
};
const Menu = ({
  classes,
  nbMember,
  t,
  onboarding
}: {
  classes: { [$Keys<typeof styles>]: string },
  onboarding: Object,
  t: Translate,
  nbMember: number
}) => {
  return (
    <div className={classes.menu}>
      <MenuLinkOnboarding step={0} allowed={onboarding.currentStep < 2} heading>
        <span style={{ textTransform: "uppercase" }}>
          {t("onboarding:menu.welcome")}
        </span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={1} allowed={false} heading>
        <span style={{ textTransform: "uppercase" }}>
          {t("onboarding:menu.authentication")}
        </span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 10, marginBottom: 7 }}>
        <LabelLink
          label={t("onboarding:menu.administrators.title")}
          selected={[2, 3, 4, 5, 6].indexOf(onboarding.currentStep) > -1}
        />
      </div>
      <MenuLinkOnboarding step={2} allowed={false}>
        <span>{t("onboarding:menu.administrators.prerequisite")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={3} allowed={false}>
        <span>{t("onboarding:menu.administrators.configuration")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={4} allowed={false}>
        <span>
          {t("onboarding:menu.administrators.registration")} ({nbMember})
        </span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={5} allowed={false}>
        <span>{t("onboarding:menu.administrators.scheme")}</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 20 }}>
        <LabelLink
          label={t("onboarding:menu.master_seed.title")}
          selected={[7, 8, 9, 10, 11].indexOf(onboarding.currentStep) > -1}
        />
      </div>
      <MenuLinkOnboarding step={6}>
        <span>{t("onboarding:menu.master_seed.signin")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={7}>
        <span>{t("onboarding:menu.master_seed.prerequisite")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={8}>
        <span>{t("onboarding:menu.master_seed.configuration")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={9}>
        <span>{t("onboarding:menu.master_seed.backup")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding step={10}>
        <span>{t("onboarding:menu.master_seed.provisionning")}</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 5 }}>
        <MenuLinkOnboarding step={11}>
          <span style={{ textTransform: "uppercase" }}>
            {t("onboarding:menu.confirmation")}
          </span>
        </MenuLinkOnboarding>
      </div>
    </div>
  );
};

export default withStyles(styles)(translate()(Menu));
