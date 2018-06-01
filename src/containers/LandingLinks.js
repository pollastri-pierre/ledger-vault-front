//@flow
import React, { PureComponent } from "react";
import { withStyles } from "material-ui/styles";
import colors from "shared/colors";
import banner from "assets/img/section4@2x.jpg";

const styles = {
  base: {
    background: `url(${banner})`,
    width: "400px",
    height: "200px",
    backgroundSize: "cover",
    color: "white",
    marginTop: 20,
    padding: 20,
    textTransform: "uppercase",
    "& p": {
      fontWeight: 600,
      lineHeight: "26px"
    }
  },
  actions: {
    display: "flex",
    marginTop: 40,
    justifyContent: "space-between"
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: 10,
    width: 168,
    fontSize: 14,
    textAlign: "center",
    background: colors.ocean,
    display: "inline-block"
  }
};
type Props = {
  classes: { [_: $Keys<typeof styles>]: string }
};

class LandingLinks extends PureComponent<Props> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.base}>
        <p>
          interested by the ledger vault solution to secure you cryptoassets ?
        </p>
        <div className={classes.actions}>
          <a href="https://www.ledger.fr/vault" className={classes.link}>
            learn more
          </a>
          <a
            href="https://www.ledger.fr/vault/contact-form/"
            className={classes.link}
          >
            contact us more
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LandingLinks);
