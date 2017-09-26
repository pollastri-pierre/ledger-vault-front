import React, { Component } from 'react';
import * as d3 from 'd3';
import { scaleLinear } from 'd3-scale';

export default class QuicklookGraph extends Component {
  componentDidMount() {
	  const svg = d3.select(this.svg),
				margin = {top: 20, right: 20, bottom: 20, left: 20},
				width = +svg.attr("width") - margin.left - margin.right,
				height = +svg.attr("height") - margin.top - margin.bottom,
				g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    const data = [
      {
        date: new Date(2017, 9, 9),
        value: 0.5,
      },
      {
        date: new Date(2017, 9, 10),
        value: 2,
      },
      {
        date: new Date(2017, 9, 11),
        value: 1,
      },
      {
        date: new Date(2017, 9, 12),
        value: 0.9,
      },
      {
        date: new Date(2017, 9, 13),
        value: 1.3,
      },
    ];


		var x = d3.scaleTime()
				.domain([new Date(2017, 9, 9), new Date(2017, 9, 13)])
				.range([0, width]);

		var y = d3.scaleLinear()
				.domain([0, 3])
				.range([height, 0]);

		var xAxis = d3.axisBottom(x)
				.ticks(d3.timeDay);

		var yAxis = d3.axisRight(y)
        .ticks(3)
				.tickSize(width);


		g.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(customXAxis);

		g.append("g")
				.call(customYAxis);

    const valueline = d3.line()
                        .x((d) => x(d.date))
                        .y((d) => y(d.value));

    g.append("path").data([data]).attr('class', 'line').attr('d', valueline).attr('stroke', '#fcb653').attr('fill', 'none').attr('stroke-width', '2px');

		function customXAxis(g) {
			g.call(xAxis);
			g.select(".domain").remove();
      g.selectAll('.tick line').attr('display', 'none');
      g.selectAll('.tick text').attr('fill', '#999999');
		}

		function customYAxis(g) {
			g.call(yAxis);
			g.select(".domain").remove();
			g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#e8e8e8").attr("stroke-dasharray", "1,2");
			g.selectAll(".tick text").attr("x", -20).attr("dy", -12).attr('fill', '#999999');
      g.selectAll('.tick:first-of-type line').attr('stroke', '#999999').attr('stroke-dasharray', "1,2");
		}
  }

  render() {
    return (
      <svg width="300" height="270" ref={ c => this.svg = c }></svg>
    );
  }
}
