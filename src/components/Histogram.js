import React from "react";
import * as d3 from 'd3';
var _ = require('underscore');
const DIVERGING_COLORS = d3.schemeRdYlBu[10];

const Histogram = ({dataset, models, parameters, comparison, setComparison, distanceMetric, setHightlightPlots, setBrushedWords, spaceSaver}) => {

    const [simValues, setSimValues] = React.useState([]);

    React.useEffect(()=>{
        setComparison([]);
        createHist();
    },[parameters,spaceSaver])
    
    React.useEffect(()=>{
        createHist()
    })

    function compute_iou_similarities(data1, data2, k, metric) {
        var to_return = []
        for (var i = 0; i < data1.length; i++) {
            var word1_neighbors = data1[i]['nearest_neighbors'][metric].knn_ind.slice(0, k);
            var word2_neighbors = data2[i]['nearest_neighbors'][metric].knn_ind.slice(0, k);
            var intersection = _.intersection(word1_neighbors, word2_neighbors);
            var union = _.union(word1_neighbors, word2_neighbors);
            var iou = intersection.length / union.length;
            to_return.push(iou);
        }
        return to_return;
    }

    function createSimilarityHistogram(values, onBrush, brushSelectedIdxs) {
        d3.selectAll(`#${models[0]}${models[1]}${distanceMetric} > *`).remove();
    
        // maps 1.0 to the [0.9 - 1.0) bucket
        const shrunkValues = values.map(value => {
            return value >= 1.0 ? 0.99 : value;
        })
    
        // set the dimensions and margins of the graph
        let widthBaseVal, heightBaseVal=130;
        spaceSaver ? (widthBaseVal = heightBaseVal + 10) : widthBaseVal = heightBaseVal = 180
        const margin = {top: 20, right: 20, bottom: 20, left: 10},
            width = widthBaseVal - margin.left - margin.right,
            height = heightBaseVal - margin.top - margin.bottom;
    
        // append the svg object to the body of the page
        var svg = d3.select(`#${models[0]}${models[1]}${distanceMetric}`)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
    
        // X axis: scale and draw:
        var x = d3.scaleLinear()
          .domain([0, 1])
          .range([0, width]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).ticks(5, '.0%'));
    
        // set the parameters for the histogram
        var histogram = d3.histogram()
          .value(function(d) { return d; })   // I need to give the vector of value
          .domain(x.domain())  // then the domain of the graphic
          .thresholds(x.ticks(10)); // then the numbers of bins
    
        // And apply this function to data to get the bins
        var bins = histogram(shrunkValues);
        bins = bins.slice(0, bins.length - 1);
    
        // Y axis: scale and draw:
        var y = d3.scaleLinear()
          .range([height, 0]);
        // set max y-value to be at least 1
        const y_max = Math.max(1, d3.max(bins, function(d) { return d.length; }));
        y.domain([0, y_max]);
    
        // append the bar rectangles to the svg element
        svg.selectAll("rect")
          .data(bins)
          .enter()
          .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) {
                return x(d.x1) - x(d.x0) -1;
            })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", (_, i) => DIVERGING_COLORS[i])
            .append('title').text(d => `${d.length} words`);
    
        var brush = d3.brushX()
                      .extent([[x.range()[0], 0], [x.range()[1], height]]);
    
        var appendedBrush = svg.append('g')
           .attr('class', 'brush')
           .call(brush);
    
        if (brushSelectedIdxs !== null) {
            // If current brush selection in the state, set the brush.
            const brushedSimilarityValues = brushSelectedIdxs.map(i => values[i]);
            const brushXMin = x(Math.min(...brushedSimilarityValues));
            const brushXMax = x(Math.max(...brushedSimilarityValues));
            appendedBrush.call(brush.move, [brushXMin, brushXMax]);
        }
    
        brush.on('end', function(event) {
            const brushSelectionPixels = event.selection || x.range();
            const brushSelection = brushSelectionPixels.map(x.invert);
            var selectedIdxs;
            if (brushSelection[0] == 0 && brushSelection[1] == 1) {
                selectedIdxs = null;
            }
            else {
                selectedIdxs = [];
                for (let i = 0; i < values.length; i++) {
                    let val = values[i];
                    if (val >= brushSelection[0] && val <= brushSelection[1]) {
                        selectedIdxs.push(i);
                    }
                }
            }
            onBrush(selectedIdxs);
        });
        
        svg.on("click", () => {
            setHightlightPlots({models: models,metric: distanceMetric, simValues: simValues})
        });

    }
    const onBrush = (data) => {
        data ? setBrushedWords({models: models, metric: distanceMetric, brushedWordsIdx: data}) : setBrushedWords(null);
        return;
    }

    const checkComparisons = () => {
        let result = false;
        comparison.forEach((comp) => {
            if(comp.models.includes(models[0]) && comp.models.includes(models[1]) && comp.metric === distanceMetric ){
                setSimValues(comp.simValues);
                result = true;
            }
        })
        return result;
    }
    
    const createHist = () => {
        if(!checkComparisons()) {
            var sim = compute_iou_similarities(dataset.modelData[models[0]], dataset.modelData[models[1]], parameters.nearestNeighbors, distanceMetric);
            setSimValues(sim);
            setComparison(comparison => [...comparison, {models: models,metric: distanceMetric, simValues: sim}]);
        }
        createSimilarityHistogram(simValues, onBrush, null);
    };

    return (
        <>
             
                <div id={`${models[0]}${models[1]}${distanceMetric}`}></div>
                <div className="plotlabel">{models[0]} vs {models[1]} - {distanceMetric}</div>
            
        </>
    )
}

export default Histogram;