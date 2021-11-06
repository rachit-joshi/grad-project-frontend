import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './css/DataSetMenu.css'
import ParameterControl from './components/ParameterControl.js';

const Controls = ({database, selectedModels, setSelectedModels, parameters, setParameters}) => {
    const dropdownRef = React.useRef(null);
    const [isActive, setIsActive] = React.useState(false);
    const [selectedDataset, setSelectedDataset] = React.useState(database.filter(data => data.id === selectedModels.datasetId));
    const onClick = () => {setIsActive(!isActive);}; 

    const handleSelect = (e) => {
      setIsActive(!isActive);
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
        //console.log(selectedModels);
    }

    React.useEffect(() => {
        const pageClickEvent = (e) => {
          if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
            setIsActive(!isActive);
          }
        };
        if (isActive) {
          window.addEventListener('click', pageClickEvent);
        }
        return () => {
          window.removeEventListener('click', pageClickEvent);
        }
      }, [isActive])

      React.useEffect(() => {
          displayDatasetName()
          console.log(selectedDataset);
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
            User Controls
            <div className="menu-container">
                <div className="dataselect-container">
                    <span>Select Dataset</span>
                    <button onClick={onClick} className="menu-trigger">
                        {selectedDataset.dataset}
                    </button>
                    <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
                        <ul>
                            {database.map((opt, index) => {
                                return(
                                    <li key={index} onClick={(e) => handleSelect(e)}>{opt.dataset}</li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
                <div className="options-container">
                    {selectedDataset.models?.map((model, index) => {
                            return(
                                <li key={index}>
                                    <div className="left-section">
                                        <input
                                            type="checkbox"
                                            id={`custom-checkbox-${index}`}
                                            name={model}
                                            value={model}
                                            checked={!!selectedModels.modelsIdx.includes(index)}
                                            onChange={() => handleCheck(index)}
                                        />
                                        <label htmlFor={`custom-checkbox-${index}`}>{model}</label>
                                    </div>
                                </li>
                            )
                    })}
                </div>
                <div className="parameter-container">
                    <ParameterControl parameters={parameters} setParameters={setParameters} />
                </div>
            </div>
        </div>
    )
};

export default Controls;