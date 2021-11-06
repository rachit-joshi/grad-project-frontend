import React from "react";
import * as d3 from 'd3';
import { sliderBottom } from 'd3-simple-slider';

const MaxNearestNeighbors = 250;
const NeighborsSelector = ({parameters, setParameters}) => {

    React.useEffect(() => {
        NearestNeighborsScale(parameters.nearestNeighbors, handleNNChange)
    },[])

    const handleNNChange = (val) => {
        setParameters({...parameters,nearestNeighbors:val})
    }

    function NearestNeighborsScale(numNearestNeighbors, onChange) {
        d3.select('#nearest-neighbors-scale > *').remove();
    
        var numNeighborSlider = sliderBottom()
            .min(0)
            .max(MaxNearestNeighbors)
            .step(1)
            .width(130)
            .ticks(5)
            .default(numNearestNeighbors)
            .handle(
              d3
                .symbol()
                .type(d3.symbolCircle)
                .size(200)()
            )
            .on('end', val => {
                onChange(val);
            });
    
        var gNumNeighbors = d3
            .select('div#nearest-neighbors-scale')
            .append('svg')
            .attr('width', 160)
            .attr('height', 50)
            .append('g')
            .attr('transform', 'translate(12,10)');
    
        gNumNeighbors.call(numNeighborSlider);
    }

    return(
        <>
            <div id="nearest-neighbors-scale"></div>
        </>
    )
}

export default NeighborsSelector;
