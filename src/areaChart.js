import React from "react";
import * as d3 from "d3";

const AreaChart = (props) => {
  const svgRef = React.useRef(null);
  const data = props.data;
  const margin = { top: 10, right: 20, bottom: 20, left: 40 };
  const width = props.width;
  const height = 500;

  React.useEffect(() => {
    drawChart();
  }, []);

  const drawChart = () => {
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
      .attr("viewBox", [0, 0, width, height])
      .style("width", `1200px`)
      .style("height", `600px`);
    svg
      .append("g")
      .selectAll("path")
      .data(series)
      .join("path")
      .attr("fill", ({ key }) => {
        return color(key);
      })
      .attr("d", area)
      .append("title")
      .text(({ key }) => key);

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);
  };

  drawChart();

  return <svg ref={svgRef} />;
};
export default AreaChart;
