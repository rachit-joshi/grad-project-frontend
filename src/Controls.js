import React from 'react';
import './css/DataSetMenu.css'
import ParameterControl from './components/ParameterControl.js';
import {Row, Col, Dropdown} from 'react-bootstrap';

const Controls = ({database, selectedModels, setSelectedModels, parameters, setParameters}) => {
    const [selectedDataset, setSelectedDataset] = React.useState(database.filter(data => data.id === selectedModels.datasetId));

    const handleSelect = (e) => {
      let newDataset = database.filter((obj) => obj.dataset === e.target.textContent);
      setSelectedModels({datasetId: newDataset[0].id, modelsIdx: [0,1]})
    }

    const handleCheck = (index) => {
        if (selectedModels.modelsIdx.includes(index)) {
            let newModelsIdx = selectedModels.modelsIdx.filter((idx)=> idx !== index)
            setSelectedModels({...selectedModels,modelsIdx:newModelsIdx})
        }
        else {
            setSelectedModels({...selectedModels,modelsIdx:[...selectedModels.modelsIdx, index]})
        }
        
    }

      React.useEffect(() => {
          displayDatasetName()
      },[selectedModels])

      const displayDatasetName = () => {
        database.filter(data => {
              if (data.id === selectedModels.datasetId) {
                  setSelectedDataset(data)
              }
             });
      };

    return (
        <div className="controlsContainer">
            <div className="menu-container">
                <Row className="dataselect-container">
                    <Col>
                        <span>Select Dataset</span>
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="Secondary" id="dataselect"> {selectedDataset.dataset}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {database.map((opt, index) => {
                                            return(
                                                <Dropdown.Item key={index} onClick={(e) => handleSelect(e)}>{opt.dataset}</Dropdown.Item>                                        
                                                );
                                        })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Dropdown autoClose="outside">
                            <Dropdown.Toggle variant="Primary" id="modelselect">Pair Models</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {selectedDataset.models?.map((model, index) => {
                                        return(
                                            <Dropdown.Item key={index} className="left-section">
                                                <input
                                                    type="checkbox"
                                                    id={`custom-checkbox-${index}`}
                                                    name={model}
                                                    value={model}
                                                    checked={!!selectedModels.modelsIdx.includes(index)}
                                                    onChange={() => handleCheck(index)}
                                                />
                                                <label htmlFor={`custom-checkbox-${index}`}>{model}</label>
                                            </Dropdown.Item>
                                        )
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <Row className="parameter-container">
                    <ParameterControl parameters={parameters} setParameters={setParameters} />
                </Row>
            </div>
        </div>
    )
};

export default Controls;