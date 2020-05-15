// @flow
import * as d3 from "d3";
import styled from "styled-components";
import React, { Component } from "react";

type Props = {
  nb: number,
  total: number,
  label: string,
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
    const { nb, total, label } = this.props;
    return (
      <Container>
        <Svg ref={(c) => (this.svg = c)} />
        <strong>
          {" "}
          {nb}/{total}{" "}
        </strong>
        <span>{label}</span>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 124px;
  height: 124;
  border-radius: 50%;
  font-size: 11px;
  text-align: center;
  padding-top: 25px;
  position: relative;
  & > span {
    display: inline-block;
    margin-top: 5px;
  }
  & strong {
    font-size: 18px;
    display: block;
  }
`;

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 120px;
`;

export default CircleProgress;
