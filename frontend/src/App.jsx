import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Deployments from './pages/Deployments';
import Evaluation from './pages/Evaluation';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/deployments" element={<Deployments />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/incidents" element={<div className="p-8 text-center text-gray-500 border border-gray-200 rounded bg-white text-sm">Incidents interface pending in a future phase</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
