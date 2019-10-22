// @flow

import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";

import Box from "components/base/Box";
import Text from "components/base/Text";

import colors, { darken } from "shared/colors";

import type { Translate } from "data/types";

const BG_BY_STATUS = {
  ABORTED: colors.paleRed,
  REVOKED: colors.paleRed,
  ACCESS_SUSPENDED: colors.paleRed,
  DELETED: colors.paleRed,
  BLOCKED: colors.argile,
  EXPIRED: colors.argile,
  CREATION_ABORTED: colors.paleRed,
  APPROVED: colors.paleGreen,
  SUBMITTED: colors.paleGreen,
  ACTIVE: colors.paleGreen,
  MIGRATED: colors.paleViolet,
  HSM_COIN_UPDATED: colors.paleViolet,
  PENDING: colors.paleBlue,
  PENDING_APPROVAL: colors.paleBlue,
  PENDING_UPDATE: colors.paleBlue,
  AWAITING_APPROVAL: colors.paleYellow,
  PENDING_REVOCATION_APPROVAL: colors.paleBlue,
  PENDING_VIEW_ONLY: colors.paleBlue,
  PENDING_MIGRATED: colors.paleBlue,
  PENDING_REVOCATION: colors.paleBlue,
  PENDING_REGISTRATION: colors.paleBlue,
  VIEW_ONLY: colors.argile,
};

function getColorByBg(status: any) {
  return darken(BG_BY_STATUS[status], 0.7) || "inherit";
}

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
    const color = getColorByBg(status);

    return (
      <Box
        flow={5}
        horizontal
        align="center"
        inline
        px={10}
        py={2}
        bg={bg}
        color={color}
        borderRadius={15}
      >
        <Text
          fontWeight="semiBold"
          size={size !== "big" ? "small" : null}
          style={styles.text}
        >
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
