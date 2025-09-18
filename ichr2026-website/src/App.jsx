import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import CallForPapers from './components/CallForPapers';
import PaperSubmission from './components/PaperSubmission';
import Registration from './components/Registration';
import Programme from './components/Programme';
import ConferenceTour from './components/ConferenceTour';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminRoutes from './admin/AdminRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Main Website */}
        <Route path="/*" element={<MainWebsite />} />
      </Routes>
    </Router>
  );
}

// Main website component
const MainWebsite = () => {
  return (
    <div className="App">
      <Header />
      <Hero />
      <About />
      <CallForPapers />
      <PaperSubmission />
      <Registration />
      <Programme />
      <ConferenceTour />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;