import React from "react";
import '../css/ParameterControl.css'
import NeighborsSelector from '../components/NeighborsSelector.js'

const distanceMetricOptions = ['cosine','euclidean']
const projectionMethodOptions = ['embedding_pca','embedding_tsne']

const ParamterControl = ({parameters, setParameters}) => {
    const handleDistanceMetricChange = (e) => {setParameters({...parameters,distanceMetric:e.target.value})}
    const handleProjectionMethodChange = (e) => {setParameters({...parameters,projectionMethod:e.target.value})}

    return(
        <>
            {distanceMetricOptions.map((opt, index) => {
                return (
                    <>
                        <button key={index} className={(opt == parameters.distanceMetric) ? "dmbtn active" : "dmbtn"} value={opt} onClick={(e) => {handleDistanceMetricChange(e)}}>{opt}</button>
                    </>
                )
            })}
            {projectionMethodOptions.map((opt, index) => {
                return (
                    <>
                        <button key={index} className={(opt == parameters.projectionMethod) ? "dmbtn active" : "dmbtn"} value={opt} onClick={(e) => {handleProjectionMethodChange(e)}}>{opt}</button>
                    </>
                )
            })}
            <NeighborsSelector parameters={parameters} setParameters={setParameters} />
        </>
    )
}

export default ParamterControl;