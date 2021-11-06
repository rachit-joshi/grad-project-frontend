import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import Plotly from 'plotly.js/lib/core';
var _ = require('underscore');
//import ScatterPlot from './components/ScatterPlot.js';
const DIVERGING_COLORS = d3.schemeRdYlBu[10];

const Vizl = ({database, selectedModels, parameters}) => {
    const [wikiData, setWikiData] = React.useState([]);
    const [modelData, setModelData] = React.useState([]);
    const [selectedDataset, setSelectedDataset] = React.useState(selectedModels.datasetId);
    const [similarity, setSimilarity] = React.useState([]);
    const [models, setModels] = React.useState([]);
    
    React.useEffect(()=>{
        //getData(selectedModels);
    },[selectedModels.datasetId])

    React.useEffect(() => {
        console.log(database, selectedModels, parameters)
    },[database, selectedModels, parameters])
    
    React.useEffect(()=>{
        setSimilarityValues(selectedModels, modelData);
        
    },[selectedModels.modelsIdx])

    
    const setSimilarityValues = (selectedModels, embdData) => {
        console.log('happening')

    }

    const GLOBAL_PROJECTION_PLOTLY_LAYOUT = {
        // grid: {rows: 1, columns: 3, pattern: 'independent'},
        width: 175,
        height: 175,
        showlegend: false,
        xaxes: {
            showticklabels: false,
            showgrid: false,
            zeroline: false,
            showline: false,
        },
        yaxes: {
            showticklabels: false,
            showgrid: false,
            zeroline: false,
            showline: false,
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
        },
        hovermode: 'closest',
    };
    
    const GLOBAL_PROJECTION_PLOTLY_CONFIG = {
        displaylogo: false,
        modeBarButtonsToRemove: [
            'toggleSpikelines', 'hoverCompareCartesian', 'hoverClosestCartesian',
            'hoverClosest3d', 'hoverClosestGl2d', 'toImage'],
    };

    const getWikiData = () => {
        axios.get("http://localhost:4000/wikidata")
            .then((res) => {
                setWikiData(res.data);
            });
    };


    const createplot = () => {
        console.log("RUN FUNC");
        console.log(wikiData);
        Plotly.purge("vizplot");
        const projectionMethod = 'embedding_pca';
        const trace1 = {
            x: wikiData.fastText_wiki_data.map(obj => obj[projectionMethod][0]),
            y: wikiData.fastText_wiki_data.map(obj => obj[projectionMethod][1]),
            xaxis: 'x1',
            yaxis: 'y1',
            mode: 'markers',
            type: 'scatter',
            text: wikiData.fastText_wiki_data.map(obj => obj.word),
            textposition: 'bottom center',
            marker: { size: 4, opacity: 0.9, color: "#004616"},
            type: 'scatterg1',
            hoverinfo: 'text',
          };
          const trace2 = {
            x: wikiData.glove_wiki_data.map(obj => obj[projectionMethod][0]),
            y: wikiData.glove_wiki_data.map(obj => obj[projectionMethod][1]),
            xaxis: 'x2',
            yaxis: 'y2',
            mode: 'markers',
            type: 'scatter',
            text: wikiData.glove_wiki_data.map(obj => obj.word),
            textposition: 'bottom center',
            marker: { size: 4, opacity: 0.9, color: "#004616"},
            type: 'scatterg1',
            hoverinfo: 'text',
          };
          const trace3 = {
            x: wikiData.word2vec_wiki_data.map(obj => obj[projectionMethod][0]),
            y: wikiData.word2vec_wiki_data.map(obj => obj[projectionMethod][1]),
            xaxis: 'x3',
            yaxis: 'y3',
            mode: 'markers',
            type: 'scatter',
            text: wikiData.word2vec_wiki_data.map(obj => obj.word),
            textposition: 'bottom center',
            marker: { size: 4, opacity: 0.9, color: "#004616"},
            type: 'scatterg1',
            hoverinfo: 'text',
          };
          
          var data = [ trace3 ];
        Plotly.newPlot("vizplot",data,GLOBAL_PROJECTION_PLOTLY_LAYOUT, GLOBAL_PROJECTION_PLOTLY_CONFIG);
        
    };

    // -----------------Histogram--------------//

    function compute_iou_similarities(data1, data2, k, metric, method) {
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
        d3.selectAll('.similarity-histogram-container > *').remove();
    
        // maps 1.0 to the [0.9 - 1.0) bucket
        const shrunkValues = values.map(value => {
            return value >= 1.0 ? 0.99 : value;
        })
    
        // set the dimensions and margins of the graph
        const margin = {top: 20, right: 20, bottom: 20, left: 10},
            width = 180 - margin.left - margin.right,
            height = 170 - margin.top - margin.bottom;
    
        // append the svg object to the body of the page
        var svg = d3.select(".similarity-histogram-container")
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
    
    }

    const createHist = () => {
        console.log(wikiData);
        var sim = compute_iou_similarities(wikiData.glove_wiki_data, wikiData.word2vec_wiki_data, 150, 'cosine');
        console.log(sim);
        createSimilarityHistogram(sim, onBrush, null);
    };

    const onBrush = (data) => {
        console.log(data);
    }



    return (
        <>
            <h1>Embedding Comparator</h1>
            <button onClick={getWikiData}>Get wiki data</button>
            <button onClick={createplot}>Test</button>
            <button onClick={createHist}>Test 2</button>
            <div id="vizplot"></div>
            <div className='similarity-histogram-container'></div>
        </>
    )
};

export default Vizl;