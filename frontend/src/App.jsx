import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "./App.css"

import MainLayout from "./components/MainLayout"
import HomePage from "./components/pages/homepage/HomePage"
import Horoscope from "./components/pages/Horoscope/Horoscope"
import Palmreading from "./components/pages/palmreading/Palmreading"
import PalmReadingPage from "./components/pages/palmreading/PalmReadingPage"
import PalmistryInfo from "./components/pages/palmreading/PalmistryInfo"
import Numerology from "./components/pages/numerology/Numerology"
import NameNumerology from "./components/pages/numerology/NameNumerology"
import BuisnessNumerology from "./components/pages/numerology/BusinessNumerology"
import Astrology from "./components/pages/Astrology/Astrology"
import Astroinfo from "./components/pages/Astrology/astroinfo"
import Astroreportpage from "./components/pages/Astrology/Astroreportpage"
import Vastu from "./components/pages/Vastu/Vastu"
import KnowAboutVastu from "./components/pages/Vastu/KnowAboutVastu"
import VastuReport from "./components/pages/Vastu/VastuReport"
import Compass from "./components/pages/Vastu/Compass"
import Festival from "./components/pages/Festivals/Festival"
import LiveDarshan from "./components/pages/LiveDarshan/LiveDarshan"
import AboutUs from "./components/pages/AboutUs/AboutUs"
import NotFound from "./components/pages/NotFound"

import Panchang from "./components/pages/Panchang/Panchang"
import Muhurat from "./components/pages/Muhurat/Muhurat"
import Remedies from "./components/pages/Remedies/Remedies"
import VedicAstrology from "./components/pages/Knowledge/VedicAstrology"
import Blog from "./components/pages/Knowledge/Blog"
import FAQ from "./components/pages/Knowledge/FAQ"
import Contact from "./components/pages/Contact/Contact"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/horoscope"
          element={
            <MainLayout>
              <Horoscope />
            </MainLayout>
          }
        />

        <Route
          path="/palmreading"
          element={
            <MainLayout>
              <Palmreading />
            </MainLayout>
          }
        />
        <Route
          path="/palmreading/palmreadingpage"
          element={
            <MainLayout>
              <PalmReadingPage />
            </MainLayout>
          }
        />
        <Route
          path="/palmreading/PalmistryInfo"
          element={
            <MainLayout>
              <PalmistryInfo />
            </MainLayout>
          }
        />

        <Route
          path="/numerology"
          element={
            <MainLayout>
              <Numerology />
            </MainLayout>
          }
        />
        <Route
          path="/numerology/name-numerology-report"
          element={
            <MainLayout>
              <NameNumerology />
            </MainLayout>
          }
        />
        <Route
          path="/numerology/business-numerology-report"
          element={
            <MainLayout>
              <BuisnessNumerology />
            </MainLayout>
          }
        />

        <Route
          path="/kundali"
          element={
            <MainLayout>
              <Astrology />
            </MainLayout>
          }
        />
        <Route
          path="/kundali/astrologyinfo"
          element={
            <MainLayout>
              <Astroinfo />
            </MainLayout>
          }
        />
        <Route
          path="/kundali/astroinfo"
          element={
            <MainLayout>
              <Astroinfo />
            </MainLayout>
          }
        />
        <Route
          path="/kundali/astrologyreport"
          element={
            <MainLayout>
              <Astroreportpage />
            </MainLayout>
          }
        />
        <Route
          path="/vastu"
          element={
            <MainLayout>
              <Vastu />
            </MainLayout>
          }
        />
        <Route
          path="/vastu/know-about-vastu"
          element={
            <MainLayout>
              <KnowAboutVastu />
            </MainLayout>
          }
        />
        <Route
          path="/vastu/vastu-report"
          element={
            <MainLayout>
              <VastuReport />
            </MainLayout>
          }
        />
        <Route
          path="/vastu/compass"
          element={
            <MainLayout>
              <Compass />
            </MainLayout>
          }
        />

        <Route
          path="/festivals"
          element={
            <MainLayout>
              <Festival />
            </MainLayout>
          }
        />
        <Route
          path="/live-darshan"
          element={
            <MainLayout>
              <LiveDarshan />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <AboutUs />
            </MainLayout>
          }
        />

        {/* New Pages Routes */}
        <Route
          path="/panchang"
          element={
            <MainLayout>
              <Panchang />
            </MainLayout>
          }
        />
        <Route
          path="/muhurat"
          element={
            <MainLayout>
              <Muhurat />
            </MainLayout>
          }
        />
        <Route
          path="/remedies"
          element={
            <MainLayout>
              <Remedies />
            </MainLayout>
          }
        />
        <Route
          path="/vedic-astrology"
          element={
            <MainLayout>
              <VedicAstrology />
            </MainLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <MainLayout>
              <Blog />
            </MainLayout>
          }
        />
        <Route
          path="/faqs"
          element={
            <MainLayout>
              <FAQ />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
