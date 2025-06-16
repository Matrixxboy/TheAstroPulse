import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './App.css'

import Horoscope from './components/pages/Horoscope/Horoscope';


function App() {
  return (
    <Router>
      {/* <ScrollToTop /> */}
      <Routes>
        {/* ✅ Main Site Routes with fancy layout */}
        <Route path='/horoscope' element={<Horoscope />} />
      </Routes>
    </Router>
  );
}

export default App;