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
import Aviation2 from './components/Aviation2/Aviation2';
import Construction2 from './components/Construction2/Construction2';
import Events2 from './components/Events2/Events2';
import HealthCare2 from './components/Healthcare2/Healthcare2';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import ChatWidget from './components/ChatWidget/ChatWidget';
import WhatsAppWidget from './components/WhatsappWidget/WhatsappWidget';


function App() {
  return (
    <Router>
      {/* Navbar will be displayed on every page */}
      <Navbar />
      <ChatWidget />
      <WhatsAppWidget />
      {/* Main content area with Routes */}
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contactUs" element={<ContactSection />} />
          <Route path="/recruitment" element={<Aviation />} />
          <Route path="/pre-employment" element={<Construction />} />
          <Route path="/placements" element={<Eventss />} />
          <Route path="/visas" element={<HealthCare />} />
          <Route path="/hospitality" element={<Hospitality />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/manufacturing" element={<ManuFacturing />} />
          <Route path="/retail" element={<Retail />} />
          <Route path="/security" element={<Security />} />
          <Route path="/training" element={<Training />} />
          <Route path="/newsEvents" element={<NewsEvents />} />
          <Route path="/about" element={<About />} />
          <Route path="/aviation" element={<Aviation2 />} />
          <Route path="/construction" element={<Construction2 />} />
          <Route path="/events" element={<Events2 />} />
          <Route path="/healthcare" element={<HealthCare2 />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    
        </Routes>
      </div>

      {/* Footer will be displayed on every page */}
      <Footer />
    </Router>
  );
}

export default App;
