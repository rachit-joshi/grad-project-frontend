import React from "react";
import Plotly from 'plotly.js/lib/core';


const GLOBAL_PROJECTION_PLOTLY_LAYOUT = {
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

const ScatterPlot = ({modelData, projectionMethod}) => {

    React.useEffect(() => {
        createplot(modelData);
    })

    const createplot = (modelData) => {
        console.log("RUN FUNC");
        console.log(modelData);
        Plotly.purge("vizplot");
          const trace3 = {
            x: modelData.map(obj => obj[projectionMethod][0]),
            y: modelData.map(obj => obj[projectionMethod][1]),
            xaxis: 'x3',
            yaxis: 'y3',
            mode: 'markers',
            type: 'scatter',
            text: modelData.map(obj => obj.word),
            textposition: 'bottom center',
            marker: { size: 4, opacity: 0.9, color: "#004616"},
            type: 'scatterg1',
            hoverinfo: 'text',
          };
          
          var data = [ trace3 ];
        Plotly.newPlot("vizplot",data,GLOBAL_PROJECTION_PLOTLY_LAYOUT, GLOBAL_PROJECTION_PLOTLY_CONFIG);
        
    };

    return (
        <>
            <div className="scatter-plot-container">
                <div id="vizplot"></div>
            </div>
        </>
    )
}

export default ScatterPlot;