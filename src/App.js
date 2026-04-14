import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RFIDProvider } from './context/RFIDContext';
import Header from './components/Header';
import Footer from './components/Footer';
import GateEntry from './pages/GateEntry';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import './App.css';

function App() {
  return (
    <RFIDProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<GateEntry />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </RFIDProvider>
  );
}

export default App;
