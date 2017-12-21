//@flow
import React, { Component } from "react";
import connectData from "../../../restlay/connectData";
import ModalLoading from "../../../components/ModalLoading";
import CurrenciesQuery from "../../../api/queries/CurrenciesQuery";
import classnames from "classnames";
import type { Currency } from "../../../data/types";
import { withStyles } from "material-ui/styles";
import colors from "../../../shared/colors";

const styles = {
  base: {
    marginTop: "-10px"
  },
  row: {
    outline: "none",
    cursor: "pointer",
    height: "63px",
    lineHeight: "63px",
    borderBottom: "1px solid #eeeeee",
    opacity: "0.5",
    position: "relative",
    transition: "all 500ms ease;",
    cursor: "pointer",
    "&:before": {
      content: '""',
      left: "-40px",
      backgroundColor: colors.ocean,
      width: "0px",
      height: "26px",
      position: "absolute",
      bottom: "calc(50% - 13px)",
      opacity: "1",
      transform: "width 0.2s ease"
    },
    "&:hover": {
      opacity: "1"
    },
    "&:hover:before": {
      width: "5px"
    }
  },
  name: {
    fontSize: "13px"
  },
  short: {
    fontSize: "10px",
    float: "right",
    color: colors.lead
  }
};

class AccountCreationCurrencies extends Component<{
  currencies: Array<Currency>,
  currency: Currency, // FIXME this should just be the currency.name for a better normalization
  onSelect: (cur: Currency) => void, // SAME
  classes: Object
}> {
  render() {
    const { props } = this;
    const { currencies, currency, onSelect, classes } = props;
    return (
      <div className={classes.base}>
        {currencies.map(cur => (
          <div
            onClick={() => onSelect(cur)}
            role="button"
            tabIndex="0"
            key={cur.units[0].name}
            className={classnames(classes.row)}
          >
            <span className={classes.name}>{cur.units[0].name}</span>
            <span className={classes.short}>{cur.units[0].symbol}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default connectData(withStyles(styles)(AccountCreationCurrencies), {
  queries: {
    currencies: CurrenciesQuery
  },
  RenderLoading: ModalLoading
});
