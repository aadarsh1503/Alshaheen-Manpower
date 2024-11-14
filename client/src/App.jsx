import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ContactSection from './components/ContactSection/ContactSection';
import Aviation from './components/Aviation/Aviation';
import Construction from './components/Constructuin/Construction';
import Eventss from './components/Eventss/Eventss';
import HealthCare from './components/HealthCare/HealthCare';
import Hospitality from './components/Hospitality/Hospitality';
import Logistics from './components/Logistics/Logistics';
import ManuFacturing from './components/ManuFacturing/Manufacturing';
import Retail from './components/Retail/Retail';
import Security from './components/Security/Security';
import Training from './components/Training/Training';
import NewsEvents from './components/NewsEvents/NewsEvents';
import About from './components/About/AboutUs';

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
          <Route path="/events" element={<Eventss />} />
          <Route path="/healthcare" element={<HealthCare />} />
          <Route path="/hospitality" element={<Hospitality />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/manufacturing" element={<ManuFacturing />} />
          <Route path="/retail" element={<Retail />} />
          <Route path="/security" element={<Security />} />
          <Route path="/training" element={<Training />} />
          <Route path="/newsEvents" element={<NewsEvents />} />
          <Route path="/about" element={<About />} />
    
        </Routes>
      </div>

      {/* Footer will be displayed on every page */}
      <Footer />
    </Router>
  );
}

export default App;
