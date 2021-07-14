import React from "react";
import "./App.css";
import data from './data/testData2.json';
import ArcChart from './arcChart';

import pickColor from './colourPicker';
import chartParams from './chartParams';

// colours are hard-coded here (AVOID)
const divNames = ['apple', 'orange', 'pear'];
const customSpectrum = ['#315A5E', '#EBAB69', '#ED6A5A'];
const colorMap = divNames.reduce((map, div, i) => {
    map[div] = pickColor(divNames.length, i, 1, customSpectrum);
    return map;
}, {});

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
        backgroundColor='#e8e8e8'
        width={600}
      />
      <div>
        SELECTED: {selectedArc ?? 'please select an arc'}<br />
        HOVERED: {hoveredArc ?? 'please hover over an arc'}
      </div>
    </div> 
  )
}

export default App;