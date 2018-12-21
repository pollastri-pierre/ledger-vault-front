//@flow
import { translate } from "react-i18next";
import React from "react";
import BadgeCurrency from "../../BadgeCurrency";
import type { Currency, Translate } from "data/types";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  title: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: 20,
    display: "block"
  },
  relative: {
    position: "relative"
  },
  badge: {
    position: "absolute",
    left: 0,
    top: "29%"
  },
  input: {
    paddingLeft: 20,
    color: "black",
    paddingBottom: 10
  }
};
function AccountCreationOptions(props: {
  currency: Currency,
  name: string,
  changeName: Function,
  t: Translate,
  classes: Object
}) {
  const { classes, t } = props;
  return (
    <div>
      <label htmlFor="name" className={classes.title}>
        {t("newAccount:options.name")}
      </label>
      <div className={classes.relative}>
        <BadgeCurrency currency={props.currency} className={classes.badge} />
        <TextField
          value={props.name}
          autoFocus
          onChange={e => props.changeName(e.target.value)}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          InputProps={{ className: classes.input }}
          fullWidth
        />
      </div>
    </div>
  );
}

export default withStyles(styles)(translate()(AccountCreationOptions));
