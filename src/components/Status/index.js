// @flow

import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";

import Box from "components/base/Box";
import Text from "components/base/Text";

import colors, { opacity, darken } from "shared/colors";

import type { Translate } from "data/types";

const BG_BY_STATUS = {
  ABORTED: opacity(colors.grenade, 0.1),
  REVOKED: opacity(colors.grenade, 0.1),
  ACCESS_SUSPENDED: opacity(colors.grenade, 0.1),
  DELETED: opacity(colors.grenade, 0.1),
  BLOCKED: "hsl(0, 0%, 85%)",
  CREATION_ABORTED: opacity(colors.grenade, 0.1),
  APPROVED: opacity(colors.green, 0.1),
  SUBMITTED: opacity(colors.green, 0.1),
  ACTIVE: opacity(colors.green, 0.1),
  MIGRATED: opacity("violet", 0.1),
  HSM_COIN_UPDATED: opacity("violet", 0.1),
  PENDING: opacity(colors.ocean, 0.1),
  PENDING_APPROVAL: opacity(colors.ocean, 0.1),
  PENDING_UPDATE: opacity(colors.ocean, 0.1),
  AWAITING_APPROVAL: opacity(colors.blue_orange, 0.1),
  PENDING_REVOCATION_APPROVAL: opacity(colors.ocean, 0.1),
  PENDING_VIEW_ONLY: opacity(colors.ocean, 0.1),
  PENDING_MIGRATED: opacity(colors.ocean, 0.1),
  PENDING_REVOCATION: opacity(colors.ocean, 0.1),
  PENDING_REGISTRATION: opacity(colors.ocean, 0.1),
  VIEW_ONLY: colors.lightGrey,
};

const COLOR_BY_STATUS = {
  ABORTED: colors.grenade,
  REVOKED: colors.grenade,
  ACCESS_SUSPENDED: colors.grenade,
  DELETED: colors.grenade,
  BLOCKED: "hsl(0, 0%, 25%)",
  CREATION_ABORTED: colors.grenade,
  APPROVED: darken(colors.green, 0.2),
  SUBMITTED: darken(colors.green, 0.2),
  ACTIVE: darken(colors.green, 0.2),
  MIGRATED: "violet",
  HSM_COIN_UPDATED: "violet",
  PENDING: darken(colors.ocean, 0.5),
  PENDING_APPROVAL: darken(colors.ocean, 0.5),
  PENDING_UPDATE: darken(colors.ocean, 0.5),
  PENDING_VIEW_ONLY: darken(colors.ocean, 0.5),
  AWAITING_APPROVAL: darken(colors.blue_orange, 0.5),
  PENDING_REVOCATION_APPROVAL: darken(colors.ocean, 0.5),
  PENDING_REVOCATION: darken(colors.ocean, 0.5),
  PENDING_MIGRATED: darken(colors.ocean, 0.5),
  PENDING_REGISTRATION: darken(colors.ocean, 0.5),
  VIEW_ONLY: colors.steel,
};

type Props = {
  t: Translate,
  status: string,
  textOnly?: boolean,
  size?: "big" | "normal",
};

export const translateStatus = (status: string, t: string => string) => {
  const translation = t(`entityStatus:${status}`);
  if (translation !== `entityStatus:${status}`) {
    // It is translated
    return translation;
  }
  return status;
};

class Status extends PureComponent<Props> {
  getStr = () => {
    const { t, status } = this.props;
    return translateStatus(status, t);
  };

  render() {
    const { status, textOnly, size } = this.props;

    const str = this.getStr();
    if (textOnly) return str;

    const bg = BG_BY_STATUS[status] || "white";
    const color = COLOR_BY_STATUS[status] || "inherit";

    return (
      <Box
        flow={5}
        horizontal
        align="center"
        inline
        px={5}
        bg={bg}
        color={color}
        borderRadius={3}
      >
        <Text small={size !== "big"} style={styles.text}>
          {str}
        </Text>
      </Box>
    );
  }
}

const styles = {
  text: {
    whiteSpace: "nowrap",
  },
};

export default withTranslation()(Status);
