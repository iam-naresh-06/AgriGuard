import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FarmDashboard from './pages/FarmDashboard';
import ScanPage from './pages/ScanPage';
import CropsPage from './pages/CropsPage';
import WeatherDashboard from './pages/WeatherDashboard';
import Settings from './pages/Settings';

import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<FarmDashboard />} />
                    <Route path="/crops" element={<CropsPage />} />
                    <Route path="/scan" element={<ScanPage />} />
                    <Route path="/weather" element={<WeatherDashboard />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;

