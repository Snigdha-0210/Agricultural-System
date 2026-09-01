import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

// Layout Wrapper
const AppLayout = ({ children }) => (
  <div className="flex h-screen bg-green-50 overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        {/* Add more routes here */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/disease-detection" element={<AppLayout><DiseaseDetection /></AppLayout>} /> */}
        {/* <Route path="/market" element={<AppLayout><MarketPrices /></AppLayout>} /> */}
      </Routes>
    </Router>
  );
}

export default App;