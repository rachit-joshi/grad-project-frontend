import React from 'react';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom';
import './styles.css';
import Vizl from './Vizl.js';
import Controls from './Controls.js';
import axios from 'axios';
import Loader from './components/Loader';
import Visualization from './components/Visualization.js';


const App = () => {

  const [database, setDatabase] = React.useState([]);
  const [selectedModels, setSelectedModels] = React.useState({
                                                              datasetId: 1,
                                                              modelsIdx: [0,1],
                                                            });
  const [parameters, setParameters] = React.useState({
                                                      nearestNeighbors : 50,
                                                      distanceMetric : 'cosine',
                                                      projectionMethod : 'embedding_pca',
                                                    });
const [loading, setLoading] = React.useState(true);

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
      <div className="container">
      {loading? 
      ( <Loader/>
      ): 
        ( <>
          <div>
            <Controls database={database} 
                      selectedModels={selectedModels} 
                      setSelectedModels={setSelectedModels}
                      parameters={parameters}
                      setParameters={setParameters}         
              />
          </div>
          <div className="canvas">
            <Vizl database={database} selectedModels={selectedModels} parameters={parameters}/>
            <Visualization database={database} selectedModels={selectedModels} parameters={parameters}/>
          </div>
          </>
        )}
        </div>
    </div>
  );
}

export default App;
