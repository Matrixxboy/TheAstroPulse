import React, { useState } from 'react';
import SouthIndianChart from '../Charts/SouthIndianChart';
import NorthIndianChart from '../Charts/NorthIndianChart';

// ReportPage component - This will display the fetched data
const KundaliReportPage = ({ reportData }) => {
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

  // Helper function to render a detail row
  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
      <span className="font-medium text-white ">{label} :</span>
      <span className="text-gray">{value}</span>
    </div>
  );

  // Helper function to render a section title
  const SectionTitle = ({ title }) => (
    <h2 className="text-2xl font-semibold text-white mb-4 pb-2 border-b-2 border-indigo-300">
      {title}
    </h2>
  );

  return (
      <div className="min-h-screen min-w-screen bg-white/20 rounded-2xl p-6 sm:p-8 lg:p-10">
        <h1 className="text-4xl font-extrabold text-center text-[#22d3ee] mb-8 tracking-tight">
          Astrology Birth Report
        </h1>
        <div className="flex flex-wrap justify-center gap-1 p-2">
          <div className="w-full sm:w-[70%] max-w-[450px]">
            <NorthIndianChart data={planetDetails} />
          </div>
          <div className="w-full sm:w-[70%] max-w-[450px]">
            <SouthIndianChart data={planetDetails} />
          </div>
        </div>
        
        {/* Basic Information Section */}
        <div className="mb-10 p-6 bg-white/20 rounded-xl shadow-inner">
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
          <div className="mb-10 p-6 bg-white/20 rounded-xl shadow-inner">
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
                <h3 className="text-xl font-semibold text-[#9CE2ED] mb-3">Nakshatra Pada Details:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(basicInfo.nakshtra_all_details.pada).map(([key, value]) => (
                    <div key={key} className="bg-white/20 p-4 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="font-bold text-lg text-[#9CE2ED] mb-2">Pada {key}</h4>
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
                <h3 className="text-xl font-semibold text-[#9CE2ED] mb-3">Rashi Details:</h3>
                {Object.entries(basicInfo.rashi_all_details).map(([rashiName, rashiDetails]) => (
                  <div key={rashiName} className="bg-white/20    p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
                    <h4 className="font-bold text-lg text-indigo-600 mb-2">{rashiName}</h4>
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
        <div className="p-6 p-6 bg-white/20 rounded-xl shadow-inner">
          <SectionTitle title="Panchang Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow label="Vara" value={basicInfo.vara} />
            <DetailRow label="Tithi" value={basicInfo.tithi} />
            <DetailRow label="Karan" value={basicInfo.karan_name} />
          </div>
        </div>

        {/* Planet Details Section (Optional, if you want to include it) */}
        {planetDetails && (
          <div className="mt-10 p-6 bg-white/20 rounded-xl shadow-inner">
            <SectionTitle title="Planet Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(planetDetails).map(([planetName, details]) => (
                <div key={planetName} className="bg-white/20 p-4 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold text-indigo-700 mb-3">{planetName}</h3>
                  <DetailRow label="Avastha" value={details.Avastha} />
                  <DetailRow label="Combust" value={details.Combust} />
                  <DetailRow label="DMS" value={details.DMS} />
                  <DetailRow label="Degree in Sign" value={details['Degree in sign'].toString().substring(0,5)} />
                  <DetailRow label="Longitude" value={details.Longitude} />
                  <DetailRow label="Nakshatra Lord" value={details.NakLord} />
                  <DetailRow label="Nakshatra" value={details.Nakshatra} />
                  <DetailRow label="Sign" value={details.Sign} />
                  <DetailRow label="Sign Lord" value={details.SignLord} />
                  <DetailRow label="Status" value={details.Status} />
                  <DetailRow label="House" value={details.house} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );
};

export default KundaliReportPage;