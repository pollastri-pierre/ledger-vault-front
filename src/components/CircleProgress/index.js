// @flow
import * as d3 from "d3";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  circle: {
    width: 124,
    height: 124,
    borderRadius: "50%",
    // border: "3px solid #e2e2e2",
    fontSize: 11,
    textAlign: "center",
    paddingTop: 25,
    position: "relative",
    "& > span": {
      display: "inline-block",
      marginTop: 5
    },
    "& strong": {
      fontSize: 18,
      display: "block"
    }
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 120,
    height: 120
  }
};

type Props = {
  nb: number,
  total: number,
  classes: { [_: $Keys<typeof styles>]: string },
  label: string
};

class CircleProgress extends Component<Props> {
  svg: ?Element;

  update = () => {
    const { nb, total } = this.props;
    const $svg = this.svg;
    if (!$svg) return;
    const radius = 60;
    const boxSize = radius * 2;
    const border = 3;
    const endAngle = Math.PI * 2;

    const circle = d3
      .arc()
      .startAngle(0)
      .innerRadius(radius)
      .outerRadius(radius - border);
    const svg = d3
      .select($svg)
      .append("svg")
      .attr("width", boxSize)
      .attr("height", boxSize);
    const g = svg
      .append("g")
      .attr("transform", `translate(${boxSize / 2},${boxSize / 2})`);

    g.append("path")
      .attr("fill", "#e2e2e2")
      .attr("stroke", "none")
      .attr("stroke-width", "3px")
      .attr("d", circle.endAngle(endAngle));

    const percentage = 2 * (nb / total);
    g.append("path")
      .attr("fill", "#27d0e2")
      .attr("stroke", "none")
      .attr("stroke-width", `${3}px`)
      .attr("d", circle.endAngle(Math.PI * percentage));
  };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  render() {
    const { classes, nb, total, label } = this.props;
    return (
      <div className={classes.circle}>
        <svg
          ref={c => {
            this.svg = c;
          }}
          className={classes.svg}
        />
        <strong>
          {" "}
          {nb}/{total}{" "}
        </strong>
        <span>{label}</span>
      </div>
    );
  }
}

export default withStyles(styles)(CircleProgress);
