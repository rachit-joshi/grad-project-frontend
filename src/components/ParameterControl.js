import React from "react";
import '../css/ParameterControl.css'
import NeighborsSelector from '../components/NeighborsSelector.js'
import {Row, Col, FormCheck} from 'react-bootstrap';

const projectionMethodOptions = ['embedding_pca','embedding_tsne']

const ParamterControl = ({parameters, setParameters}) => {
    const handleProjectionMethodChange = (e) => {setParameters({...parameters,projectionMethod:e.target.value})}

    return(
        <div>
            <Row className="paramContainer">
                <Col md="6" className="projectionMethod">Projection Method</Col>
                    
                        {projectionMethodOptions.map((opt, index) => {
                            return (
                                <Col md="3" key={index}>
                                    <button className={(opt == parameters.projectionMethod) ? "dmbtn dmbtn-active" : "dmbtn"} value={opt} onClick={(e) => {handleProjectionMethodChange(e)}}>
                                        {(opt === "embedding_pca" ? "PCA" : "TSNE")}</button>
                                </Col>
                            )
                        })}
                     
            </Row>
            <Row className="paramContainer">
                <Col className="projectionMethod">Nearest Neighbors</Col>
                <Col>
                    <NeighborsSelector parameters={parameters} setParameters={setParameters} />
                </Col>
            </Row>
        </div>
    )
}

export default ParamterControl;