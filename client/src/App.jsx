import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ContactSection from './components/ContactSection/ContactSection';

function App() {
  return (
    <Router>
      <Navbar />
      <div>
      
        {/* Define your routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contactUs" element={<ContactSection />} />
        </Routes>
      <Footer />

      </div>
    </Router>
  );
}

export default App;
