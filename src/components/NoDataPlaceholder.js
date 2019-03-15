// @flow

import React, { Component } from "react";

import colors from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";

import imgEmptyState from "assets/img/empty-state.svg";

const styles = {
  container: {
    height: 250,
  },
  image: {
    marginRight: -30,
  },
};

class NoDataPlaceholder extends Component<{
  title: string,
}> {
  render() {
    const { title } = this.props;
    return (
      <Box align="center" justify="center" flow={20} style={styles.container}>
        <img src={imgEmptyState} alt="" style={styles.image} />
        <Text color={colors.steel}>{title}</Text>
      </Box>
    );
  }
}

export default NoDataPlaceholder;
