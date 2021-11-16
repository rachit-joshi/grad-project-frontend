import React from "react";
import {Row, Col, Dropdown} from 'react-bootstrap';


const LocalInspecControls = ({baseComparisonModel, setBaseComparisonModel, selectedModelsIdx, datasetModels, filterSelect, setFilterSelect}) => {
    const filterOptions = ["least similar","most similar"];

    React.useEffect(() => {
        //console.log("base:",baseComparisonModel,"selectedIdx:", selectedModelsIdx,"datasetModels:", datasetModels)
    }, [baseComparisonModel, selectedModelsIdx])

    return (
        <>
            <Row>
                <Col>
                    <Dropdown onSelect={(eventKey) => setBaseComparisonModel(eventKey)}>
                            <Dropdown.Toggle variant="Secondary" id="filterselect">{datasetModels[baseComparisonModel]}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    selectedModelsIdx.map((val, index) => (
                                        <Dropdown.Item key={index} eventKey={val}>{datasetModels[val]}</Dropdown.Item>
                                    ))
                                }                 
                                {/* <Dropdown.Item key={filterOptions[0]} onClick={(e) => setFilterSelect(e.target.outerText)}>{filterOptions[0]}</Dropdown.Item>                                        
                                <Dropdown.Item key={filterOptions[1]} onClick={(e) => setFilterSelect(e.target.outerText)}>{filterOptions[1]}</Dropdown.Item>                 */}
                            </Dropdown.Menu>
                        </Dropdown>    
                </Col>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle variant="Secondary" id="filterselect">{filterSelect}</Dropdown.Toggle>
                        <Dropdown.Menu>                    
                            <Dropdown.Item key={filterOptions[0]} onClick={(e) => setFilterSelect(e.target.outerText)}>{filterOptions[0]}</Dropdown.Item>                                        
                            <Dropdown.Item key={filterOptions[1]} onClick={(e) => setFilterSelect(e.target.outerText)}>{filterOptions[1]}</Dropdown.Item>                
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
        </>
    )
}

export default LocalInspecControls;