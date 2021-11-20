import React from 'react';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom';
import './styles.css';
import Controls from './Controls.js';
import axios from 'axios';
import Loader from './components/Loader';
import LocalInspection from './components/LocalInspection.js';
import Visualization from './components/Visualization.js';


const App = () => {

  const [database, setDatabase] = React.useState([]);
  const [comparison, setComparison] = React.useState([]);
  const [brushedWords, setBrushedWords] = React.useState(null);
  const [selectedModels, setSelectedModels] = React.useState({
                                                              datasetId: 2,
                                                              modelsIdx: [0,1,2,3],
                                                            });
  const [parameters, setParameters] = React.useState({
                                                      nearestNeighbors : 50,
                                                      distanceMetric : 'cosine',
                                                      projectionMethod : 'embedding_pca',
                                                    });
const [loading, setLoading] = React.useState(true);
const [wordReveal, setWordReveal] = React.useState(null)

  React.useEffect(()=>{
    axios.get("http://localhost:4000/dataset")
    .then((res) => {
        setDatabase(res.data.database);
        setLoading(false);
        console.log('got database', res.data);
    });
  },[]);
  
  return (
    <div className="App">
      <div className="mainContainer">
      {loading? 
      ( <Loader/>
      ): 
        ( <>
          <div className="miniboard">
            <div className="toolBox">
              <Controls database={database} 
                        selectedModels={selectedModels} 
                        setSelectedModels={setSelectedModels}
                        parameters={parameters}
                        setParameters={setParameters}       
                />
            </div>
            <div className="localplot-container">
                  <LocalInspection brushedWords={brushedWords} setBrushedWords={setBrushedWords} dataset={database[selectedModels.datasetId-1]} selectedModels={selectedModels} parameters={parameters} 
                          comparison={comparison} setComparison={setComparison} wordReveal={wordReveal} setWordReveal={setWordReveal}/>
            </div>
          </div>
          <div className="canvas">
            <Visualization dataset={database[selectedModels.datasetId-1]} selectedModels={selectedModels} parameters={parameters} 
                          comparison={comparison} setComparison={setComparison} setBrushedWords={setBrushedWords} wordReveal={wordReveal} setWordReveal={setWordReveal}/>
          </div>
          </>
        )}
        </div>
    </div>
  );
}

export default App;
