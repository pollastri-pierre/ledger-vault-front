// @flow

import React, { PureComponent } from "react";
import { translate } from "react-i18next";

import Box from "components/base/Box";
import Text from "components/base/Text";

import colors, { opacity, darken } from "shared/colors";

import type { Translate } from "data/types";

const BG_BY_STATUS = {
  ABORTED: opacity(colors.grenade, 0.1),
  APPROVED: opacity(colors.green, 0.1),
  PENDING_APPROVAL: opacity(colors.blue_orange, 0.1),
  VIEW_ONLY: colors.cream
};

const COLOR_BY_STATUS = {
  ABORTED: colors.grenade,
  APPROVED: darken(colors.green, 0.2),
  PENDING_APPROVAL: darken(colors.blue_orange, 0.5),
  VIEW_ONLY: colors.steel
};

type Props = {
  t: Translate,
  status: string,
  textOnly?: boolean
};

class Status extends PureComponent<Props> {
  getStr = () => {
    const { t, status } = this.props;
    const translation = t(`entityStatus:${status}`);
    if (translation !== `entityStatus:${status}`) {
      // It is translated
      return translation;
    }
    return status;
  };

  render() {
    const { status, textOnly } = this.props;

    const str = this.getStr();
    if (textOnly) return str;

    const bg = BG_BY_STATUS[status] || "white";
    const color = COLOR_BY_STATUS[status] || "inherit";

    return (
      <Box inline px={5} bg={bg} color={color} borderRadius={3}>
        <Text small uppercase>
          {str}
        </Text>
      </Box>
    );
  }
}

export default translate()(Status);
