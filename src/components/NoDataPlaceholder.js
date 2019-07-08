// @flow

import React, { Component } from "react";

import colors from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";

import imgEmptyState from "assets/img/empty-state.svg";
import imgEmptyStateHappy from "assets/img/empty-state-happy.svg";

const styles = {
  container: {
    height: 250,
    color: colors.steel,
    background: "#fafafa",
    borderRadius: 2,
  },
  image: {
    width: 80,
    marginRight: -10,
  },
};

class NoDataPlaceholder extends Component<{
  title: React$Node,
  happy?: boolean,
}> {
  render() {
    const { title, happy } = this.props;
    return (
      <Box align="center" justify="center" flow={20} style={styles.container}>
        <img
          src={happy ? imgEmptyStateHappy : imgEmptyState}
          alt=""
          style={styles.image}
        />
        <Text color={colors.textLight}>{title}</Text>
      </Box>
    );
  }
}

export default NoDataPlaceholder;
