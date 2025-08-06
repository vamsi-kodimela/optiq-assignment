import Graph from './Graph';
import './style.css';

function App() {
  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">Distribution of Open Alerts & Misconfigurations</h1>
      </div>
      <div className="graph-container">
        <Graph />
      </div>
    </div>
  );
}

export default App;
