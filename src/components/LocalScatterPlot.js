import React from "react";
import NeighborhoodPlot from "./NeighborhoodPlot.js";
import {Row, Col} from 'react-bootstrap';
import FocusedWordInfo from "./FocusedWordInfo.js";

const LocalScatterPlot = ({filteredWords, baseComparisonModel, dataset, focusedWord, selectedModels, parameters, wordReveal, setWordReveal}) => {

    const [allPlots, setAllPlots] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    
    React.useEffect(() => {
        setLoading(true)
        !!focusedWord && console.log(focusedWord,dataset,baseComparisonModel)
        !!filteredWords && !!focusedWord && getPlottingData()
        setWordReveal(null)
    },[focusedWord, filteredWords, baseComparisonModel])

    const getIntersect = (wordNeighbors) => {
        //console.log(wordNeighbors, key, val)
        var commonWords = []
        wordNeighbors[dataset.models[baseComparisonModel]].forEach((word) => {
            Object.entries(wordNeighbors).forEach((entry) => {
                const [key,values] = entry
                if (!(key === dataset.models[baseComparisonModel])){
                    values.includes(word) && commonWords.push(word)
                }
            })
        })
        return commonWords
    }

    const getPlottingData = () => {
        var filteredMetric = filteredWords[0].metric
        // console.log("metric",filteredMetric)
        // console.log(selectedModels)
        var wordNeighbors = {}
        selectedModels.modelsIdx.forEach((model) => {
            var modelNeighbors = dataset.modelData[dataset.models[model]][focusedWord.wordIdx].nearest_neighbors[filteredMetric].knn_ind.slice(0,parameters.nearestNeighbors)
            wordNeighbors[dataset.models[model]] = modelNeighbors
        })
        console.log(wordNeighbors)
        var allPlotData = {}
        var commonWords = getIntersect(wordNeighbors)
        Object.entries(wordNeighbors).forEach((entry) => {
            var allWordData = []
            const [key,value] = entry
            var focusedWordPush = dataset.modelData[key][focusedWord.wordIdx]
            focusedWordPush.color = "#c41616"
            allWordData.push(focusedWordPush)
            value.forEach((val) => {
                var wordData = dataset.modelData[key][val]
                commonWords.includes(val) ? wordData.color = "#32a852" : wordData.color = "#8136b3"
                allWordData.push(wordData)
            })
            allPlotData[key] = allWordData
            
        })
        console.log(allPlotData)
        setAllPlots(allPlotData)
        setLoading(false)
    }

    const handleWordReveal = () =>{
        if(!wordReveal){
            setWordReveal(allPlots)
        }
        else{
            setWordReveal(null)
        }
    }

    return (
        <div className="localscatterplotcontainer">
            <Row className="focusedworddisplay">
                <Col>
                    <FocusedWordInfo focusedWord={focusedWord} baseComparisonModel={baseComparisonModel} dataset={dataset} handleWordReveal={handleWordReveal}/>
                </Col>
            </Row>
            <Row className="neighborplotcontainer">
                { !loading && allPlots && Object.entries(allPlots).map((value, key) => (
                        <Col className="neighborplot" key={key} md="6">
                            <NeighborhoodPlot modelData={value} parameters={parameters}/>
                        </Col>
                    
                ))}
            </Row>

        </div>
    )
}

export default LocalScatterPlot