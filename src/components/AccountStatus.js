// @flow

import React, { PureComponent } from "react";
import { translate } from "react-i18next";

import Box from "components/base/Box";
import Text from "components/base/Text";

import colors, { opacity, darken } from "shared/colors";

import type { Translate, Account } from "data/types";

const BG_BY_STATUS = {
  APPROVED: opacity(colors.ocean, 0.1)
};

const COLOR_BY_STATUS = {
  APPROVED: darken(colors.ocean, 0.2)
};

type Props = {
  t: Translate,
  account: Account,
  textOnly?: boolean
};

class AccountStatus extends PureComponent<Props> {
  getStr = () => {
    const { t, account } = this.props;
    const translation = t(`accountStatus:${account.status}`);
    if (translation !== `accountStatus:${account.status}`) {
      // It is translated
      return translation;
    }
    return account.status;
  };

  render() {
    const { account, textOnly } = this.props;

    const str = this.getStr();
    if (textOnly) return str;

    const bg = BG_BY_STATUS[account.status] || "white";
    const color = COLOR_BY_STATUS[account.status] || "inherit";

    return (
      <Box inline px={5} bg={bg} color={color} borderRadius={3}>
        <Text small>{str}</Text>
      </Box>
    );
  }
}

export default translate()(AccountStatus);
