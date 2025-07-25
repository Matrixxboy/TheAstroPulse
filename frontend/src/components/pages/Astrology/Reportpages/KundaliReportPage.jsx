import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import SouthIndianChart from '../Charts/SouthIndianChart';
import NorthIndianChart from '../Charts/NorthIndianChart';
import AstroReport from './AstroReport';
import AstroPDFGenerator from '../PDF/AstroPDFGenerator';


// ReportPage component - This will display the fetched data
const KundaliReportPage = ({ reportData }) => {
  const reportRef = useRef();
  const astroPDFGeneratorRef = useRef(null);

  const [isPdfMode, setIsPdfMode] = useState(false);

  const handleDownloadPDF = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    const printContent = (
        <AstroPDFGenerator allData={reportData} />
    );

    const printContainer = iframeDoc.createElement('div');
    iframeDoc.body.appendChild(printContainer);

    // Copy styles
    Array.from(document.styleSheets).forEach(sheet => {
        if (sheet.href) {
            const link = iframeDoc.createElement('link');
            link.rel = 'stylesheet';
            link.href = sheet.href;
            iframeDoc.head.appendChild(link);
        } else if (sheet.cssRules) {
            const style = iframeDoc.createElement('style');
            style.textContent = Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
            iframeDoc.head.appendChild(style);
        }
    });

    const root = createRoot(printContainer);
    flushSync(() => {
        root.render(printContent);
    });

    setTimeout(() => {
        const opt = {
            margin: 0,
            filename: 'Astrology_Report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };

        window.html2pdf().set(opt).from(iframe.contentDocument.body).save().then(() => {
            document.body.removeChild(iframe);
        });
    }, 1000); // Delay to ensure rendering
  };

  // Ensure reportData is valid before rendering
  if (!reportData || !Array.isArray(reportData) || reportData.length < 2) {
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
        <p className="font-bold">Error:</p>
        <p>Invalid report data received. Please try again.</p>
      </div>
    );
  }

  const basicInfo = reportData[0];
  const planetDetails = reportData[1];
  const ascHouse = planetDetails['Ascendant']?.house || 1;

  // Helper function to render a detail row
  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
      <span className={`font-medium ${textColorClass}`}>{label} :</span>
      <span className={detailRowColorClass}>{value}</span>
    </div>
  );

  // Helper function to render a section title
  const SectionTitle = ({ title }) => (
    <h2 className={`text-2xl font-semibold mb-4 pb-2 border-b-2 border-indigo-300 ${sectionTitleColorClass}`}>
      {title}
    </h2>
  );

  const pdfContainerClass = isPdfMode ? 'bg-white text-black' : 'bg-white/20 rounded-2xl';
  const textColorClass = isPdfMode ? 'text-black' : 'text-white';
  const sectionTitleColorClass = isPdfMode ? 'text-black' : 'text-white';
  const detailRowColorClass = isPdfMode ? 'text-black' : 'text-gray';
  const rashiDetailsColorClass = isPdfMode ? 'text-black' : 'text-indigo-600';
  const padaDetailsColorClass = isPdfMode ? 'text-black' : 'text-[#9CE2ED]';
  const planetDetailsColorClass = isPdfMode ? 'text-black' : 'text-indigo-700';


  return (
    <>
      <div className="text-center mb-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-2 px-6 rounded-lg transition"
        >
          Download PDF
        </button>
      </div>
      {/* <div className=''>
        <AstroPDFGenerator allData={reportData} />
      </div> */}
      <div id="pdf-container" ref={reportRef} className={`min-h-screen min-w-screen p-6 sm:p-8 lg:p-10 ${pdfContainerClass}`}>
        <h1 className={`text-4xl font-extrabold text-center mb-8 tracking-tight ${isPdfMode ? 'text-black' : 'text-[#22d3ee]'}`}>
          Astrology Birth Report
        </h1>
        <div className="flex flex-wrap justify-center gap-1 p-2">
          <div className="w-full sm:w-[70%] max-w-[450px]">
            <NorthIndianChart data={planetDetails} isPdfMode={isPdfMode} />
          </div>
          <div className="w-full sm:w-[70%] max-w-[450px]">
            <SouthIndianChart data={planetDetails} isPdfMode={isPdfMode} />
          </div>
        </div>
        
        {/* Basic Information Section */}
        <div className={`mb-10 p-6 rounded-xl shadow-inner ${isPdfMode ? 'bg-white' : 'bg-white/20'}`}>
          <SectionTitle title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow label="Date of Birth" value={basicInfo.DOB} />
            <DetailRow label="Time of Birth" value={basicInfo.TOB} />
            <DetailRow label="Location" value={basicInfo.location} />
            <DetailRow label="Latitude" value={basicInfo.latitude} />
            <DetailRow label="Longitude" value={basicInfo.longitude} />
            <DetailRow label="Timezone" value={basicInfo.timezone} />
            <DetailRow label="Ayanamasa Used" value={basicInfo.ayanamasa_Used} />
            <DetailRow label="Julian Day" value={basicInfo.julian_Day} />
          </div>
        </div>

        {/* Avakhada Details Section */}
        {basicInfo.nakshtra_all_details && (
          <div className={`mb-10 p-6 rounded-xl shadow-inner ${isPdfMode ? 'bg-white' : 'bg-white/20'}`}>
            <SectionTitle title="Avakhada Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="Varna" value={basicInfo.nakshtra_all_details.varna} />
              <DetailRow label="Nakshatra Name" value={basicInfo.nakshatra_name} />
              <DetailRow label="Nakshatra Pada" value={basicInfo.nakshatra_pada} />
              <DetailRow label="Nakshatra Index" value={basicInfo.nakshatra_index} />
              <DetailRow label="Gana" value={basicInfo.nakshtra_all_details.gana} />
              <DetailRow label="Nadi" value={basicInfo.nakshtra_all_details.nadi} />
              <DetailRow label="Yoni" value={basicInfo.nakshtra_all_details.yoni} />
              <DetailRow label="Gender" value={basicInfo.nakshtra_all_details.gender} />
              <DetailRow label="Guna" value={basicInfo.nakshtra_all_details.guna} />
              <DetailRow label="Paya" value={basicInfo.nakshtra_all_details.paya} />
              <DetailRow label="Deity" value={basicInfo.nakshtra_all_details.deity} />
              <DetailRow label="Fast Day" value={basicInfo.nakshtra_all_details.fast_day} />
              <DetailRow label="Dosha" value={basicInfo.nakshtra_all_details.dosha} />
              <DetailRow label="Direction" value={basicInfo.nakshtra_all_details.direction} />
              <DetailRow label="Favorite Alphabet" value={basicInfo.nakshtra_all_details.fav_alphabet?.join(', ')} />
              <DetailRow label="Favorite Sign" value={basicInfo.nakshtra_all_details.fav_sign} />
              <DetailRow label="Mantra" value={basicInfo.nakshtra_all_details.mantra} />
              <DetailRow label="Ruling Planet" value={basicInfo.nakshtra_all_details.ruling_planet} />
              <DetailRow label="Symbol" value={basicInfo.nakshtra_all_details.symbol} />
              <DetailRow label="Tara" value={basicInfo.nakshtra_all_details.tara} />
              <DetailRow label="Yog" value={basicInfo.yog_name} />
            </div>
            {basicInfo.nakshtra_all_details.pada && (
              <div className="mt-6">
                <h3 className={`text-xl font-semibold mb-3 ${padaDetailsColorClass}`}>Nakshatra Pada Details:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(basicInfo.nakshtra_all_details.pada).map(([key, value]) => (
                    <div key={key} className={`p-4 rounded-lg shadow-sm border border-gray-200 ${isPdfMode ? 'bg-white' : 'bg-white/20'}`}>
                      <h4 className={`font-bold text-lg mb-2 ${padaDetailsColorClass}`}>Pada {key}</h4>
                      <DetailRow label="Akshara" value={value.akshara} />
                      <DetailRow label="Navamsa Sign" value={value.navamsa_sign} />
                      <DetailRow label="Rashi" value={value.rashi} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {basicInfo.rashi_all_details && Object.keys(basicInfo.rashi_all_details).length > 0 && (
              <div className="mt-6">
                <h3 className={`text-xl font-semibold mb-3 ${rashiDetailsColorClass}`}>Rashi Details:</h3>
                {Object.entries(basicInfo.rashi_all_details).map(([rashiName, rashiDetails]) => (
                  <div key={rashiName} className={`p-4 rounded-lg shadow-sm border border-gray-200 mt-4 ${isPdfMode ? 'bg-white' : 'bg-white/20'}`}>
                    <h4 className={`font-bold text-lg mb-2 ${rashiDetailsColorClass}`}>{rashiName}</h4>
                    <DetailRow label="Body Part" value={rashiDetails.body_part} />
                    <DetailRow label="Direction" value={rashiDetails.direction} />
                    <DetailRow label="Dosha" value={rashiDetails.dosha} />
                    <DetailRow label="Element" value={rashiDetails.element} />
                    <DetailRow label="Gender" value={rashiDetails.gender} />
                    <DetailRow label="Nature" value={rashiDetails.nature} />
                    <DetailRow label="Quality" value={rashiDetails.quality} />
                    <DetailRow label="Ruler" value={rashiDetails.ruler} />
                    <DetailRow label="Vashya" value={rashiDetails.vashya} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Panchang Details Section */}
        <div className={`p-6 rounded-xl shadow-inner ${isPdfMode ? 'bg-white' : 'bg-white/20'}`}>
          <SectionTitle title="Panchang Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow label="Vara" value={basicInfo.vara} />
            <DetailRow label="Tithi" value={basicInfo.tithi} />
            <DetailRow label="Karan" value={basicInfo.karan_name} />
          </div>
        </div>

        {/* Planet Details Section (Optional, if you want to include it) */}
        {planetDetails && (
          <div className={`mt-10 p-6 rounded-xl shadow-inner ${isPdfMode ? 'bg-white' : 'bg-white/20'}`}>
            <SectionTitle title="Planet Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(planetDetails).map(([planetName, details]) => (
                <div key={planetName} className={`p-4 rounded-lg shadow-md border border-gray-200 ${isPdfMode ? 'bg-white' : 'bg-white/20'}`}>
                  <h3 className={`text-xl font-bold mb-3 ${planetDetailsColorClass}`}>{planetName}</h3>
                  <DetailRow label="Sign" value={details.Sign} />
                  <DetailRow label="Sign Lord" value={details.SignLord} />
                  <DetailRow label="Nakshatra Lord" value={details.NakLord} />
                  <DetailRow label="Nakshatra" value={details.Nakshatra} />
                  <DetailRow label="DMS" value={details.DMS} />
                  <DetailRow label="Degree in Sign" value={details['Degree in sign'].toString().substring(0,5)} />
                  <DetailRow label="Longitude" value={details.Longitude} />
                  <DetailRow label="Avastha" value={details.Avastha} />
                  <DetailRow label="Status" value={details.Status} />
                  <DetailRow label="Combust" value={details.Combust} />
                  <DetailRow label="Sign House" value={details.house} />
                  <DetailRow label="Actual House" value={((details.house - ascHouse + 12) % 12) + 1} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="pdf-render-container">
        <AstroPDFGenerator allData={reportData} ref={astroPDFGeneratorRef} />
      </div>
    </>
  );
};

export default KundaliReportPage;