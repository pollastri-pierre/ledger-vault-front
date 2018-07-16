//@flow
import React, { Component } from "react";
import Card from "components/Card";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import QRCode from "components/QRCode";

const styles = {
  card: {},
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
  t: Translate,
  address: string
};

class ReceiveFundsCard extends Component<Props> {
  render() {
    const { address, classes, t } = this.props;
    return (
      <div className={classes.base}>
        <Card title={t("accountView:receive.title")} className={classes.card}>
          <div className={classes.left}>
            <QRCode hash={address} size={90} />
          </div>
          <div className={classes.right}>
            <h4>{t("accountView:receive.addr")}</h4>
            <p className={classes.hash}>{address}</p>
            <p className={classes.info}>{t("accountView:receive.desc")}</p>
          </div>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(translate()(ReceiveFundsCard));
//   queries: {
//     account: AccountQuery
//   },
//   propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
//   optimisticRendering: true,
//   RenderError,
//   RenderLoading
