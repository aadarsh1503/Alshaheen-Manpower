import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Imports from your existing files
import MultiStepForm from './components/MultiStepForm/MultiStepForm';
import Dashboard from './components/PersonalInfoStep/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import NotFound from './components/NotFound/NotFound';
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
import './app.css';
import VacancyManager from './components/VacancyManager/VacancyManager';

/**
 * MainLayout component handles the shared structure (Navbar, Footer, etc.)
 * for the main website pages.
 */
const MainLayout = () => (
  <>
    <Navbar />
    <ChatWidget />
    <WhatsAppWidget />
    <main className="min-h-screen">
      <Outlet /> {/* Nested routes will render here */}
    </main>
    <Footer />
  </>
);

/**
 * The main App component that sets up the router and all application routes.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that use the MainLayout (with Navbar and Footer) */}
        <Route element={<MainLayout />}>
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
          <Route path="/apply" element={<MultiStepForm />} />
        </Route>

        {/* Standalone routes (like login, signup, dashboard) without the main layout */}
        <Route path="/alshaheen-pro-login" element={<Login />} />
        <Route path="/signup-gvs3245" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Admin route for managing vacancies - NOW PROTECTED */}
        <Route
          path="/admin/vacancies"
          element={
            <ProtectedRoute>
              <VacancyManager />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 Not Found route must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;