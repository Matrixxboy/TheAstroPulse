import React, { useRef, useEffect, useState } from "react";
import NorthIndianChartPDF from './NorthchartPDF';
import SouthIndianChartPDF from './SouthchartPDF';

const AstroPDFGenerator = () => {
  const pdfRef = useRef();
  const [isClient, setIsClient] = useState(false);
  const [personalData, setPersonalData] = useState(null);
  const [planetData, setPlanetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    const fetchData = async () => {
      try {
        const response = await fetch('/output.json');
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 1) {
          setPersonalData(data[0]);
          setPlanetData(data[1]);
        } else {
          console.error("Invalid data structure in output.json:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const downloadPDF = () => {
    if (!isClient || typeof window.html2pdf === 'undefined' || !personalData || !planetData) {
      console.error("PDF generation prerequisites not met.");
      return;
    }

    const element = pdfRef.current;
    element.style.display = 'block';

    const opt = {
      margin: 0,
      filename: "Astrology_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    window.html2pdf().set(opt).from(element).save().then(() => {
      element.style.display = 'none';
    });
  };

  const A4_WIDTH_PX = 8.27 * 96;
  const A4_HEIGHT_PX = 11.69 * 96;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Loading astrology data...</p>
      </div>
    );
  }

  if (!personalData || !planetData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-500">Error: Could not load astrology data.</p>
      </div>
    );
  }
  const rashi =Object.keys(personalData.rashi_all_details)[0];
  
  return (
    <div className="p-4 flex flex-col items-center min-h-screen bg-gray-100 font-sans text-gray-800">
      <div ref={pdfRef} className="hidden-for-screen-only">
        {/* Cover Page */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex flex-col justify-center items-center"
             style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px` }}>
          <h1 className="text-6xl font-extrabold">Astrology Report</h1>
          <p className="text-3xl mt-4">{personalData.DOB}</p>
        </div>

        {/* Personal Information Page */}
        <div className="pdf-page p-12">
          <h2 className="text-3xl font-bold text-red-800 border-b-2 border-red-200 pb-2 mb-6">Charts</h2>
          <div className="flex justify-around">
            <NorthIndianChartPDF data={planetData} />
            <SouthIndianChartPDF data={planetData} />
          </div>
          <h2 className="text-3xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2 mb-6">Personal Information</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
            <p><strong>Name :</strong> {personalData.DOB}</p>
            <p><strong>Date of Birth:</strong> {personalData.DOB}</p>
            <p><strong>Birth Day:</strong> {personalData.vara}</p>
            <p><strong>Time of Birth:</strong> {personalData.TOB} (UTC: {personalData.UTC_time})</p>
            <p><strong>Location:</strong> {personalData.location}</p>
            <p><strong>Latitude:</strong> {personalData.latitude}</p>
            <p><strong>Longitude:</strong> {personalData.longitude}</p>
            <p><strong>Timezone:</strong> {personalData.timezone}</p>
          </div>
          <h2 className="text-3xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2 mb-6">Panchang Information</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
            <p><strong>Tithi:</strong> {personalData.tithi}</p>
            <p><strong>Karan:</strong> {personalData.karan_name}</p>
            <p><strong>Yog:</strong> {personalData.yog_name}</p>
            <p><strong>Nakshatra:</strong> {personalData.nakshatra_name} (Pada {personalData.nakshatra_pada})</p>
          </div>
        </div>

        <div className="pdf-page p-12">
          <h2 className="text-3xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2 mb-6">Avakhada Details</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
            <p><strong>Varna:</strong> {personalData.nakshtra_all_details.varna}</p>
            <p><strong>Vashya:</strong> {personalData.rashi_all_details[rashi]?.vashya}</p>
            <p><strong>Yoni:</strong> {personalData.nakshtra_all_details.yoni}</p>
            <p><strong>Gana:</strong> {personalData.nakshtra_all_details.gana}</p>
            <p><strong>Nadi:</strong> {personalData.nakshtra_all_details.nadi}</p>
            <p><strong>Sign:</strong> {rashi}</p>
            <p><strong>Sign Lord:</strong> {personalData.nakshtra_all_details[rashi]?.ruler}</p>
            <p><strong>Nakshtra Charan:</strong> {personalData.nakshatra_pada}</p>
            <p><strong>Yog:</strong> {personalData.yog_name}</p>
            <p><strong>Karan:</strong> {personalData.karan_name}</p>
            <p><strong>Tithi:</strong> {personalData.tithi}</p>
            <p><strong>Gana:</strong> {personalData.nakshtra_all_details.gana}</p>
            <p><strong>Vara (Day):</strong> {personalData.vara}</p>
            <p><strong>Deity:</strong> {personalData.nakshtra_all_details.deity}</p>
            <p><strong>Symbol:</strong> {personalData.nakshtra_all_details.symbol}</p>
            <p><strong>Ruling Planet:</strong> {personalData.nakshtra_all_details.ruling_planet}</p>
            <p><strong>Tatva:</strong> {personalData.rashi_all_details[rashi]?.element}</p>
            <p><strong>Paya:</strong> {personalData.nakshtra_all_details.paya}</p>
            <p><strong>Mantra:</strong> {personalData.nakshtra_all_details.mantra}</p>
          </div>
        </div>

        {/* Planetary Positions Page */}
        <div className="pdf-page p-12">
          <h2 className="text-3xl font-bold text-green-800 border-b-2 border-green-200 pb-2 mb-6">Planetary Positions</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-100">
                <th className="p-3 border">Planet</th>
                <th className="p-3 border">Sign</th>
                <th className="p-3 border">Sign Lord</th>
                <th className="p-3 border">Nakshatra</th>
                <th className="p-3 border">Nakshatra Lord</th>
                <th className="p-3 border">Degree</th>
                <th className="p-3 border">Combust</th>   
                <th className="p-3 border">Avastha</th>
                <th className="p-3 border">House</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(planetData).map(([planet, details]) => (
                <tr key={planet} className="border-b">
                  <td className="p-3 border">{planet}</td>
                  <td className="p-3 border">{details.Sign}</td>
                  <td className="p-3 border">{details.SignLord}</td>
                  <td className="p-3 border">{details.Nakshatra}</td>
                  <td className="p-3 border">{details.NakLord}</td>
                  <td className="p-3 border">{details.DMS}</td>
                  <td className="p-3 border">{details.Combust}</td>
                  <td className="p-3 border">{details.Avastha}</td>
                  <td className="p-3 border">{details.house}</td>
                  <td className="p-3 border">{details.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white text-black p-10 rounded-xl shadow-lg max-w-3xl mx-auto font-serif mb-6">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-4">Astrology Report Preview</h1>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-6 bg-purple-700 text-white py-3 px-6 rounded-full hover:bg-purple-800 transition duration-300"
      >
        Download Styled Astrology PDF
      </button>

      <style jsx>{`
        .pdf-page {
          page-break-after: always;
        }
        .hidden-for-screen-only {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AstroPDFGenerator;
