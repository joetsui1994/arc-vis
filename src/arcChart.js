import { useEffect } from 'react';
import * as d3 from 'd3';

const treeHeight = 3; // excluding root node

function ArcChart(props) {
    const { data, selectedRef, hoveredRef, colorMap, width, backgroundColor, params } = props;
    const { handleSelect, handleHover } = props;

    // extract chart parameters from props
    const {
        arcGapWidth,
        arcPadding,
        chartPadding,
        innerRadius,
        minOpacity,
        maxOpacityGradient,
        unhoveredOpacity,
        transitionDuation
    } = params;

    // select masks to reduce opacity according to selected/hovered arc
    const highlightPath = (name) => {
        if (name === null) {
            d3.selectAll('.masks')
                .each(function(d) {
                    d3.select(`#${d.data.name}-mask`).transition(d.data.name).duration(transitionDuation).attr('fill-opacity', 0);
                });
        } else {
            const highlightedNode = d3.select(`#${name}`).datum();
            const sequence = highlightedNode
                .ancestors()
                .reverse()
                .slice(1);
            const sequenceNames = sequence.map(node => node.data.name);
            
            // loop over masks in sequence array
            d3.selectAll('.masks')
                .filter(node => !sequenceNames.includes(node.data.name))
                .each(function(d) {
                    d3.select(`#${d.data.name}-mask`).transition(d.data.name).duration(transitionDuation).attr('fill-opacity', 1 - unhoveredOpacity);
                });
            sequenceNames.forEach(node => {
                d3.select(`#${node}-mask`).transition(node).duration(transitionDuation).attr('fill-opacity', 0);
            });
        }
    };

    // calculate start/end angles of a div (IMPORTANT)
    const calcDivAngle = (d, start=true) => {
        const divId = d.data.divs.findIndex(div => div.name === d.div.name);
        const preDivsSum = d.data.divs.slice(0, divId).reduce((sum, div) => sum + div.num, 0);
        const totalAngle = d.x1 - d.x0;
        const newAngle = d.x0 + (preDivsSum/d.data.num)*totalAngle + (start ? 0 : (d.div.num/d.data.num)*totalAngle)
        return newAngle;
    };

    useEffect(() => {
        drawChart();

        return (() => {
            d3.select('#arcChart').remove();
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        highlightPath(selectedRef.current); // when a new arc is selected, reduce opacity of ancestral masks to 0
    }, [selectedRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        selectedRef.current === null && highlightPath(hoveredRef.current); // when a new arc is hovered (and no arc has been selected), reduce opacity of ancestral masks to 0
    }, [hoveredRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

    const drawChart = () => {

        // adjust radius and innerRadius according to data
        const addInnerRadius = (innerRadius-1)*(width/2 - chartPadding)/treeHeight; // magnitute of addInnerRadius must not exceed the width of a single arc
        const radius = width/2 - chartPadding - addInnerRadius/2;

        // create svg
        const svg = d3
            .select('body')
            .append('svg')
            .attr('id', 'arcChart')
            .attr('viewBox', `${-width/2} ${-width/2} ${width} ${width}`)
            .style('max-width', `${width}px`)
            .style('background', backgroundColor);
            
        // create hierarchical structure with start/end angles from raw data
        const root = d3.partition().size([2 * Math.PI, radius * radius])(
            d3
                .hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value)
        );

        // function to draw arcs, each arc is a div
        const arc = d3
            .arc()
            .startAngle(d => calcDivAngle(d))
            .endAngle(d => calcDivAngle(d, false))
            .innerRadius(d => (d.y0)/(width/2) + addInnerRadius)
            .outerRadius(d => (d.y1)/(width/2) - arcGapWidth + addInnerRadius);

        // function to draw arc-masks, each mask covers a subtree which might or might not contain multiple divs
        const mouseArc = d3
            .arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => (d.y0)/(width/2) + addInnerRadius)
            .outerRadius(d => (d.y1)/(width/2) + addInnerRadius);

        // draw arcs
        svg
            .append('g')
            .selectAll('path')
            .data(root.descendants().filter(d => d.depth))
            .join('g') // enter subtree
            .style('display', function(d) {
                if (d.data.name === 'other') {
                    return 'none';
                } else {
                    return 'block';
                }
            })
            .style('opacity', d => (1 - (d.depth - 1)*Math.min(maxOpacityGradient, (1 - minOpacity)/treeHeight)))
            .attr('id', d => `${d.data.name}`)
            .selectAll('g')
            .data(d => d.data.divs.map(division => ({ ...d, 'div': division })))
            .join('path') // enter div within subtree
            .attr('d', arc)
            .attr('fill', (d, i) => colorMap[d.div.name]);

        // draw arc-masks
        svg
            .append('g')
            .attr('fill', backgroundColor)
            .attr('fill-opacity', 0)
            .attr('pointer-events', 'all')
            .on('mouseout', () => handleHover(null))
            .selectAll('g')
            .data(root.descendants().filter(d => d.depth))
            .join('path')
            .attr('d', mouseArc)
            .attr('class', 'masks')
            .attr('id', d => `${d.data.name}-mask`)
            .attr('stroke', backgroundColor)
            .attr('stroke-width', arcPadding)
            .attr('cursor', 'pointer')
            .on('mouseenter', (event, d) => {
                if (d.data.name === 'other') {
                    handleHover(null);
                } else if (selectedRef.current === null) {
                    handleHover(d.data.name);
                }
            })
            .on('mouseleave', () => handleHover(null))
            // notice here that only individual subtree(arc) can be selected, but not individual div
            .on('click', (event, d) => {
                event.stopPropagation();
                if (d.data.name === 'other') {
                    handleSelect(null);
                } else {
                    handleSelect(d.data.name);
                }
            });

        // clicking on anywhere outside the chart deselect seelected arc
        d3.select('body').on('click', () => handleSelect(null));
    }
    return null;
}

export default ArcChart;