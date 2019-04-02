// @flow
import React, { Component, PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import Text from "components/Text";
import colors from "shared/colors";

type HeaderProps = {
  header: React$Node,
  classes: { [_: $Keys<typeof headerStyles>]: string }
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
    paddingBottom: 20
  }
};

type TitleProps = {
  title: React$Node,
  classes: { [_: $Keys<typeof titleStyles>]: string }
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
    padding: "10px 0"
  }
};

type RowProps = {
  label: React$Node,
  children: React$Node,
  onClick: ?Function,
  classes: { [_: $Keys<typeof rowStyles>]: string }
};

class SectionRowComponent extends PureComponent<RowProps> {
  render() {
    const { label, children, onClick, classes } = this.props;
    return (
      <div
        className={classes.rowContainer}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        <Text uppercase small className={classes.label}>
          {label}
        </Text>
        {children}
      </div>
    );
  }
}

const rowStyles = {
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "15px 0"
  },
  label: {
    color: colors.shark
  }
};
const SectionHeader = withStyles(headerStyles)(SectionHeaderComponent);
const SectionTitle = withStyles(titleStyles)(SectionTitleComponent);
const SectionRow = withStyles(rowStyles)(SectionRowComponent);

export { SectionHeader, SectionTitle, SectionRow };
