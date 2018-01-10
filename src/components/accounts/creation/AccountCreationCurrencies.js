//@flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import ModalLoading from "components/ModalLoading";
import CurrenciesQuery from "api/queries/CurrenciesQuery";
import classnames from "classnames";
import type { Currency } from "data/types";
import { withStyles } from "material-ui/styles";
import colors from "shared/colors";
import iconsSprite from "assets/img/icon-currencies.png";

const styles = {
  base: {
    marginTop: "-10px"
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
      transform: "width 0.2s ease"
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
    textTransform: "capitalize",
    "&:before": {
      content: ' ""',
      display: "inline-block",
      borderRadius: "8px",
      width: "23px",
      height: "23px",
      verticalAlign: "middle",
      marginRight: "20px",
      backgroundImage: `url(${iconsSprite})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: " 23px"
    },
    "&.bitcoin": {
      "&:before": {
        backgroundPosition: "-2.5px -23px"
      }
    },
    "&.dogecoin": {
      "&:before": {
        backgroundPosition: "-2.5px -160px"
      }
    },
    "&.dash": {
      "&:before": {
        backgroundPosition: "-2.5px -115.5px"
      }
    },
    "&.ethereum": {
      "&:before": {
        backgroundPosition: "-2.5px -183.5px"
      }
    },
    "&.ethereum-classic": {
      "&:before": {
        backgroundPosition: "-2.5px -203.5px"
      }
    },
    "&.litecoin": {
      "&:before": {
        backgroundPosition: "-2.5px -340px"
      }
    }
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
  }
};

const getCurrencyClassName = (name: string) => {
  return name
    .split(" ")
    .join("-")
    .toLowerCase();
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
    // TODO migrate to use material-ui MenuList
    console.log("currency prop not used yet: ", currency); // eslint-disable-line no-console

    return (
      <div className={classes.base}>
        {currencies.map(cur => (
          <div
            onClick={() => onSelect(cur)}
            role="button"
            tabIndex="0"
            key={cur.units[0].name}
            className={classnames(classes.row, {
              [classes.selected]: currency && currency.units[0].name === cur.units[0].name
            })}
          >
            <div className="wrapper">
              <span className={classnames(classes.name, getCurrencyClassName(cur.units[0].name))}>
                {cur.units[0].name}
              </span>
              <span className={classes.short}>{cur.units[0].symbol}</span>
            </div>
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
