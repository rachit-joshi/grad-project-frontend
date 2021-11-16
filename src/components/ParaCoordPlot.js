import React from "react";
//import Plotly from 'plotly.js/lib/core';
import Plotly from 'plotly.js-dist'

const ParaCoordPlot= ({filteredWords,baseComparisonModel,dataset,filterSelect, datasetModels}) => {

    const [filterModel, setFilterModel] = React.useState(null)
    
    React.useEffect(() => {
        console.log(filteredWords)
        createLocalPlot()
    },[filteredWords]);

    const createLocalPlot = () => {

        let orderedWords = []
        filteredWords.length > 0 && setFilterModel(filteredWords[0].models.filter(function (ele, Idx) {return ele != datasetModels[baseComparisonModel]}))
        filteredWords.forEach((set) => {
            //console.log('Inside loop: ', filterModel,datasetModels[baseComparisonModel]);
            if(filterModel && set.models.includes(filterModel[0]) && set.models.includes(datasetModels[baseComparisonModel])){
                console.log("match!");
                console.log(filterSelect);
                orderedWords = filterSelect.toLowerCase() === "least similar" ?  set.wordSimPairs.slice(-20).map((wordVal)=> wordVal[0]) : set.wordSimPairs.slice(20).map((wordVal)=> wordVal[0]);
            }
        });
        console.log(orderedWords);

        let dimensions = []
        let rangeDimensions = [0,100]
        filteredWords.forEach((set) => {
            let label = set.models.filter(function (ele, Idx) {return ele != datasetModels[baseComparisonModel]})[0]
            let values = []
            orderedWords.forEach((wordIdx) =>{
                let temp = set.wordSimPairs.filter(function(ele, Idx){return ele[0] === wordIdx}).map((wordVal) => wordVal[1])[0].toFixed(2)
                values.push(parseInt(temp*100))
            })
            
            
            dimensions.push({
                range: [Math.min(...values),Math.max(...values)],
                label: label,
                values: values,
                tickvals: [...new Set(values)]
            })

        });
        
        var trace ={
            type: 'parcoords',
            line: {
                colorscale: [[0,'red']]
            },
            dimensions: dimensions
        }

        var data = [trace];

        var layout = {
            height: 300,
        }

        console.log(data);
        Plotly.newPlot('localplot1', data, layout);

        var thisPlot = document.getElementById('localplot1')

        thisPlot.on('plotly_click', function(data){
            console.log(data);
        })


    }
    
    return (
        <div>
            {filterModel}
            <div id="localplot1">

            </div>
        </div>
    )
}


export default ParaCoordPlot;