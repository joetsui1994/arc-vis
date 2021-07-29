import React, { useEffect } from "react";
import * as d3 from "d3";
import params from './params';

function Area(props) {
    const svgRef = React.useRef(null);
    const selectedRef = React.useRef(null);

    const { name, data, width, height, selectedItemId, handleItemOnSelect, setItemInfo} = props;
    const {
        hoverOpacity,
        fadeInOutDuration,
        margin,
    } = params;
    const keys = Object.keys(data[0]).slice(1)
    let isClicked = false;
    
    useEffect(() => {
        if (selectedItemId !== null) {
            d3.selectAll(`.${name}-area`)
                .each(function(node) {
                    const active = node.key === selectedItemId;
                    d3.select(`#${name}-area-${node.key}`)
                        // .transition(`${node.key}`)
                        // .duration(fadeInOutDuration)
                        .style('fill-opacity', active ? 1 : hoverOpacity);
                });

            d3.selectAll(`.${name}-area`)
                .filter(node => node.key === selectedItemId)
                .each(function(node) {
                    const itemInfo = `${node.key}`;
                    setItemInfo(itemInfo);
                })
        } else {
            setItemInfo('');
            d3.selectAll(`.${name}-area`)
                // .transition('fade-in')
                // .duration(fadeInOutDuration)
                .style('fill-opacity', 1);
        }
    }, [selectedItemId, name, setItemInfo, hoverOpacity, fadeInOutDuration]);

    useEffect(() => {
        drawChart();
        const svg = svgRef.current;

        return (() => {
            d3.select(svg).remove();
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const highlightArea = (id) => {
        d3.selectAll(`.${name}-area`)
            .each(function(node) {
                const active = node.key === id;
                d3.select(`#${name}-area-${node.key}`)
                    // .transition(`${node.key}`)
                    // .duration(fadeInOutDuration)
                    .style('fill-opacity', id === null || active ? 1 : hoverOpacity);
            });
    }

    const drawChart = () => {

        // Prepare data
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
        .keys(keys)
        .offset(d3.stackOffsetExpand)(data);
        const color = d3
        .scaleOrdinal()
        .domain(keys)
        .range(props.colorScale);

        // Create svg
        const svg = d3
        .select(svgRef.current)
        .style("width", `1200px`)
        .style("height", `600px`);
        svg
        .append("g")
        .attr('id', `${name}-area-box`)
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("d", area)
        .attr("class", `${name}-area`)
        .attr("fill", ({ key }) => {
            return color(key);
        })
        .attr("id", d => `${name}-area-${d.key}`)
        .attr('cursor', 'pointer')
        .on('mouseout', () => hoverClick(null))
        .on('mouseover', (event, d) => hoverClick(d))
        .on('click', function(event, d) {
                isClicked = true;
                handleItemOnSelect(d.key);
                event.stopPropagation();
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

        const unClick = () => {
            handleItemOnSelect(null);
            setItemInfo('');
            isClicked = false;
        };

        const hoverClick = (d) => {
            if(isClicked === false){
                if (selectedRef.current === null) {
                    highlightArea(d && d.key);
    
                    if (d === null) {
                        setItemInfo('');
                    } else {
                        const itemInfo = `${d.key}`;
                        setItemInfo(itemInfo);
                    }
                }
            }
        };

        d3.select(`#${name}-area-container`).on('click', () => {
            unClick();
        });
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
                    var number = data.length - 1;
                    var element = document.getElementById(name+"-area-box");
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

    return ( <div id = { `${name}-area-container` } >
        <svg style = {
            { width: width, height: width } }
        ref = { svgRef }
        /> </div>
    );
};

export default Area;