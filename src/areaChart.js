import React from "react";
import * as d3 from "d3";
import { getByText } from "@testing-library/react";

const AreaChart = (props) => {
  const svgRef = React.useRef(null);
  const data = props.data;
  const margin = { top: 10, right: 20, bottom: 20, left: 40 };
  const width = props.width;
  const height = 500;
  var isClicked = false;

  React.useEffect(() => {
    drawChart();
  }, []);

  const drawChart = () => {
    function unClick() {
      d3.selectAll(".area").style("fill-opacity", 1);
    }

    function hoverClick() {
      d3.selectAll(".area").style("fill-opacity", 0.6);
    }
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(Date.parse(d.date))))
      .range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    const area = d3
      .area()
      .x((d) => {
        return x(new Date(Date.parse(d.data.date)));
      })
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]));
    // .curve(d3.curveBasis);
    const series = d3
      .stack()
      .keys(Object.keys(data[0]).slice(1))
      .offset(d3.stackOffsetExpand)(data);
    const color = d3
      .scaleOrdinal()
      .domain(Object.keys(data[0]).slice(1))
      .range(props.colorScale);

    const svg = d3
      .select(svgRef.current)
      .style("width", `1200px`)
      .style("height", `600px`);
    svg
      .append("g")
      .attr("id", "container")
      .selectAll("path")
      .data(series)
      .join("path")
      .attr("class", "area")
      .attr("fill", ({ key }) => {
        return color(key);
      })
      .on("mouseout", function () {
        if (!isClicked) {
          unClick();
        }
      })
      .on("mouseover", function () {
        if (!isClicked) {
          hoverClick();
          d3.select(this).style("fill-opacity", "1");
        }
      })
      .on("click", function (event, d) {
        isClicked = true;
        hoverClick();
        d3.select(this).style("fill-opacity", "1");
        event.stopPropagation();
        console.log(d);
      })
      .attr("d", area)
      .append("title")
      .text(({ key }) => key);
    // .attr("id", (d) => Object.keys(data[0]).slice(d, d + 1))
    d3.select("body").on("click", function () {
      isClicked = false;
      unClick();
    });
    const xAxis = (g) =>
      g.attr("transform", `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );
    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(10, "%"))
        .call((g) => g.select(".domain").remove());

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    //draw the mask
    const drawMask = () => {
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        let valueArray = Object.values(e).slice(1);
        let flag = true;
        for (const v of valueArray) {
          if (v !== 0) {
            flag = false;
            break;
          }
        }
        if (flag === true) {
          console.log(i);
          var number = data.length - 1;
          var element = document.getElementById("container");
          var elementWidth = element.getBoundingClientRect().width;
          var elementHeight = element.getBoundingClientRect().height;
          var elementX = element.getBoundingClientRect().x;
          var elementY = element.getBoundingClientRect().y;

          d3.select("svg")
            .append("rect")
            .attr("width", (2 * elementWidth) / number)
            .attr("height", elementHeight)
            .attr("x", elementX + ((i - 1) * elementWidth) / number)
            .attr("y", elementY)
            .attr("fill", "white");
        }
      }
    };
    drawMask();
  };

  // drawChart();

  return <svg ref={svgRef} />;
};
export default AreaChart;
