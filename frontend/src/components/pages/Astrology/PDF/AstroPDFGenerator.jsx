import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import NorthIndianChartPDF from './NorthchartPDF';
import SouthIndianChartPDF from './SouthchartPDF';

const AstroPDFGenerator = React.forwardRef(({ allData }, ref) => {
  const pdfRef = useRef();
  const [personalData, setPersonalData] = useState(null);
  const [planetData, setPlanetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allData && allData.length > 1) {
      setPersonalData(allData[0]);
      setPlanetData(allData[1]);
    }
    setLoading(false);
  }, [allData]);

  useImperativeHandle(ref, () => ({
    getPDFContent: () => {
        return pdfRef.current;
    }
  }));


    const A4_WIDTH_PX = 794;   // ≈ 794
    const A4_HEIGHT_PX = 1121; // ≈ 1123


  if (loading) {
    return (
      <div></div>
    );
  }

  if (!personalData || !planetData) {
    return (
        <div></div>
    );
  }
  const rashi =Object.keys(personalData.rashi_all_details)[0];
  
  return (
    <div ref={pdfRef}>
        {/* Cover Page */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex flex-col justify-center items-center"
             style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px`, pageBreakAfter: 'always' }}>
          <h1 className="text-6xl font-extrabold">Astrology Report</h1>
          <p className="text-3xl mt-4">{personalData.DOB}</p>
        </div>

        {/* Personal Information Page */}
        <div className="pdf-page p-12" style={{ pageBreakAfter: 'always' }}>
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

        <div className="pdf-page p-12" style={{ pageBreakAfter: 'always' }}>
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
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-green-100">
                <th className="p-1 border">Planet</th>
                <th className="p-1 border">Sign</th>
                <th className="p-1 border">Sign Lord</th>
                <th className="p-1 border">Nakshatra</th>
                <th className="p-1 border">Nakshatra Lord</th>
                <th className="p-1 border">Degree</th>
                <th className="p-1 border">Combust</th>   
                <th className="p-1 border">Avastha</th>
                <th className="p-1 border">House</th>
                <th className="p-1 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(planetData).map(([planet, details]) => (
                <tr key={planet} className="border-b">
                  <td className="p-1 border">{planet}</td>
                  <td className="p-1 border">{details.Sign}</td>
                  <td className="p-1 border">{details.SignLord}</td>
                  <td className="p-1 border">{details.Nakshatra}</td>
                  <td className="p-1 border">{details.NakLord}</td>
                  <td className="p-1 border">{details['Degree in sign'].toString().substring(0,5)}</td>
                  <td className="p-1 border">{details.Combust}</td>
                  <td className="p-1 border">{details.Avastha}</td>
                  <td className="p-1 border">{details.house}</td>
                  <td className="p-1 border">{details.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
});

export default AstroPDFGenerator;
