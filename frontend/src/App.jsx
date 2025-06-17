import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './App.css'

import Horoscope from './components/pages/Horoscope/Horoscope';
import MainLayout from './components/MainLayout';
import HomePage from './components/pages/homepage/HomePage';
import PalmReadingPage from './components/pages/palmreading/PalmReadingPage';


function App() {
  return (
    <Router>
      {/* <ScrollToTop /> */}
      <Routes>
        {/* ✅ Main Site Routes with fancy layout */}
        <Route path='/' element={<MainLayout><HomePage /></MainLayout>} />
        <Route path='/horoscope' element={<MainLayout><Horoscope /></MainLayout>} />
        <Route path='/palmreading' element={<MainLayout><PalmReadingPage /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;