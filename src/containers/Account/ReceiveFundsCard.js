//@flow
import React, { Component } from "react";
import Card from "components/Card";
import { withStyles } from "material-ui/styles";
import colors from "shared/colors";
import QRCode from "components/QRCode";

const styles = {
  card: {
    height: 218,
    marginLeft: 20
  },
  base: {
    "& h4": {
      color: colors.lead,
      fontWeight: "600",
      margin: "0",
      padding: "0",
      fontSize: "10px",
      textTransform: "uppercase"
    }
  },
  right: {
    marginLeft: "130px",
    marginTop: "-2px",
    padding: "0"
  },
  left: {
    float: "left"
  },
  hash: {
    fontSize: "13px",
    wordWrap: "break-word"
  },
  info: {
    color: colors.lead,
    fontSize: "11px",
    maxWidth: "482px",
    lineHeight: "1.82"
  }
};

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  address: string
};

class ReceiveFundsCard extends Component<Props> {
  render() {
    const { address, classes } = this.props;
    return (
      <div className={classes.base}>
        <Card title="Receive Funds" className={classes.card}>
          <div className={classes.left}>
            <QRCode hash={address} size={90} />
          </div>
          <div className={classes.right}>
            <h4>current address</h4>
            <p className={classes.hash}>{address}</p>
            <p className={classes.info}>
              A new address is generated when a first payment is received on the
              current address. Previous addresses remain valid and do not
              expire.
            </p>
          </div>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ReceiveFundsCard);
//   queries: {
//     account: AccountQuery
//   },
//   propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
//   optimisticRendering: true,
//   RenderError,
//   RenderLoading
// });
