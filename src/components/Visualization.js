import React from "react";
import ScatterPlot from "./ScatterPlot";
import Histogram from "./Histogram";

const Visualization = ({database, selectedModels, parameters}) => {
    React.useEffect(() => {
        console.log(database, selectedModels, parameters);
        console.log(database[0].modelData['FastText'])
    })
    return (
        <>
        <ScatterPlot modelData={database[0].modelData['FastText']} projectionMethod={parameters.projectionMethod}/>
        <Histogram model1={database[0].modelData['GloVe']} model2={database[0].modelData['Word2Vec']} parameters={parameters}/>
        </>
    )
};

export default Visualization;