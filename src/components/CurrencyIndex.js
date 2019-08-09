// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Text from "components/base/Text";
import colors from "shared/colors";

const styles = {
  base: {
    display: "flex",
    flexDirection: "row",
  },
  index: {
    color: colors.lead,
    marginLeft: 5,
  },
};

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  currency: string,
  index: number,
};

class CurrencyIndex extends Component<Props> {
  render() {
    const { currency, index, classes } = this.props;
    return (
      <div className={classes.base}>
        <Text>{currency}</Text>
        <Text className={classes.index}> #{index}</Text>
      </div>
    );
  }
}

export default withStyles(styles)(CurrencyIndex);
