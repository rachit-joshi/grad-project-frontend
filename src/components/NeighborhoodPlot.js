import React from "react";
import Plotly from 'plotly.js-dist';


const NeighborhoodPlot = ({modelData,parameters}) => {


    var GLOBAL_PROJECTION_PLOTLY_LAYOUT = {
        width: 175,
        height: 175,
        font: {
            size: 6
        },
        showlegend: false,
        xaxis: {
            showgrid: false,
            zeroline: false,
            showline: false,
        },
        yaxis: {
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
        console.log(modelData,parameters)
        createLocalPLot(modelData)
    },[modelData,parameters])

    const createLocalPLot = (modelData) => {
        var plotting = modelData[1]
        Plotly.purge(`localplotof${modelData[0]}`)

        const trace = {
            x: plotting.map(obj => obj[parameters.projectionMethod][0]),
            y: plotting.map(obj => obj[parameters.projectionMethod][1]),
            mode: 'markers',
            type: 'scatter',
            text: plotting.map(obj => obj.word),
            textposition: 'bottom center',
            marker: { size: 5, opacity: 1, color: plotting.map(obj => obj.color)},
            hoverinfo: 'text',
        }

        var data = [trace]

        Plotly.newPlot(`localplotof${modelData[0]}`,data,GLOBAL_PROJECTION_PLOTLY_LAYOUT, GLOBAL_PROJECTION_PLOTLY_CONFIG)
    }

    return (
        <div>
            <div id={`localplotof${modelData[0]}`}></div> 
            <div className="plotlabel">{modelData[0]}</div>
        </div>
    )
}

export default NeighborhoodPlot;