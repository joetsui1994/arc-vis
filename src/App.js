import React from "react";
import "./App.css";
import data from "./data/testData.json";
import ArcChart from "./arcChart";
import data1 from "./data/test.json";
import pickColor from "./colourPicker";
import chartParams from "./chartParams";
import PieChart from "./pieChart";

// colours are hard-coded here (AVOID)
const divNames = ["apple", "orange", "pear"];
// const customSpectrum = ["#315A5E", "#EBAB69", "#ED6A5A"];
const colorMap = divNames.reduce((map, div, i) => {
  map[div] = pickColor(divNames.length, i, 1);
  return map;
}, {});
var colorScale = [];
for (var i = 0; i < data1.length; i++) {
  var hex = pickColor(data1.length, i, 1, null);
  colorScale.push(hex);
}

function App() {
  const [selectedArc, setSelectedArc] = React.useState(null);
  const handleArcSelect = (name) => {
    selectedRef.current = name;
    setSelectedArc(name);
  };

  const [hoveredArc, setHoveredArc] = React.useState(null);
  const handleArcHovre = (name) => {
    hoveredRef.current = name;
    setHoveredArc(name);
  };

  const selectedRef = React.useRef(null);
  const hoveredRef = React.useRef(null);

  console.log(colorScale);

  return (
    <div>
      <ArcChart
        data={data}
        handleSelect={handleArcSelect}
        handleHover={handleArcHovre}
        selectedRef={selectedRef}
        hoveredRef={hoveredRef}
        colorMap={colorMap}
        params={chartParams}
        backgroundColor="#e8e8e8"
        width={600}
      />
      <div>
        SELECTED: {selectedArc ?? "please select an arc"}
        <br />
        HOVERED: {hoveredArc ?? "please hover over an arc"}
      </div>
      <PieChart
        data={data1}
        width={400}
        height={400}
        innerRadius={60}
        outerRadius={100}
        colorScale={colorScale}
      />
      <div>
        <div
          className="legend-container"
          style={{
            height: "300px",
            margin: "100px",
          }}
        ></div>
        <div className="pie-container"></div>
      </div>
    </div>
  );
}

export default App;
