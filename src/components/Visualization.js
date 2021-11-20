import React from "react";
import ScatterPlot from "./ScatterPlot";
import Histogram from "./Histogram";
import {Row, Col} from 'react-bootstrap';
import "../styles.css"

const Visualization = ({dataset, selectedModels, parameters, comparison, setComparison, setBrushedWords, wordReveal, setWordReveal}) => {
    const [activeModels, setActiveModels] = React.useState([])
    const [allGraphs, setAllGraphs] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [highlightPlots, setHightlightPlots] = React.useState({})
    const [spaceSaver, setSpaceSaver] = React.useState(false)

    React.useEffect(() => {
        setLoading(true)
        generateViz();
    },[selectedModels, parameters]);

    function generateViz() {
        selectedModels.modelsIdx.length > 4 ? setSpaceSaver(true) : setSpaceSaver(false);
        let models = selectedModels.modelsIdx.map((idx)=> {
            return dataset.models[idx];
        })
        setActiveModels(models);
        let graphs = []
        for(var i=0; i<models.length; ++i) {
            let allTemp = []
            for (var j=0; j<models.length; ++j) {
                if (j<i) {
                    // add offset
                    let temp = {
                        type: 'HistogramEuclidean',
                        models: [models[i], models[j]]
                    }
                    allTemp.push(temp);
                }   
                else if(j === i) {
                    // add scatter
                    let temp = {
                        type: 'Scatter',
                        models: models[i]
                    }
                    allTemp.push(temp)
                } 
                else {
                    // add Histo
                    let temp = {
                        type: 'HistogramCosine',
                        models: [models[i], models[j]]
                    }
                    allTemp.push(temp);
                }          
            }
            graphs.push(allTemp);
        }
        setAllGraphs(graphs)
        setLoading(false)
    }

    return (
        <div className="viz-container">
        {
            !loading && allGraphs && allGraphs.map((graphRow, rowIdx)=> (
                <Row key={rowIdx}>
                    {graphRow.map((graph, colIdx) => {
                        switch(graph.type) {
                            case 'HistogramCosine':
                                return (
                                    <Col key={colIdx+"cosine"} md="auto">
                                        <Histogram dataset={dataset} models={graph.models} parameters={parameters} distanceMetric="cosine"
                                                                comparison={comparison} setComparison={setComparison} setHightlightPlots={setHightlightPlots}
                                                                setBrushedWords={setBrushedWords} spaceSaver={spaceSaver}/>
                                    </Col>
                                )
                                break;
                            case 'Scatter':
                                return (
                                    <Col key={colIdx} md="auto">
                                        <ScatterPlot dataset={dataset} modelName={graph.models} parameters={parameters} highlightPlots={highlightPlots} spaceSaver={spaceSaver}
                                        wordReveal={wordReveal} setWordReveal={setWordReveal}/>
                                    </Col>
                                )
                                break;
                            case 'HistogramEuclidean':
                                return (
                                    <Col key={colIdx+"euclidean"} md="auto">
                                        <Histogram dataset={dataset} models={graph.models} parameters={parameters} distanceMetric="euclidean"
                                                                comparison={comparison} setComparison={setComparison} setHightlightPlots={setHightlightPlots}
                                                                setBrushedWords={setBrushedWords} spaceSaver={spaceSaver}/>
                                    </Col>
                                )
                                break;
                            default:
                                break;
                        }
                    })}
                </Row>
            ))
        }
        </div>
    )
};

export default Visualization;