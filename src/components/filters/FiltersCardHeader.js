// @flow

import React, { PureComponent } from "react";
import { FaSearch } from "react-icons/fa";

import colors from "shared/colors";

import Box from "components/base/Box";
import Text from "components/base/Text";

type Props = {
  title: string,
  subtitle: string
};

class FiltersCardHeader extends PureComponent<Props> {
  render() {
    const { title, subtitle } = this.props;
    return (
      <Box horizontal align="center" flow={20} p={20}>
        <Box noShrink>
          <FaSearch size={25} color={colors.mediumGrey} />
        </Box>
        <Box grow>
          <Text header color={colors.shark}>
            {title}
          </Text>
          <Text small color={colors.mediumGrey}>
            {subtitle}
          </Text>
        </Box>
      </Box>
    );
  }
}

export default FiltersCardHeader;
