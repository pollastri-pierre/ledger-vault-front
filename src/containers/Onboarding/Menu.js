//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import LabelLink from "components/LabelLink";
import MenuLinkOnboarding from "./MenuLinkOnboarding";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { isViewSelected } from "redux/modules/onboarding";

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
      <MenuLinkOnboarding
        heading
        selected={onboarding.state === "EMPTY_PARTITION"}
      >
        <span style={{ textTransform: "uppercase" }}>
          {t("onboarding:menu.welcome")}
        </span>
      </MenuLinkOnboarding>
      <LabelLink
        label={t("onboarding:menu.wrapping_key.title")}
        selected={[2, 3, 4, 5, 6].indexOf(onboarding.currentStep) > -1}
      />
      <MenuLinkOnboarding
        selected={onboarding.state === "WRAPPING_KEY_PREREQUISITES"}
      >
        <span>{t("onboarding:menu.wrapping_key.pre")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "WRAPPING_KEY_CONFIGURATION"}
      >
        <span>{t("onboarding:menu.wrapping_key.conf")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding selected={onboarding.state === "WRAPPING_KEY_BACKUP"}>
        <span>{t("onboarding:menu.wrapping_key.back")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "WRAPPING_KEY_SIGN_IN"}
      >
        <span>{t("onboarding:menu.wrapping_key.sign")}</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 10, marginBottom: 7 }}>
        <LabelLink
          label={t("onboarding:menu.administrators.title")}
          selected={[2, 3, 4, 5, 6].indexOf(onboarding.currentStep) > -1}
        />
      </div>
      <MenuLinkOnboarding selected={isViewSelected("ADMIN_PRE", onboarding)}>
        <span>{t("onboarding:menu.administrators.prerequisite")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding selected={isViewSelected("ADMIN_CONF", onboarding)}>
        <span>{t("onboarding:menu.administrators.configuration")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={isViewSelected("ADMIN_REGISTER", onboarding)}
      >
        <span>
          {t("onboarding:menu.administrators.registration")} ({nbMember})
        </span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding selected={isViewSelected("ADMIN_SCHEME", onboarding)}>
        <span>{t("onboarding:menu.administrators.scheme")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding selected={isViewSelected("SEED_SIGN", onboarding)}>
        <span>{t("onboarding:menu.master_seed.signin")}</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 20 }}>
        <LabelLink
          label={t("onboarding:menu.master_seed.title")}
          selected={[7, 8, 9, 10, 11].indexOf(onboarding.currentStep) > -1}
        />
      </div>
      <MenuLinkOnboarding selected={isViewSelected("SEED_PRE", onboarding)}>
        <span>{t("onboarding:menu.master_seed.prerequisite")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding selected={isViewSelected("SEED_CONF", onboarding)}>
        <span>
          {t("onboarding:menu.master_seed.configuration", onboarding)}
        </span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding selected={isViewSelected("SEED_BACK", onboarding)}>
        <span>{t("onboarding:menu.master_seed.backup")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding selected={isViewSelected("SEED_PROV", onboarding)}>
        <span>{t("onboarding:menu.master_seed.provisionning")}</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 5 }}>
        <MenuLinkOnboarding
          selected={isViewSelected("CONFIRMATION", onboarding)}
        >
          <span style={{ textTransform: "uppercase" }}>
            {t("onboarding:menu.confirmation")}
          </span>
        </MenuLinkOnboarding>
      </div>
    </div>
  );
};

export default withStyles(styles)(translate()(Menu));
