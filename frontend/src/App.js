import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CVEExplorer from './pages/CVEExplorer';
import URLAnalyzer from './pages/URLAnalyzer';
import IPChecker from './pages/IPChecker';
import ScanHistory from './pages/ScanHistory';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cve" element={<CVEExplorer />} />
            <Route path="/url-analyzer" element={<URLAnalyzer />} />
            <Route path="/ip-checker" element={<IPChecker />} />
            <Route path="/history" element={<ScanHistory />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;