// @flow

import React, { PureComponent } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";

type Props = {
  children: React$Node,
  classes: { [_: $Keys<typeof styles>]: string },
  className?: string,

  // style modifiers
  small?: boolean,
  inline?: boolean,
  large?: boolean,
  header?: boolean,
  uppercase?: boolean,
  bold?: boolean,
  italic?: boolean
};

const styles = {
  base: {
    fontFamily: "'Open Sans', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 13,
    lineHeight: 1.75
  },
  large: {
    fontSize: 16
  },
  header: {
    fontSize: 18
  },
  small: {
    fontSize: 11
  },
  uppercase: {
    textTransform: "uppercase"
  },
  bold: {
    fontWeight: "bold"
  },
  italic: {
    fontStyle: "italic"
  },
  inline: {
    display: "inline-block"
  }
};

class Text extends PureComponent<Props> {
  render() {
    const {
      children,
      classes,
      small,
      large,
      header,
      uppercase,
      bold,
      italic,
      inline,
      className,
      ...props
    } = this.props;
    return (
      <div
        className={cx(classes.base, className, [
          small && classes.small,
          large && classes.large,
          header && classes.header,
          bold && classes.bold,
          italic && classes.italic,
          uppercase && classes.uppercase,
          inline && classes.inline
        ])}
        {...props}
      >
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(Text);
