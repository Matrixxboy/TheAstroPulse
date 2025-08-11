import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './App.css'

import Horoscope from './components/pages/Horoscope/Horoscope';
import MainLayout from './components/MainLayout';
import HomePage from './components/pages/homepage/HomePage';
import PalmReadingPage from './components/pages/palmreading/PalmReadingPage';
import PalmistryInfo from './components/pages/palmreading/PalmistryInfo';
import Numerology from './components/pages/numerology/Numerology';
import NameNumerology from './components/pages/numerology/NameNumerology';
import BuisnessNumerology from './components/pages/numerology/BusinessNumerology'
import Palmreading from './components/pages/palmreading/Palmreading';
import Astrology from './components/pages/Astrology/Astrology';
import Astroinfo from './components/pages/Astrology/Astroinfo';
import Astroreportpage from './components/pages/Astrology/Astroreportpage';
import Test from './components/pages/Astrology/Test';
import AstroPDFGenerator from './components/pages/Astrology/PDF/AstroPDFGenerator';
import Vastu from './components/pages/Vastu/Vastu';
import KnowAboutVastu from './components/pages/Vastu/KnowAboutVastu';
import VastuReport from './components/pages/Vastu/VastuReport';


function App() {
  return (
    <Router>
      {/* <ScrollToTop /> */}
      <Routes>
        {/* ✅ Main Site Routes with fancy layout */}
        <Route path='/' element={<MainLayout><HomePage /></MainLayout>} />
        <Route path='/horoscope' element={<MainLayout><Horoscope /></MainLayout>} />
        <Route path='/palmreading' element={<MainLayout><Palmreading /></MainLayout>} />
        <Route path='/palmreading/palmreadingpage' element={<MainLayout><PalmReadingPage /></MainLayout>} />
        <Route path='/palmreading/PalmistryInfo' element={<MainLayout><PalmistryInfo /></MainLayout>} />
        <Route path='/numerology' element={<MainLayout><Numerology /></MainLayout>} />
        <Route path='/numerology/name-numerology-report' element={<MainLayout><NameNumerology /></MainLayout>} />
        <Route path='/numerology/business-numerology-report' element={<MainLayout><BuisnessNumerology /></MainLayout>} />
        <Route path='/astrology' element={<MainLayout><Astrology /></MainLayout>} />
        <Route path='/astrology/astrologyinfo' element={<MainLayout><Astroinfo /></MainLayout>} />
        <Route path='/astrology/astrologyreport' element={<MainLayout><Astroreportpage /></MainLayout>} />
        <Route path="/test" element={<Test />} />
        <Route path="/pdf" element={<AstroPDFGenerator />} />
        <Route path='/astrology/astroinfo' element={<MainLayout><Astroinfo /></MainLayout>} />
        <Route path='/vastu' element={<MainLayout><Vastu /></MainLayout>} />
        <Route path='/vastu/know-about-vastu' element={<MainLayout><KnowAboutVastu /></MainLayout>} />
        <Route path='/vastu/vastu-report' element={<MainLayout><VastuReport /></MainLayout>} />

      </Routes>
    </Router>
  );
}

export default App;