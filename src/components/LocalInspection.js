import React from 'react';
import {Container, Accordion} from 'react-bootstrap';
import LocalInspecControls from './LocalInspecControls.js';

const LocalInspection = ({brushedWords, setBrushedWords, dataset, selectedModels, parameters, comparison, setComparison}) => {
    const [focusedWord, setFocusedWord] = React.useState(null);
    const [baseComparisonModel, setBaseComparisonModel] = React.useState(selectedModels.modelsIdx[0]);
    const [filterSelect, setFilterSelect] = React.useState("Least Similar");
    const [filteredWords, setFilteredWords] = React.useState([]);

    React.useEffect(() =>{
        setBrushedWords(null);
    },[selectedModels])
    
    React.useEffect(()=>{
        mountLocalVizConfig(brushedWords);
    },[brushedWords])

    const mountLocalVizConfig = (brushedWords) => {
        !!brushedWords && setBaseComparisonModel(dataset.models.indexOf(brushedWords.models[0])) 
    }

    const filterWords = () => {
        //filter sim values from comparison for all selected models and metric
        let modelSim = []
        let words = []
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

        console.log("SelectedModels",selectedModels, " Brushedwords:",brushedWords, " comparisons:",comparison,"filterwordsmodels:",modelPairs, "retrivedSimvals:", modelSim)
        //store in allSimObj = [{models:[...] ,simval: [...] }, {...} ...]
        //map words with allSimObj calc score for base w.r.t other selected, sort by sortChoice
        //filter words to top 20
        //pass filtered words, dataset to Accordian header
        //pass models[selectedwords], dataset to plot 
    }

    const focusWord = (wordIdx) => {
        //setFocusedWord(wordIdx);
        console.log(wordIdx);
        console.log(dataset.modelData[dataset.models[selectedModels.modelsIdx[0]]][wordIdx])
    }


    return (
        <Container>
            <div>
                <LocalInspecControls baseComparisonModel={baseComparisonModel} setBaseComparisonModel={setBaseComparisonModel} 
                                    selectedModelsIdx={selectedModels.modelsIdx} datasetModels={dataset.models} 
                                    filterSelect={filterSelect} setFilterSelect={setFilterSelect}/>
            </div>
            <div>
                <button onClick={filterWords}>Test</button>
                {/* { !!brushedWords && brushedWords.brushedWordsIdx.map((wordIdx, index) => 
                   (
                        <div key={index}>
                            <div>
                                {dataset.modelData[dataset.models[dataset.models.indexOf(baseComparisonModel)]][wordIdx].word}
                            </div>
                        </div>
                    )
                )} */}
            </div>
        </Container>
    )
};

export default LocalInspection;