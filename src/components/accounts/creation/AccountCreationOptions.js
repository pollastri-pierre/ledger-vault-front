//@flow
import React from "react";
import BadgeCurrency from "../../BadgeCurrency";
import type { Currency } from "../../../data/types";
import TextField from "material-ui/TextField";
import { withStyles } from "material-ui/styles";

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
    paddingBottom: 10
  }
};
function AccountCreationOptions(props: {
  currency: Currency,
  name: string,
  changeName: Function,
  classes: Object
}) {
  const { classes } = props;
  return (
    <div>
      <label htmlFor="name" className={classes.title}>
        Name
      </label>
      <div className={classes.relative}>
        <BadgeCurrency currency={props.currency} className={classes.badge} />
        <TextField
          value={props.name}
          onChange={e => props.changeName(e.target.value)}
          placeholder="Account's name"
          InputProps={{ className: classes.input }}
          fullWidth
        />
      </div>
    </div>
  );
}

export default withStyles(styles)(AccountCreationOptions);
