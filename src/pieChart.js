import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { lab } from "d3";

const PieChart = (props) => {
  const ref = useRef(null);
  const createPie = d3.pie().value((d) => d.value);
  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);
  const mouseArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);

  const colors = d3.scaleOrdinal(props.colorScale);

  useEffect(() => {
    drawChart();
  });
  var isClicked = false;
  const drawChart = () => {
    function unClick() {
      d3.selectAll(".createArc")
        .style("fill-opacity", 1)
        .transition()
        .duration(600);
      d3.selectAll(".legend")
        .style("fill-opacity", 1)
        .transition()
        .duration(600);
    }

    function hoverClick(d) {
      d3.selectAll(".createArc")
        .style("fill-opacity", 0.3)
        .transition()
        .duration(600);
      d3.selectAll(".legend")
        .style("fill-opacity", 0.3)
        .transition()
        .duration(600);
    }

    // function showLegend(d) {
    //   d3.selectAll("#" + d.id + "-legend").style("dispaly", "block");
    //   console.log();
    // }

    const data = createPie(props.data);

    const svg = d3
      .select(".pie-container")
      .append("svg")
      .attr("viewBox", "-100 -100 300 300")
      .style("width", `600px`)
      .style("height", `600px`);
    const svgLegend = d3
      .select(".legend-container")
      .append("svg")
      //   .attr("viewBox", "-100 -100 400 400")
      .style("height", `300px`);

    const legend = svgLegend
      .append("svg")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .sort((a, b) => b.value - a.value)
      .attr("id", (d) => {
        return d.data.label + "-legend";
      })
      .on("mouseout", function () {
        if (!isClicked) {
          unClick();
        }
      })
      .on("mouseover", function (d) {
        if (!isClicked) {
          hoverClick(d);
          d3.select(this).style("fill-opacity", "1").transition().duration(600);
          d3.selectAll("#" + this.id.replace("-legend", ""))
            .style("fill-opacity", "1")
            .transition()
            .duration(600);
        }
      })
      .on("click", function (event, d) {
        isClicked = true;
        hoverClick(d);
        d3.select(this).style("fill-opacity", "1").transition().duration(600);
        d3.selectAll("#" + this.id.replace("-legend", ""))
          .style("fill-opacity", "1")
          .transition()
          .duration(600);
        event.stopPropagation();
        console.log(d);
      });
    d3.select("body").on("click", function () {
      isClicked = false;
      unClick();
    });
    //   .style("display", "none");
    legend
      .append("rect")
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", (d, i) => colors(i))
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      });
    legend
      .append("text")
      .attr("x", 23)
      .attr("y", 9)
      .attr("dy", "0.32em")
      .text((d) => d.data.label)
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      });

    const path = svg
      .append("g")
      .selectAll("path")
      .data(data)
      .join("path")
      .sort((a, b) => b.value - a.value)
      .attr("fill", (i) => colors(i))
      .attr("stroke", "white")
      .attr("stroke-width", "1.5px")
      .attr("d", createArc)
      .attr("class", "createArc")
      .attr("id", (d) => d.data.label)
      .on("mouseout", function () {
        if (!isClicked) {
          unClick();
        }
      })
      .on("mouseover", function (d) {
        if (!isClicked) {
          hoverClick(d);
          //   d3.selectAll("#" + d.id + "-legend").style("dispaly", "block");
          d3.select(this).style("fill-opacity", "1").transition().duration(600);
          d3.selectAll("#" + this.id + "-legend")
            .style("fill-opacity", "1")
            .transition()
            .duration(600);
        }
      })
      .on("click", function (event, d) {
        isClicked = true;
        hoverClick(d);
        d3.select(this).style("fill-opacity", "1").transition().duration(600);
        d3.selectAll("#" + this.id + "-legend")
          .style("fill-opacity", "1")
          .transition()
          .duration(600);
        event.stopPropagation();
        console.log(d);
      });
    d3.select("body").on("click", function () {
      isClicked = false;
      unClick();
    });
  };

  return null;
};

export default PieChart;
