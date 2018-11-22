//@flow
import React, { Component, PureComponent } from "react";
import ExpandableText from "components/ExpandableText";
import connectData from "restlay/connectData";
import ModalLoading from "components/ModalLoading";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import CurrenciesQuery from "api/queries/CurrenciesQuery";
import classnames from "classnames";
import type { Currency } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/react";

const allCurrencies: Array<CryptoCurrency> = listCryptoCurrencies(true);

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
  currencies: Array<Currency>,
  currency: CryptoCurrency, // FIXME this should just be the currency.name for a better normalization
  onSelect: (cur: CryptoCurrency) => void, // SAME
  classes: Object
}> {
  render() {
    const { props } = this;
    const { currencies, currency, onSelect, classes } = props;
    // TODO migrate to use material-ui MenuList

    return (
      <div className={classes.base}>
        {allCurrencies
          .filter(
            currency =>
              currencies.findIndex(cur => cur.name === currency.id) > -1
          )
          .map(cur => {
            const Icon = getCryptoCurrencyIcon(cur);
            const currency_gate = currencies.find(curr => curr.name === cur.id);
            return (
              <div
                onClick={() => {
                  if (currency_gate && !currency_gate.issue_message) {
                    onSelect(cur);
                  }
                }}
                role="button"
                tabIndex="0"
                key={cur.name}
                className={classnames(classes.row, {
                  [classes.selected]: currency && currency.name === cur.name,
                  [classes.disabled]:
                    currency_gate && currency_gate.issue_message
                })}
              >
                <div className="wrapper">
                  {Icon ? (
                    <CurrencyIcon
                      Icon={Icon}
                      classe={classes.icon}
                      color={cur.color}
                    />
                  ) : (
                    "-"
                  )}
                  <span className={classes.name}>{cur.name}</span>
                  <span className={classes.short}>{cur.ticker}</span>
                </div>
                {currency_gate &&
                  currency_gate.issue_message && (
                    <ExpandableText
                      className={classes.issue}
                      size={45}
                      text="Bitcoin Cash service has been suspended due to hard fork. Further announcements will follow."
                    />
                  )}
              </div>
            );
          })}
      </div>
    );
  }
}

const styleLoading = {
  base: {
    height: 440,
    width: "auto"
  }
};
const Loading = withStyles(styleLoading)(({ classes }) => (
  <ModalLoading className={classes.base} />
));

export default connectData(withStyles(styles)(AccountCreationCurrencies), {
  queries: {
    currencies: CurrenciesQuery
  },
  RenderLoading: Loading
});
