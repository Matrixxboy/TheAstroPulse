import React, { useState, useRef, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { flushSync } from "react-dom"
import SouthIndianChart from "../Charts/SouthIndianChart"
import NorthIndianChart from "../Charts/NorthIndianChart"
import AstroPDFGenerator from "../PDF/AstroPDFGenerator"
import VimshottariDashaTable from "./VimshotarriDasha/VimshottariTable "
import "../PDF/astroPDF.css"
import {
  Download,
  Scroll,
  Star,
  Info,
  Moon,
  Sun,
  MapPin,
  Clock,
} from "lucide-react"
import { motion } from "framer-motion"

// ReportPage component - This will display the fetched data
const KundaliReportPage = ({ reportData, p_name1 }) => {
  const reportRef = useRef()
  const astroPDFGeneratorRef = useRef(null)

  const [isPdfMode, setIsPdfMode] = useState(false)

  const handleDownloadPDF = async () => {
    // Show a loading indicator if needed
    setIsPdfMode(true) // Switch to PDF mode style momentarily for capture if needed, though we run this in iframe.
    // Actually, for the iframe method we handle it separately.

    const iframe = document.createElement("iframe")
    iframe.style.position = "absolute"
    iframe.style.left = "-9999px"
    iframe.style.top = "-9999px"
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document

    // --- Start of new CSS handling ---
    const stylePromises = Array.from(document.styleSheets).map((sheet) => {
      if (sheet.href) {
        return fetch(sheet.href)
          .then((res) => res.text())
          .catch((e) => "")
      } else {
        return Promise.resolve(
          Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n"),
        )
      }
    })

    const styles = await Promise.all(stylePromises)
    const styleEl = iframeDoc.createElement("style")
    styleEl.textContent = styles.join("\n")
    iframeDoc.head.appendChild(styleEl)
    // --- End of new CSS handling ---

    const printContent = (
      <AstroPDFGenerator allData={reportData} p_name={p_name1} />
    )
    const printContainer = iframeDoc.createElement("div")
    iframeDoc.body.appendChild(printContainer)

    const root = createRoot(printContainer)
    flushSync(() => {
      root.render(printContent)
    })

    setTimeout(() => {
      iframe.contentWindow.scrollTo(0, 0)
      const opt = {
        margin: 0,
        filename: `${p_name1}_Astrology_Report.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          scrollY: 0,
          scrollX: 0,
          logging: false,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      }

      if (window.html2pdf) {
        window
          .html2pdf()
          .set(opt)
          .from(iframe.contentDocument.body)
          .save()
          .then(() => {
            document.body.removeChild(iframe)
            setIsPdfMode(false)
          })
      } else {
        console.error("html2pdf not found")
        setIsPdfMode(false)
      }
    }, 3000) // Delay for render
  }

  // Ensure reportData is valid before rendering
  if (!reportData || !Array.isArray(reportData) || reportData.length < 2) {
    return (
      <div className="text-center text-red-200 bg-red-500/20 p-6 rounded-2xl border border-red-500/50">
        <p className="font-bold flex items-center justify-center gap-2">
          <Info className="w-5 h-5" /> Error
        </p>
        <p>Invalid report data received. Please try again.</p>
      </div>
    )
  }

  const basicInfo = reportData[0]
  const planetDetails = reportData[1]
  const vimshottariDetails = reportData[2]
  const ascHouse = planetDetails["Ascendant"]?.house || 1

  // Helper function to render a detail row
  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-white/5 last:border-b-0 group hover:bg-white/5 transition-colors px-2 rounded-lg">
      <span
        className={`font-medium ${isPdfMode ? "text-black" : "text-smoke group-hover:text-gold transition-colors"}`}
      >
        {label} :
      </span>
      <span
        className={`${isPdfMode ? "text-black" : "text-white font-medium text-right"}`}
      >
        {value}
      </span>
    </div>
  )

  // Helper function to render a section title
  const SectionTitle = ({ title, icon: Icon }) => (
    <h2
      className={`text-xl font-bold mb-4 pb-2 border-b border-gold/30 flex items-center gap-2 ${isPdfMode ? "text-black" : "text-gradient-gold"}`}
    >
      {Icon && <Icon className="w-5 h-5 text-saffron" />} {title}
    </h2>
  )

  const pdfContainerClass = isPdfMode ? "bg-white text-black" : "bg-transparent"

  const rashiDetailsColorClass = isPdfMode ? "text-black" : "text-saffron"
  const padaDetailsColorClass = isPdfMode ? "text-black" : "text-gold"
  const planetDetailsColorClass = isPdfMode ? "text-black" : "text-gold"

  return (
    <>
      <div className="text-center mb-8">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Download className="w-5 h-5" /> Download Full PDF Report
        </button>
      </div>

      <div
        id="pdf-container"
        ref={reportRef}
        className={`w-full ${pdfContainerClass}`}
      >
        {!isPdfMode && (
          <h1 className="text-3xl font-heading font-bold text-center mb-10 text-gradient-gold">
            Astrology Birth Report
          </h1>
        )}

        <div className="flex flex-wrap justify-center gap-6 md:gap-10 p-2 mb-10">
          <div className="w-full lg:w-[48%] max-w-[500px] glass p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center">
            <h3 className="text-lg font-bold text-gold mb-4">
              North Indian Chart
            </h3>
            <NorthIndianChart data={planetDetails} isPdfMode={isPdfMode} />
          </div>
          <div className="w-full lg:w-[48%] max-w-[500px] glass p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center">
            <h3 className="text-lg font-bold text-gold mb-4">
              South Indian Chart
            </h3>
            <SouthIndianChart data={planetDetails} isPdfMode={isPdfMode} />
          </div>
        </div>

        {/* Basic Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-10 p-6 md:p-8 rounded-3xl shadow-lg border border-gold/20 backdrop-blur-md ${isPdfMode ? "bg-white" : "bg-white/5"}`}
        >
          <SectionTitle title="Basic Information" icon={Info} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            <DetailRow label="Date of Birth" value={basicInfo.DOB} />
            <DetailRow label="Time of Birth" value={basicInfo.TOB} />
            <DetailRow label="Location" value={basicInfo.location} />
            <DetailRow label="Latitude" value={basicInfo.latitude} />
            <DetailRow label="Longitude" value={basicInfo.longitude} />
            <DetailRow label="Timezone" value={basicInfo.timezone} />
            <DetailRow
              label="Ayanamasa Used"
              value={basicInfo.ayanamasa_Used}
            />
            <DetailRow label="Julian Day" value={basicInfo.julian_Day} />
          </div>
        </motion.div>

        {/* Avakhada Details Section */}
        {basicInfo.nakshtra_all_details && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mb-10 p-6 md:p-8 rounded-3xl shadow-lg border border-gold/20 backdrop-blur-md ${isPdfMode ? "bg-white" : "bg-white/5"}`}
          >
            <SectionTitle title="Avakhada Details" icon={Star} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              <DetailRow
                label="Varna"
                value={basicInfo.nakshtra_all_details.varna}
              />
              <DetailRow
                label="Nakshatra Name"
                value={basicInfo.nakshatra_name}
              />
              <DetailRow
                label="Nakshatra Pada"
                value={basicInfo.nakshatra_pada}
              />
              <DetailRow
                label="Nakshatra Index"
                value={basicInfo.nakshatra_index}
              />
              <DetailRow
                label="Gana"
                value={basicInfo.nakshtra_all_details.gana}
              />
              <DetailRow
                label="Nadi"
                value={basicInfo.nakshtra_all_details.nadi}
              />
              <DetailRow
                label="Yoni"
                value={basicInfo.nakshtra_all_details.yoni}
              />
              <DetailRow
                label="Gender"
                value={basicInfo.nakshtra_all_details.gender}
              />
              <DetailRow
                label="Guna"
                value={basicInfo.nakshtra_all_details.guna}
              />
              <DetailRow
                label="Paya"
                value={basicInfo.nakshtra_all_details.paya}
              />
              <DetailRow
                label="Deity"
                value={basicInfo.nakshtra_all_details.deity}
              />
              <DetailRow
                label="Fast Day"
                value={basicInfo.nakshtra_all_details.fast_day}
              />
              <DetailRow
                label="Dosha"
                value={basicInfo.nakshtra_all_details.dosha}
              />
              <DetailRow
                label="Direction"
                value={basicInfo.nakshtra_all_details.direction}
              />
              <DetailRow
                label="Favorite Alphabet"
                value={basicInfo.nakshtra_all_details.fav_alphabet?.join(", ")}
              />
              <DetailRow
                label="Favorite Sign"
                value={basicInfo.nakshtra_all_details.fav_sign}
              />
              <DetailRow
                label="Mantra"
                value={basicInfo.nakshtra_all_details.mantra}
              />
              <DetailRow
                label="Ruling Planet"
                value={basicInfo.nakshtra_all_details.ruling_planet}
              />
              <DetailRow
                label="Symbol"
                value={basicInfo.nakshtra_all_details.symbol}
              />
              <DetailRow
                label="Tara"
                value={basicInfo.nakshtra_all_details.tara}
              />
              <DetailRow label="Yog" value={basicInfo.yog_name} />
            </div>

            {basicInfo.nakshtra_all_details.pada && (
              <div className="mt-8">
                <h3
                  className={`text-lg font-bold mb-4 ${padaDetailsColorClass} flex items-center gap-2`}
                >
                  <Info className="w-4 h-4" /> Nakshatra Pada Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(basicInfo.nakshtra_all_details.pada).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className={`p-4 rounded-xl border border-white/10 ${isPdfMode ? "bg-white" : "bg-white/5"}`}
                      >
                        <h4
                          className={`font-bold text-center mb-3 ${padaDetailsColorClass}`}
                        >
                          Pada {key}
                        </h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-smoke">Akshara:</span>{" "}
                            <span className="text-white">{value.akshara}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-smoke">Navamsa:</span>{" "}
                            <span className="text-white">
                              {value.navamsa_sign}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-smoke">Rashi:</span>{" "}
                            <span className="text-white">{value.rashi}</span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {basicInfo.rashi_all_details &&
              Object.keys(basicInfo.rashi_all_details).length > 0 && (
                <div className="mt-8">
                  <h3
                    className={`text-lg font-bold mb-4 ${rashiDetailsColorClass} flex items-center gap-2`}
                  >
                    <Moon className="w-4 h-4" /> Rashi Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(basicInfo.rashi_all_details).map(
                      ([rashiName, rashiDetails]) => (
                        <div
                          key={rashiName}
                          className={`p-5 rounded-2xl border border-white/10 ${isPdfMode ? "bg-white" : "glass"}`}
                        >
                          <h4
                            className={`font-bold text-lg mb-3 ${rashiDetailsColorClass} text-center`}
                          >
                            {rashiName}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-smoke">Element:</span>{" "}
                              <span className="text-white">
                                {rashiDetails.element}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-smoke">Ruler:</span>{" "}
                              <span className="text-white font-semibold text-gold">
                                {rashiDetails.ruler}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-smoke">Quality:</span>{" "}
                              <span className="text-white">
                                {rashiDetails.quality}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-smoke">Nature:</span>{" "}
                              <span className="text-white">
                                {rashiDetails.nature}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-smoke">Dosha:</span>{" "}
                              <span className="text-white">
                                {rashiDetails.dosha}
                              </span>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </motion.div>
        )}

        {/* Panchang Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-10 p-6 md:p-8 rounded-3xl shadow-lg border border-gold/20 backdrop-blur-md ${isPdfMode ? "bg-white" : "bg-white/5"}`}
        >
          <SectionTitle title="Panchang Details" icon={Scroll} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <span className="block text-smoke text-sm mb-1">Vara</span>
              <span className="text-xl font-bold text-white">
                {basicInfo.vara}
              </span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <span className="block text-smoke text-sm mb-1">Tithi</span>
              <span className="text-xl font-bold text-white">
                {basicInfo.tithi}
              </span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <span className="block text-smoke text-sm mb-1">Karan</span>
              <span className="text-xl font-bold text-white">
                {basicInfo.karan_name}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Planet Details Section (Optional, if you want to include it) */}
        {planetDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mb-10 p-6 md:p-8 rounded-3xl shadow-lg border border-gold/20 backdrop-blur-md ${isPdfMode ? "bg-white" : "bg-white/5"}`}
          >
            <SectionTitle title="Planet Details" icon={Sun} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(planetDetails).map(([planetName, details]) => (
                <div
                  key={planetName}
                  className={`p-5 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors ${isPdfMode ? "bg-white" : "bg-white/5"}`}
                >
                  <h3
                    className={`text-xl font-bold mb-4 ${planetDetailsColorClass} flex items-center gap-2`}
                  >
                    {planetName === "Sun" ? (
                      <Sun className="w-5 h-5 text-saffron" />
                    ) : planetName === "Moon" ? (
                      <Moon className="w-5 h-5 text-gray-300" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20"></div>
                    )}
                    {planetName}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-smoke">Sign:</span>{" "}
                      <span className="text-white font-medium">
                        {details.Sign}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-smoke">Nakshatra:</span>{" "}
                      <span className="text-white">{details.Nakshatra}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-smoke">DMS:</span>{" "}
                      <span className="text-white font-mono text-xs">
                        {details.DMS}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-smoke">House:</span>{" "}
                      <span className="text-white">{details.house}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-smoke">Status:</span>
                      <span
                        className={`${details.Status === "Retrograde" ? "text-red-400" : "text-green-400"}`}
                      >
                        {details.Status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        <div className="mb-20">
          <VimshottariDashaTable data={vimshottariDetails.vimshottariDasha} />
        </div>
      </div>
      <div className="pdf-render-container">
        {/* <AstroPDFGenerator allData={reportData} p_name={p_name1} ref={astroPDFGeneratorRef} /> */}
      </div>
    </>
  )
}

export default KundaliReportPage
