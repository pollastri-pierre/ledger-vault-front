// @flow

import React, { PureComponent } from "react";
import { translate } from "react-i18next";

import Box from "components/base/Box";
import Text from "components/base/Text";

import colors, { opacity, darken } from "shared/colors";

import type { Translate } from "data/types";

const BG_BY_STATUS = {
  APPROVED: opacity(colors.ocean, 0.1),
  VIEW_ONLY: colors.cream
};

const COLOR_BY_STATUS = {
  APPROVED: darken(colors.ocean, 0.2),
  VIEW_ONLY: colors.steel
};

type Props = {
  t: Translate,
  status: string,
  textOnly?: boolean
};

class EntityStatus extends PureComponent<Props> {
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

export default translate()(EntityStatus);
