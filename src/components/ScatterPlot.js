import React from "react";
import Plotly from 'plotly.js-dist';
// import Plotly from 'plotly.js/lib/core';
import * as d3 from 'd3';
const DIVERGING_SCALE = d3.scaleDiverging(d3.interpolateRdYlBu);

const ScatterPlot = ({dataset, parameters, modelName, highlightPlots, spaceSaver}) => {

    const modelData = dataset.modelData[modelName];
    var GLOBAL_PROJECTION_PLOTLY_LAYOUT = {
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
    
    var GLOBAL_PROJECTION_PLOTLY_CONFIG = {
        displaylogo: false,
        modeBarButtonsToRemove: [
            'toggleSpikelines', 'hoverCompareCartesian', 'hoverClosestCartesian',
            'hoverClosest3d', 'hoverClosestGl2d', 'toImage'],
    };

    React.useEffect(() => {
        createplot(modelData);
    },[modelName,parameters.projectionMethod,spaceSaver])

    React.useEffect(() => {
        updatePlot()
    },[highlightPlots])

    const updatePlot = () => {
        if (highlightPlots.models?.includes(modelName)){
            var allColors = highlightPlots.simValues.map(val => DIVERGING_SCALE(val));
            let updatedColors ={
                marker: {
                    size: 4,
                    color: allColors,
                    opacity: 0.9,
                },
            }
            Plotly.restyle(modelName, updatedColors);
        }
        else{
            let updatedColors ={
                marker: {
                    size: 4,
                    color: "#a8abad",
                    opacity: 0.9,
                },
            }
            Plotly.restyle(modelName, updatedColors);
        }
    }

    const createplot = (modelData) => {
        Plotly.purge(modelName);
          const trace3 = {
            x: modelData.map(obj => obj[parameters.projectionMethod][0]),
            y: modelData.map(obj => obj[parameters.projectionMethod][1]),
            xaxis: 'x3',
            yaxis: 'y3',
            mode: 'markers',
            type: 'scatter',
            text: modelData.map(obj => obj.word),
            textposition: 'bottom center',
            marker: { size: 4, opacity: 0.9, color: "#a8abad"},
            type: 'scatterg1',
            hoverinfo: 'text',
          };
          
          var data = [ trace3 ];

          if(spaceSaver){
              GLOBAL_PROJECTION_PLOTLY_LAYOUT.width = 130
              GLOBAL_PROJECTION_PLOTLY_LAYOUT.height = 130
          }

        Plotly.newPlot(modelName,data,GLOBAL_PROJECTION_PLOTLY_LAYOUT, GLOBAL_PROJECTION_PLOTLY_CONFIG);
        
    };

    return (
        <>
                <div id={modelName}></div>
        </>
    )
}

export default ScatterPlot;