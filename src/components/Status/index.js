// @flow

import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";

import Box from "components/base/Box";
import Text from "components/base/Text";

import colors, { darken } from "shared/colors";

import type { Translate } from "data/types";

const BG_BY_STATUS = {
  ABORTED: colors.palePink,
  REVOKED: colors.palePink,
  ACCESS_SUSPENDED: colors.palePink,
  DELETED: colors.palePink,
  CREATION_ABORTED: colors.palePink,
  BLOCKED: colors.argile,
  EXPIRED: colors.argile,
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

  // Derived statuses
  DERIVED_TX_CONFIRMED: colors.paleGreen,
  DERIVED_TX_UNCONFIRMED: colors.palePink,
};

const CUSTOM_COLOR = {
  ABORTED: darken(colors.paleRed, 0.7),
  REVOKED: darken(colors.paleRed, 0.7),
  ACCESS_SUSPENDED: darken(colors.paleRed, 0.7),
  DELETED: darken(colors.paleRed, 0.7),
  CREATION_ABORTED: darken(colors.paleRed, 0.7),
  DERIVED_TX_UNCONFIRMED: darken(colors.paleRed, 0.7),
};

function getColorByBg(status: any) {
  return CUSTOM_COLOR[status] || darken(BG_BY_STATUS[status], 0.7);
}

type Props = {
  t: Translate,
  status: string,
  derivedStatus?: string,
  textOnly?: boolean,
  children?: React$Node,
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
    const {
      status,
      textOnly,
      size,
      derivedStatus,
      children,
      ...p
    } = this.props;
    const str = this.getStr();
    if (textOnly) return str;
    const bg =
      (derivedStatus && BG_BY_STATUS[derivedStatus]) ||
      BG_BY_STATUS[status] ||
      "white";
    const color = getColorByBg(status || derivedStatus);

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
        {...p}
      >
        <Text
          fontWeight="semiBold"
          size={size !== "big" ? "small" : null}
          noWrap
        >
          {derivedStatus ? children : str}
        </Text>
      </Box>
    );
  }
}

export default withTranslation()(Status);
