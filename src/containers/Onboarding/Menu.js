//@flow
import React from "react";
import colors from "shared/colors";
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
  nbSharedOwner,
  t,
  onboarding
}: {
  classes: { [$Keys<typeof styles>]: string },
  onboarding: Object,
  nbSharedOwner: number,
  t: Translate,
  nbMember: number
}) => {
  return (
    <div className={classes.menu}>
      <div style={{ marginBottom: 10 }}>
        <MenuLinkOnboarding
          heading
          selected={onboarding.state === "EMPTY_PARTITION"}
        >
          <span style={{ textTransform: "uppercase" }}>
            {t("onboarding:menu.welcome")}
          </span>
        </MenuLinkOnboarding>
      </div>
      <LabelLink
        label={t("onboarding:menu.wrapping_key.title")}
        selected={onboarding.state.startsWith("WRAPPING")}
      />
      <MenuLinkOnboarding
        selected={onboarding.state === "WRAPPING_KEY_PREREQUISITES"}
        color={colors.blue_orange}
      >
        <span>{t("onboarding:menu.wrapping_key.pre")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "WRAPPING_KEY_CONFIGURATION"}
        color={colors.blue_orange}
      >
        <span>{t("onboarding:menu.wrapping_key.conf")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "WRAPPING_KEY_BACKUP"}
        color={colors.blue_orange}
      >
        <span>{t("onboarding:menu.wrapping_key.back")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "WRAPPING_KEY_SIGN_IN"}
        color={colors.blue_orange}
      >
        <span>{t("onboarding:menu.wrapping_key.sign")}</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 10, marginBottom: 7 }}>
        <LabelLink
          label={t("onboarding:menu.administrators.title")}
          selected={onboarding.state.startsWith("ADMINISTRATORS")}
        />
      </div>
      <MenuLinkOnboarding
        selected={onboarding.state === "ADMINISTRATORS_PREREQUISITE"}
        color={colors.blue_green}
      >
        <span>{t("onboarding:menu.administrators.prerequisite")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "ADMINISTRATORS_CONFIGURATION"}
        color={colors.blue_green}
      >
        <span>{t("onboarding:menu.administrators.configuration")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "ADMINISTRATORS_REGISTRATION"}
        color={colors.blue_green}
      >
        <span>
          {t("onboarding:menu.administrators.registration")} ({nbMember})
        </span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "ADMINISTRATORS_SCHEME_CONFIGURATION"}
        color={colors.blue_green}
      >
        <span>{t("onboarding:menu.administrators.scheme")}</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 20 }}>
        <LabelLink
          label={t("onboarding:menu.master_seed.title")}
          selected={
            onboarding.state.startsWith("MASTER_SEED") ||
            onboarding.state.startsWith("SHARED_OWNER")
          }
        />
      </div>
      <MenuLinkOnboarding
        selected={onboarding.state === "MASTER_SEED_PREREQUISITE"}
        color={colors.blue_red}
      >
        <span>{t("onboarding:menu.master_seed.prerequisite")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "MASTER_SEED_CONFIGURATION"}
        color={colors.blue_red}
      >
        <span>
          {t("onboarding:menu.master_seed.configuration", onboarding)}
        </span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "MASTER_SEED_BACKUP"}
        color={colors.blue_red}
      >
        <span>{t("onboarding:menu.master_seed.backup")}</span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "SHARED_OWNER_REGISTRATION"}
        color={colors.blue_red}
      >
        <span>
          {t("onboarding:menu.shared_owner_registration.registration")} ({nbSharedOwner})
        </span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "SHARED_OWNER_VALIDATION"}
        color={colors.blue_red}
      >
        <span>
          {t("onboarding:menu.shared_owner_registration.confirmation")}
        </span>
      </MenuLinkOnboarding>
      <MenuLinkOnboarding
        selected={onboarding.state === "MASTER_SEED_GENERATION"}
        color={colors.blue_red}
      >
        <span>{t("onboarding:menu.master_seed.provisionning")}</span>
      </MenuLinkOnboarding>
      <div style={{ marginTop: 5 }}>
        <MenuLinkOnboarding selected={onboarding.state === "COMPLETE"}>
          <span style={{ textTransform: "uppercase" }}>
            {t("onboarding:menu.confirmation")}
          </span>
        </MenuLinkOnboarding>
      </div>
    </div>
  );
};

export default withStyles(styles)(translate()(Menu));
