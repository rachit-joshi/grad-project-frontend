import React from 'react';
import {Container, Accordion} from 'react-bootstrap';
import LocalInspecControls from './LocalInspecControls.js';
//import ParaCoordPlot from './ParaCoordPlot.js';
import CoordPlot from './CoordPlot.js';
import LocalScatterPlot from './LocalScatterPlot.js';

const LocalInspection = ({brushedWords, setBrushedWords, dataset, selectedModels, parameters, comparison, setComparison, wordReveal, setWordReveal}) => {
    const [focusedWord, setFocusedWord] = React.useState(null);
    const [baseComparisonModel, setBaseComparisonModel] = React.useState(selectedModels.modelsIdx[0]);
    const [filterSelect, setFilterSelect] = React.useState("Least Similar");
    const [filteredWords, setFilteredWords] = React.useState(null);
    const [rankingModel, setRankingModel] = React.useState(null)

    React.useEffect(() =>{
        setBrushedWords(null);
        setFilteredWords(null);
        setFocusedWord(null)
    },[selectedModels])
    
    React.useEffect(()=>{
        mountLocalVizConfig(brushedWords);
    },[brushedWords])

    const mountLocalVizConfig = (brushedWords) => {
        !!brushedWords && setBaseComparisonModel(dataset.models.indexOf(brushedWords.models[0])) 
    }

    React.useEffect(() => {
        !!brushedWords && filterWords()
    },[baseComparisonModel, brushedWords])

    const filterWords = () => {
        let modelSim = []
        let modelPairs = []
        selectedModels.modelsIdx.forEach((Idx) => {
            if (Idx != baseComparisonModel){ 
                modelPairs.push([dataset.models[baseComparisonModel], dataset.models[Idx]])
            }
        });
        modelPairs.forEach((pair) => {
            modelSim.push(comparison.filter((comp) => {
                return comp.models.includes(pair[0]) && comp.models.includes(pair[1]) && comp.metric === brushedWords.metric 
            })[0])
        });
        modelSim.forEach((x) => {
            let wordSimPairs = []
            brushedWords.brushedWordsIdx.forEach((Idx) => {
                wordSimPairs.push([Idx,x.simValues[Idx]])
            })
            wordSimPairs.sort(function(x, y){
                return y[1] - x[1]
            })
            x.wordSimPairs = wordSimPairs;
        });
        setFilteredWords(modelSim);
    }

    return (
        <Container>
            <div>
                <LocalInspecControls baseComparisonModel={baseComparisonModel} setBaseComparisonModel={setBaseComparisonModel} 
                                    selectedModelsIdx={selectedModels.modelsIdx} datasetModels={dataset.models} 
                                    filterSelect={filterSelect} setFilterSelect={setFilterSelect}/>
            </div>
            <div>
                <div>
                    <CoordPlot filteredWords={filteredWords} baseComparisonModel={baseComparisonModel} dataset={dataset}
                                    filterSelect={filterSelect} datasetModels={dataset.models} rankingModel={rankingModel} setRankingModel={setRankingModel}
                                    setFocusedWord={setFocusedWord}/>
                </div>
            </div>
            <div>
                <LocalScatterPlot filteredWords={filteredWords} baseComparisonModel={baseComparisonModel} dataset={dataset} focusedWord={focusedWord} selectedModels={selectedModels} 
                                    parameters={parameters} wordReveal={wordReveal} setWordReveal={setWordReveal}/>
            </div>
        </Container>
    )
};

export default LocalInspection;