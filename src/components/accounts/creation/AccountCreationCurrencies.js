//@flow
import React, { Component, PureComponent } from "react";
import CurrenciesQuery from "api/queries/CurrenciesQuery";
import ModalLoading from "components/ModalLoading";
import connectData from "restlay/connectData";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import type { Currency } from "data/types";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/helpers/currencies";
// import {
//   listCryptoCurrencies,
// } from "utils/cryptoCurrencies";
//
// const allCurrencies: Array<CryptoCurrency> = listCryptoCurrencies(true);

const styles = {
  base: {
    marginTop: "-10px",
    maxHeight: 363,
    overflowY: "scroll",
    paddingRight: 20,
    marginRight: -31
  },
  row: {
    outline: "none",
    cursor: "pointer",
    height: "63px",
    lineHeight: "63px",
    position: "relative",
    transition: "all 500ms ease;",
    "& > .wrapper": {
      opacity: "0.5",
      transition: "all 500ms ease;"
    },
    "&:after": {
      content: '""',
      left: 0,
      width: "100%",
      position: "absolute",
      bottom: 0,
      height: 1,
      background: "#eeeeee"
    },
    "&:last-child:after": {
      content: "none"
    },
    "&:before": {
      content: "''",
      left: "-40px",
      backgroundColor: colors.ocean,
      width: "0px",
      height: "26px",
      position: "absolute",
      bottom: "calc(50% - 13px)",
      opacity: "1",
      transition: "width 0.2s ease"
    },
    "&:hover": {
      "& > .wrapper": {
        opacity: "1"
      }
    },
    "&:hover:before": {
      width: "5px"
    }
  },
  name: {
    fontSize: "13px",
    color: "black"
  },
  icon: {
    width: 23,
    height: 23,
    display: "inline-block",
    marginRight: 20,
    borderRadius: 5,
    color: "white",
    lineHeight: "normal",
    textAlign: "center"
  },
  short: {
    fontSize: "10px",
    float: "right",
    color: colors.lead
  },
  selected: {
    "& > .wrapper": {
      opacity: 1
    }
  },
  disabled: {
    opacity: 0.5
  },
  issue: {
    position: "absolute",
    fontSize: 10,
    bottom: -20,
    left: 0
  }
};

class CurrencyIcon extends PureComponent<{
  classe: string,
  color: string,
  Icon: any
}> {
  render() {
    const { classe, color, Icon } = this.props;
    return (
      <div className={classe} style={{ background: color }}>
        <Icon size={13} />
      </div>
    );
  }
}

class AccountCreationCurrencies extends Component<{
  currency: CryptoCurrency, // FIXME this should just be the currency.name for a better normalization
  currencies: Currency[],
  onSelect: (cur: CryptoCurrency) => void, // SAME
  classes: Object
}> {
  render() {
    const { props } = this;
    const { currency, onSelect, currencies, classes } = props;
    // TODO migrate to use material-ui MenuList

    return (
      <div className={classes.base}>
        {currencies.map(cur => {
          const cryptoCurrency = getCryptoCurrencyById(cur.name);
          const Icon = getCryptoCurrencyIcon(cryptoCurrency);
          return (
            <div
              onClick={() => {
                onSelect(cryptoCurrency);
              }}
              role="button"
              tabIndex="0"
              key={cur.name}
              className={classnames(classes.row, {
                [classes.selected]:
                  currency && currency.name === cryptoCurrency.name
              })}
            >
              <div className="wrapper">
                {Icon ? (
                  <CurrencyIcon
                    Icon={Icon}
                    classe={classes.icon}
                    color={cryptoCurrency.color}
                  />
                ) : (
                  "-"
                )}
                <span className={classes.name}>{cur.name}</span>
                <span className={classes.short}>{cur.ticker}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default connectData(withStyles(styles)(AccountCreationCurrencies), {
  RenderLoading: ModalLoading,
  queries: {
    currencies: CurrenciesQuery
  }
});
