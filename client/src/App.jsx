import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ContactSection from './components/ContactSection/ContactSection';
import Aviation from './components/Aviation/Aviation';
import Construction from './components/Constructuin/Construction';

function App() {
  return (
    <Router>
      {/* Navbar will be displayed on every page */}
      <Navbar />
      
      {/* Main content area with Routes */}
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contactUs" element={<ContactSection />} />
          <Route path="/aviation" element={<Aviation />} />
          <Route path="/construction" element={<Construction />} />
    
        </Routes>
      </div>

      {/* Footer will be displayed on every page */}
      <Footer />
    </Router>
  );
}

export default App;
