// @flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import logoBlack from "assets/img/logo-black.png";
import logoBlack2x from "assets/img/logo-black@2x.png";
import logoBlack3x from "assets/img/logo-black@3x.png";

import logo from "assets/img/logo.png";
import logo2x from "assets/img/logo@2x.png";
import logo3x from "assets/img/logo@3x.png";

const styles = {
  base: {
    width: 100,
    overflow: "hidden",
    "& img": {
      transform: "translateX(-31px)"
    }
  }
};

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  white: boolean
};
class Logo extends PureComponent<Props> {
  render() {
    const { classes, white } = this.props;
    return (
      <div className={classes.base}>
        {!white ? (
          <img
            src={logoBlack}
            srcSet={`${logoBlack2x} 2x, ${logoBlack3x} 3x`}
            alt="Ledger Vault"
          />
        ) : (
          <img
            src={logo}
            srcSet={`${logo2x} 2x, ${logo3x} 3x`}
            alt="Ledger Vault"
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Logo);
