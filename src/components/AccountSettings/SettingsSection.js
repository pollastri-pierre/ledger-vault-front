// @flow
import React, { Component, PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";

import Text from "components/base/Text";
import Box from "components/base/Box";

import colors from "shared/colors";

type HeaderProps = {
  header: React$Node,
  classes: { [_: $Keys<typeof headerStyles>]: string },
};

class SectionHeaderComponent extends Component<HeaderProps> {
  render() {
    const { header, classes } = this.props;
    return (
      <Text large uppercase className={classes.title}>
        {header}
      </Text>
    );
  }
}
const headerStyles = {
  title: {
    paddingBottom: 20,
  },
};

type TitleProps = {
  title: React$Node,
  classes: { [_: $Keys<typeof titleStyles>]: string },
};
class SectionTitleComponent extends Component<TitleProps> {
  render() {
    const { title, classes } = this.props;
    return (
      <Text bold uppercase className={classes.title}>
        {title}
      </Text>
    );
  }
}
const titleStyles = {
  title: {
    padding: "10px 0",
  },
};

type RowProps = {
  label: React$Node,
  children: React$Node,
  onClick?: Function,
};

class SectionRow extends PureComponent<RowProps> {
  render() {
    const { label, children, onClick } = this.props;
    return (
      <Box
        horizontal
        justify="space-between"
        py={15}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        <Text uppercase small color={colors.shark}>
          {label}
        </Text>
        {children}
      </Box>
    );
  }
}

const SectionHeader = withStyles(headerStyles)(SectionHeaderComponent);
const SectionTitle = withStyles(titleStyles)(SectionTitleComponent);

export { SectionHeader, SectionTitle, SectionRow };
