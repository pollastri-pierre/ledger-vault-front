//@flow
import _ from "lodash";
import React, { Component } from "react";
import * as d3 from "d3";
import { withStyles } from "@material-ui/core/styles";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import BadgeCurrency from "components/BadgeCurrency";
import colors from "shared/colors";
import type { Account } from "data/types";
import cx from "classnames";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
const allCurrencies = listCryptoCurrencies(true);

type PieChartData = {
  account: Account,
  balance: number,
  counterValueBalance: number
};

const commonArrowStyle = {
  content: '""',
  display: "block",
  width: 0,
  height: 0,
  position: "absolute"
};

const styles = {
  wrapper: {
    width: "100%",
    textAlign: "center",
    height: "140px"
  },
  centerChart: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)"
  },
  chartWrap: {
    position: "relative",
    svg: {
      overflow: "visible"
    }
  },
  table: {
    width: "100%",
    marginTop: "10px",
    textAlign: "justify"
  },
  disable: {
    opacity: 0.5,
    zIndex: 1
  },
  uppercase: {
    textTransform: "uppercase"
  },
  currency: {
    lineHeight: "23px",
    cursor: "default",
    position: "relative"
  },
  currencyBalance: {
    fontSize: "13px",
    textAlign: "right"
  },
  currencyName: {
    color: colors.mouse,
    fontSize: 10,
    marginLeft: 10,
    fontWeight: 600
  },
  currencyNameDark: {
    color: colors.steel
  },
  percentage: {
    display: "block",
    color: "white",
    fontSize: 16
  },
  tooltip: {
    opacity: 1,
    position: "absolute",
    width: 100,
    height: 70,
    boxShadow:
      "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)",
    zIndex: 10,
    pointerEvents: "none",
    backgroundColor: "currentColor",
    padding: 15,
    "&:before": {
      borderColor: "currentColor"
    }
  },
  tooltipTextWrap: {
    width: "100%",
    height: "100%"
  },
  tooltipText: {
    color: "white",
    fontSize: 13,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    div: {
      overflow: "hidden"
    }
  },
  hide: {
    opacity: 0,
    zIndex: 1
  },
  lookLeft: {
    "&:before": {
      ...commonArrowStyle,
      borderTop: "10px solid transparent !important",
      borderBottom: "10px solid transparent !important",
      borderRight: "10px solid",
      left: -10,
      top: 25
    }
  },
  lookRight: {
    "&:before": {
      ...commonArrowStyle,
      borderTop: "10px solid transparent !important",
      borderBottom: "10px solid transparent !important",
      borderLeft: "10px solid",
      left: 100,
      top: 25
    }
  },
  lookUp: {
    "&:before": {
      ...commonArrowStyle,
      borderLeft: "10px solid transparent !important",
      borderRight: "10px solid transparent !important",
      borderBottom: "10px solid",
      left: 40,
      top: -10
    }
  },
  lookDown: {
    "&:before": {
      ...commonArrowStyle,
      borderLeft: "10px solid transparent !important",
      borderRight: "10px solid transparent !important",
      borderTop: "10px solid",
      left: 40,
      top: 70
    }
  }
};

class PieChart extends Component<
  {
    data: Array<PieChartData>,
    radius: number,
    showCaptions?: boolean,
    showTooltips?: boolean,
    highlightCaptionsOnHover?: boolean,
    tooltipText?: Function,
    captionText?: Function,
    classes: { [_: $Keys<typeof styles>]: string }
  },
  { selected: number }
> {
  state = {
    selected: -1
  };

  svg: ?Element;
  tooltip: ?Element;

  setSelected = (index: number) => {
    this.setState({ selected: index });
  };

  handleMouseOver = (d: *) => {
    this.setSelected(d.index);
  };

  handleMouseOut = () => {
    this.setSelected(-1);
  };

  UNSAFE_componentWillReceiveProps() {
    const { selected } = this.state;
    const { data, radius, classes } = this.props;
    const $svg = this.svg;
    if (!$svg) return;
    const svg = d3.select($svg);
    const strokeWidth = 2.5;
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    svg
      .attr("height", radius * 2)
      .attr("width", radius * 2)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const g = svg.append("g").attr("class", classes.chartWrap);

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius - strokeWidth)
      .padAngle(0.05);

    const invisibleArc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(0);

    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.counterValueBalance);

    let total = d3.sum(data, d => d.counterValueBalance);

    pie(data).forEach((d, i) => {
      data[i].center = arc.centroid(d); //Save center of arc for position of tooltip
      data[i].percentage = (d.data.counterValueBalance / total * 100).toFixed(
        0
      ); //Save percentage of arc
    });

    g.attr("transform", `translate(${radius}, ${radius})`);

    g
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", (d, i) => `arc ${"arc" + i}`)
      .append("path")
      .attr("d", d => arc(d))
      .attr(
        "class",
        (d, i) => (selected !== -1 && selected !== i ? classes.disable : "")
      )
      .style("fill", d => {
        const curr = allCurrencies.find(
          c => c.scheme === d.data.account.currency.name
        ) || { color: "" };
        return curr.color;
      });

    //transparent Chart for hovering purposes
    g
      .selectAll(".invisibleArc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", (d, i) => `invisibleArc ${"invisibleArc" + i}`)
      .append("path")
      .attr("d", d => invisibleArc(d))
      .attr(
        "class",
        (d, i) => (selected !== -1 && selected !== i ? classes.disable : "")
      )
      .style("opacity", 0) //make it transparent
      .on("mouseover", this.handleMouseOver)
      .on("mouseout", this.handleMouseOut);
  }

  componentDidUpdate(prevProps: *, prevState: *) {
    const { selected } = this.state;
    const { showTooltips } = this.props;
    const { prevSelected } = prevState;
    const { classes } = this.props;
    const svg = d3.select(this.svg);
    const svgWidth = svg.attr("width");
    const svgHeight = svg.attr("height");
    if (showTooltips && selected !== prevSelected) {
      d3
        .select(this.svg)
        .selectAll(".arc")
        .classed(classes.disable, (d, i) => selected !== -1 && selected !== i)
        .classed("selected", (d, i) => selected !== -1 && selected === i);
      const tooltip = d3.select(this.tooltip);
      //Place tooltip
      tooltip.classed(classes.hide, selected === -1);
      if (selected !== -1) {
        const selectedArc = d3.select(".arc" + selected).data()[0].data;
        let orientation =
          Math.abs(selectedArc.center[0]) > Math.abs(selectedArc.center[1])
            ? 0
            : 1; //getting best orientation (0 for horizontal )
        let orientationDeltaX = 0;
        let orientationDeltaY = 0;
        let arrowSpacing = 20;
        if (orientation === 0 && selectedArc.center[0] <= 0) {
          //A gauche
          orientationDeltaX =
            -parseFloat(tooltip.style("width")) - arrowSpacing;
          orientationDeltaY = -parseFloat(tooltip.style("height")) / 2;
          tooltip.classed(classes.lookRight, true);
        } else if (orientation === 0 && selectedArc.center[0] > 0) {
          //A droite
          orientationDeltaX = arrowSpacing;
          orientationDeltaY = -parseFloat(tooltip.style("height")) / 2;
          tooltip.classed(classes.lookLeft, true);
        } else if (orientation === 1 && selectedArc.center[1] > 0) {
          //En bas
          orientationDeltaX = -parseFloat(tooltip.style("width")) / 2;
          orientationDeltaY = arrowSpacing;
          tooltip.classed(classes.lookUp, true);
        } else if (orientation === 1 && selectedArc.center[1] < 0) {
          //En haut
          orientationDeltaX = -parseFloat(tooltip.style("width")) / 2;
          orientationDeltaY =
            -parseFloat(tooltip.style("height")) - arrowSpacing;
          tooltip.classed(classes.lookDown, true);
        }
        tooltip.style(
          "left",
          selectedArc.center[0] + svgWidth / 2 + orientationDeltaX + "px"
        );
        tooltip.style(
          "top",
          selectedArc.center[1] + svgHeight / 2 + orientationDeltaY + "px"
        );
        tooltip
          .select(`.${classes.percentage}`)
          .text(`${selectedArc.percentage}%`);
      } else {
        tooltip.classed(classes.lookLeft, false);
        tooltip.classed(classes.lookRight, false);
        tooltip.classed(classes.lookUp, false);
        tooltip.classed(classes.lookDown, false);
      }
    }
  }

  render() {
    const { selected } = this.state;
    const {
      classes,
      showCaptions,
      showTooltips,
      highlightCaptionsOnHover
    } = this.props;

    let curr = { color: "black" };
    if (selected !== -1) {
      curr = allCurrencies.find(
        c => c.scheme === this.props.data[selected].account.currency.name
      ) || { color: "black" };
    }
    return (
      <div>
        <div className={classes.wrapper}>
          <div className={classes.centerChart}>
            <svg
              ref={c => {
                this.svg = c;
              }}
            />
            {selected !== -1 &&
              showTooltips && (
                <div
                  className={cx([classes.tooltip, classes.hide])}
                  style={curr}
                  ref={t => {
                    this.tooltip = t;
                  }}
                >
                  <div className={classes.tooltipTextWrap}>
                    <div className={classes.tooltipText}>
                      <div>
                        <span className={classes.percentage} />
                      </div>
                      <div>
                        <span
                          className={cx([
                            classes.uppercase,
                            classes.currencyName
                          ])}
                        >
                          {this.props.data[selected] &&
                            this.props.data[selected].account.currency.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
        {showCaptions && (
          <table className={classes.table}>
            <tbody>
              {_.map(this.props.data, (data, id) => {
                return (
                  <tr
                    className={cx("currency", {
                      disable:
                        highlightCaptionsOnHover &&
                        selected !== -1 &&
                        selected !== id
                    })}
                    key={id}
                    onMouseOver={() =>
                      highlightCaptionsOnHover && this.setSelected(id)}
                    onMouseOut={() =>
                      highlightCaptionsOnHover && this.setSelected(-1)}
                  >
                    <td>
                      <BadgeCurrency currency={data.account.currency} />
                      <span
                        className={cx(
                          classes.currencyName,
                          classes.currencyNameDark,
                          classes.uppercase
                        )}
                      >
                        {data.account.currency.name}
                      </span>
                    </td>
                    <td className={classes.currencyBalance}>
                      <CurrencyAccountValue
                        account={data.account}
                        value={data.balance}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(PieChart);
