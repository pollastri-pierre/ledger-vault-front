//@flow
import React from "react";
import { withStyles } from "material-ui/styles";
import Plus from "components/icons/full/Plus";
import colors from "shared/colors";
import Card from "components/Card";
import { Link } from "react-router-dom";

const styles = {
  base: {
    // textAlign: "center"
  },
  icon: {
    width: 16,
    fill: "black",
    display: "inline-block",
    marginRight: 5,
    verticalAlign: "middle"
  },
  link: {
    marginTop: 20,
    display: "block",
    textDecoration: "none",
    color: colors.ocean,
    fontWeight: 600,
    textTransform: "uppercase"
  },
  linkLabel: {
    color: colors.ocean,
    fontWeight: 600,
    textTransform: "uppercase",
    display: "inline-block",
    verticalAlign: "middle"
  }
};
const DashboardPlaceholder = ({
  classes
}: {
  classes: { [$Keys<typeof styles>]: string }
}) => (
  <div className={classes.base}>
    <Card title="No account">
      You don't have any account yet. In order to start sending and receiving
      transactions, you need to create an account.{" "}
      <strong>Then this account will need to be approved by the quorum.</strong>
      <Link to={`dashboard/new-account`} className={classes.link}>
        <Plus className={classes.icon} />
        <div className={classes.linkLabel}>account</div>
      </Link>
    </Card>
  </div>
);

export default withStyles(styles)(DashboardPlaceholder);
