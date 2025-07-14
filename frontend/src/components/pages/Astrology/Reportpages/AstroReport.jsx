import React, { useRef, useImperativeHandle, forwardRef, useEffect } from "react";

// Planet shorthand mapping (common for both charts)
const planetShort = {
  Ascendant: "ASC", Sun: "SU", Moon: "MO", Mars: "MA",
  Mercury: "ME", Jupiter: "JU", Venus: "VE", Saturn: "SA",
  Rahu: "RA", Ketu: "KE", Uranus: "UR", Neptune: "NE", Pluto: "PL"
};

const FONT = "Arial"; // Using a common font for canvas text

// Helper function to render a detail row
const DetailRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
    <span style={{ fontWeight: '500', color: '#000' }}>{label} :</span>
    <span style={{ color: '#000' }}>{value}</span>
  </div>
);

// Helper function to render a section title
const SectionTitle = ({ title }) => (
  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #a5b4fc', color: '#000' }}>
    {title}
  </h2>
);

// North Indian Chart Drawing Logic
function drawNorthIndianChart(ctx, size, backendData) {
  if (!ctx || !backendData) return;

  ctx.clearRect(0, 0, size, size); // Clear previous drawings
  ctx.fillStyle = "#FFFFFF"; // Set background to white
  ctx.fillRect(0, 0, size, size);

  const center = size / 2; // Define center here

  ctx.strokeStyle = "#000000"; // Always black for PDF
  ctx.lineWidth = 2; // Slightly thinner lines for better clarity in PDF
  ctx.strokeRect(0, 0, size, size); // Outer border

  // Diamond shape
  ctx.beginPath();
  ctx.moveTo(0, center); ctx.lineTo(center, 0);
  ctx.lineTo(size, center); ctx.lineTo(center, size);
  ctx.closePath(); ctx.stroke();

  // Cross lines
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(size, size);
  ctx.moveTo(size, 0); ctx.lineTo(0, size);
  ctx.stroke();

  const scale = size / 600; // Scale relative to an assumed base size of 600px
  // Adjusted coordinates for better centering and spacing within the 300x300 canvas
  const fixedHouseCoords = [
    { x: 300, y: 90 }, // 1st House (Top Center)
    { x: 150, y: 40 }, // 2nd House
    { x: 50, y: 110 }, // 3rd House
    { x: 150, y: 220 }, // 4th House
    { x: 50, y: 400 }, // 5th House
    { x: 150, y: 500 }, // 6th House
    { x: 300, y: 400 }, // 7th House
    { x: 450, y: 520 }, // 8th House
    { x: 550, y: 450 }, // 9th House
    { x: 450, y: 220 }, // 10th House
    { x: 550, y: 100 }, // 11th House
    { x: 450, y: 30 }  // 12th House
  ].map(pt => ({ x: pt.x * scale, y: pt.y * scale }));

  let ascHouse = 1;
  if (backendData.Ascendant && backendData.Ascendant.house) ascHouse = backendData.Ascendant.house;

  const rotatedHouses = {};
  for (let i = 0; i < 12; i++) {
    const actualHouse = ((ascHouse - 1 + i) % 12) + 1;
    rotatedHouses[actualHouse] = i;
  }

  const planetsByPosition = Array(12).fill(null).map(() => []);
  for (const [planet, details] of Object.entries(backendData)) {
    if (!details || !details.DMS || !details.house) continue; // Skip if data is incomplete

    const short = planetShort[planet] || planet.slice(0, 2).toUpperCase();
    const dmsParts = details.DMS.split(" ");
    const dms = dmsParts.length >= 2 ? `${dmsParts[0]} ${dmsParts[1]}` : details.DMS; // Handle cases where DMS might be simpler
    const label = `${short} ${dms}`;
    const house = details.house;
    const rotatedIndex = rotatedHouses[house];
    if (rotatedIndex !== undefined) {
      planetsByPosition[rotatedIndex].push({ label, isAsc: planet === "Ascendant" });
    }
  }

  ctx.font = `${Math.floor(size * 0.04)}px ${FONT}`; // Slightly larger font for readability
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"; // Center text vertically

  for (let i = 0; i < 12; i++) {
    const { x, y } = fixedHouseCoords[i];
    const houseNum = ((ascHouse - 1 + i) % 12) + 1;

    ctx.fillStyle = "#000000"; // Always black for PDF
    ctx.fillText(houseNum.toString(), x, y - (size * 0.02)); // Adjust position for house number

    if (i === 0) { // Highlight Ascendant house (or 1st house if Ascendant data is missing)
      ctx.beginPath();
      ctx.arc(x + 1, y - (size * 0.02) - (14 * scale / 2), 14 * scale, 0, 2 * Math.PI); // Circle around house number
      ctx.strokeStyle = "#000000"; // Always black for PDF
      ctx.lineWidth = 2; // Thinner circle line
      ctx.stroke();
    }

    // Display planets
    ctx.font = `${Math.floor(size * 0.03)}px ${FONT}`; // Smaller font for planet labels
    planetsByPosition[i].forEach((p, idx) => {
      ctx.fillStyle = "#000000"; // Always black for PDF
      ctx.fillText(p.label, x, y + (idx) * (size * 0.04)); // Adjust vertical spacing
    });
  }
}

// South Indian Chart Drawing Logic
function drawSouthIndianChart(ctx, size, backendData) {
  if (!ctx || !backendData) return;

  ctx.clearRect(0, 0, size, size); // Clear previous drawings
  ctx.fillStyle = "#FFFFFF"; // Set background to white
  ctx.fillRect(0, 0, size, size);

  const cell = size / 4;
  // const fontSize = cell * 0.22; // This variable was unused and can be removed.

  ctx.strokeStyle = "#000000"; // Always black for PDF
  ctx.lineWidth = 2; // Slightly thinner lines
  ctx.strokeRect(0, 0, size, size); // Outer border

  // Draw grid for 4x4 layout
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cell, 0);
    ctx.lineTo(i * cell, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * cell);
    ctx.lineTo(size, i * cell);
    ctx.stroke();
  }

  const scale = size / 600; // Scale relative to an assumed base size of 600px
  // Adjusted coordinates for better centering and spacing within the 300x300 canvas
  const fixedHouseCoords = [
    { x: 75, y: 75 },   // House 1 (Top-Left)
    { x: 225, y: 75 },  // House 2
    { x: 375, y: 75 },  // House 3
    { x: 525, y: 75 },  // House 4
    { x: 525, y: 225 }, // House 5
    { x: 525, y: 375 }, // House 6
    { x: 525, y: 525 }, // House 7
    { x: 375, y: 525 }, // House 8
    { x: 225, y: 525 }, // House 9
    { x: 75, y: 525 },  // House 10
    { x: 75, y: 375 },  // House 11
    { x: 75, y: 225 }   // House 12
  ].map(pt => ({ x: pt.x * scale, y: pt.y * scale }));

  let ascHouse = 1;
  if (backendData.Ascendant && backendData.Ascendant.house) ascHouse = backendData.Ascendant.house;

  const rotatedHouses = {};
  for (let i = 0; i < 12; i++) {
    const actualHouse = ((ascHouse - 1 + i) % 12) + 1;
    rotatedHouses[actualHouse] = i;
  }

  const planetsByPosition = Array(12).fill(null).map(() => []);
  for (const [planet, details] of Object.entries(backendData)) {
    if (!details || !details.DMS || !details.house) continue; // Skip if data is incomplete

    const short = planetShort[planet] || planet.slice(0, 2).toUpperCase();
    const dmsParts = details.DMS.split(" ");
    const dms = dmsParts.length >= 2 ? `${dmsParts[0]} ${dmsParts[1]}` : details.DMS;
    const label = `${short} ${dms}`;
    const house = details.house;
    const rotatedIndex = rotatedHouses[house];
    if (rotatedIndex !== undefined) {
      planetsByPosition[rotatedIndex].push({ label, isAsc: planet === "Ascendant" });
    }
  }

  ctx.font = `${Math.floor(size * 0.04)}px ${FONT}`; // Slightly larger font for readability
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"; // Center text vertically

  for (let i = 0; i < 12; i++) {
    const { x, y } = fixedHouseCoords[i];
    const houseNum = ((ascHouse - 1 + i) % 12) + 1;

    ctx.fillStyle = "#000000"; // Always black for PDF
    ctx.fillText(houseNum.toString(), x, y - (size * 0.02)); // Adjust position for house number

    if (i === 0) { // Highlight Ascendant house (or 1st house if Ascendant data is missing)
      ctx.beginPath();
      ctx.arc(x + 1, y - (size * 0.02) - (14 * scale / 2), 14 * scale, 0, 2 * Math.PI); // Circle around house number
      ctx.strokeStyle = "#000000"; // Always black for PDF
      ctx.lineWidth = 2; // Thinner circle line
      ctx.stroke();
    }

    // Display planets
    ctx.font = `${Math.floor(size * 0.03)}px ${FONT}`; // Smaller font for planet labels
    planetsByPosition[i].forEach((p, idx) => {
      ctx.fillStyle = "#000000"; // Always black for PDF
      ctx.fillText(p.label, x, y + (idx) * (size * 0.04)); // Adjust vertical spacing
    });
  }
}


const AstroReport = forwardRef(({ data }, ref) => {
  const reportRef = useRef();
  const northIndianCanvasRef = useRef(null);
  const southIndianCanvasRef = useRef(null);

  // Dummy data for demonstration if 'data' prop is not fully provided
  const defaultData = [
    {
      DOB: "1990-01-15",
      TOB: "10:30 AM",
      UTC_time: "05:00 UTC",
      location: "New Delhi, India",
      timezone: "Asia/Kolkata (+5:30)",
      nakshatra_name: "Ashwini",
      nakshatra_pada: 1,
      rashi: "Aries", // Changed from Taurus to Aries for consistency with default Moon sign
      nakshtra_all_details: {
        lord: "Ketu",
        deity: "Ashwini Kumaras",
        symbol: "Horse's Head",
        gender: "Male",
        gunas: {
          guna1: "Sattva",
          guna2: "Rajas"
        }
      }
    },
    {
      Ascendant: { Sign: "Aries", Nakshatra: "Ashwini", DMS: "05°00'00\"", house: 1, Status: "Direct" },
      Sun: { Sign: "Capricorn", Nakshatra: "Uttarashada", DMS: "29°45'30\"", house: 10, Status: "Direct" },
      Moon: { Sign: "Aries", Nakshatra: "Ashwini", DMS: "05°10'15\"", house: 1, Status: "Direct" },
      Mars: { Sign: "Libra", Nakshatra: "Swati", DMS: "18°20'00\"", house: 7, Status: "Retrograde" },
      Mercury: { Sign: "Capricorn", Nakshatra: "Sravana", DMS: "15°00'00\"", house: 10, Status: "Direct" },
      Jupiter: { Sign: "Cancer", Nakshatra: "Pushya", DMS: "08°30'45\"", house: 4, Status: "Direct" },
      Venus: { Sign: "Sagittarius", Nakshatra: "Moola", DMS: "22°10'00\"", house: 9, Status: "Direct" },
      Saturn: { Sign: "Capricorn", Nakshatra: "Dhanishta", DMS: "03°55'00\"", house: 10, Status: "Direct" },
      Rahu: { Sign: "Cancer", Nakshatra: "Pushya", DMS: "12°00'00\"", house: 4, Status: "Direct" },
      Ketu: { Sign: "Capricorn", Nakshatra: "Sravana", DMS: "12°00'00\"", house: 10, Status: "Direct" },
    }
  ];

  const reportData = data && data.length === 2 ? data : defaultData;
  const baseData = reportData[0];
  const planets = reportData[1];

  // Effect to draw North Indian Chart
  useEffect(() => {
    if (northIndianCanvasRef.current && planets) {
      const ctx = northIndianCanvasRef.current.getContext("2d");
      // Set canvas dimensions explicitly for html2canvas
      northIndianCanvasRef.current.width = 300;
      northIndianCanvasRef.current.height = 300;
      drawNorthIndianChart(ctx, 300, planets); // Fixed size 300 for PDF
    }
  }, [planets]); // Depend on planets data to redraw

  // Effect to draw South Indian Chart
  useEffect(() => {
    if (southIndianCanvasRef.current && planets) {
      const ctx = southIndianCanvasRef.current.getContext("2d");
      // Set canvas dimensions explicitly for html2canvas
      southIndianCanvasRef.current.width = 300;
      southIndianCanvasRef.current.height = 300;
      drawSouthIndianChart(ctx, 300, planets); // Fixed size 300 for PDF
    }
  }, [planets]); // Depend on planets data to redraw


  useImperativeHandle(ref, () => ({
    async handleDownloadPDF() {
      // Dynamically load html2pdf.js if not already present
      if (!window.html2pdf) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.async = true;
        document.body.appendChild(script);
        // Wait for the script to load
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const element = reportRef.current;

      const opt = {
        margin: 0, // Margins handled by the container padding
        filename: "astrology-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, logging: false }, // Increased scale for better quality, disabled logging
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', 'p', 'h2', 'h3', '.no-break'] } // Added .no-break class
      };

      // Ensure the element is visible before generating PDF if it was hidden
      const originalDisplay = element.style.display;
      const originalPosition = element.style.position;
      const originalLeft = element.style.left;
      const originalTop = element.style.top;

      element.style.position = 'static'; // Make it part of the normal flow temporarily
      element.style.left = '0';
      element.style.top = '0';
      element.style.display = 'block'; // Ensure it's displayed

      try {
        await window.html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error("Error generating PDF:", error);
        // Implement a custom message box here instead of alert()
        // For example: showMessageBox("Failed to generate PDF. Please try again.");
      } finally {
        // Restore original styles
        element.style.display = originalDisplay;
        element.style.position = originalPosition;
        element.style.left = originalLeft;
        element.style.top = originalTop;
      }
    }
  }));


  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
      <div
        ref={reportRef}
        id="astro-report-pdf-container"
        style={{
          fontFamily: 'Arial, sans-serif',
          color: '#333',
          backgroundColor: '#fff',
          width: '8.27in', // A4 width
          minHeight: '11.69in', // A4 height
          padding: '0.75in', // Overall padding for the document
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          lineHeight: '1.5'
        }}
      >
        {/* Report Header */}
        <div style={{ textAlign: 'center', marginBottom: '0.5in' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#4A90E2', marginBottom: '10px' }}>Astrology Birth Report</h1>
          <p style={{ fontSize: '16px', color: '#555' }}>Personalized Natal Chart Analysis</p>
        </div>

        {/* Charts Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '20px', marginBottom: '30px' }}>
          <div style={{ width: 'calc(50% - 10px)', boxSizing: 'border-box', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff', minHeight: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center', marginBottom: '15px', color: '#333' }}>North Indian Rashi Chart</h3>
            <canvas ref={northIndianCanvasRef} width="300" height="300" style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }} />
          </div>
          <div style={{ width: 'calc(50% - 10px)', boxSizing: 'border-box', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff', minHeight: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center', marginBottom: '15px', color: '#333' }}>South Indian Rashi Chart</h3>
            <canvas ref={southIndianCanvasRef} width="300" height="300" style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }} />
          </div>
        </div>

        {/* Basic Information Section */}
        <div style={{ marginBottom: '30px', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          <SectionTitle title="Basic Information" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            <DetailRow label="Date of Birth" value={baseData.DOB} />
            <DetailRow label="Time of Birth" value={`${baseData.TOB} (${baseData.UTC_time})`} />
            <DetailRow label="Location" value={baseData.location} />
            <DetailRow label="Timezone" value={baseData.timezone} />
            <DetailRow label="Nakshatra" value={`${baseData.nakshatra_name} (Pada ${baseData.nakshatra_pada})`} />
            <DetailRow label="Rashi" value={baseData.rashi_name} />
            <DetailRow label="Ayanamasa Used" value={baseData.ayanamasa_Used} />
            <DetailRow label="Julian Day" value={baseData.julian_Day} />
          </div>
        </div>
            
        {baseData.nakshtra_all_details && (
          <div style={{ marginBottom: '30px',paddingTop:'400px', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
            <SectionTitle title="Nakshatra Details" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              <DetailRow label="Varna" value={baseData.nakshtra_all_details.varna} />
              <DetailRow label="Gana" value={baseData.nakshtra_all_details.gana} />
              <DetailRow label="Nadi" value={baseData.nakshtra_all_details.nadi} />
              <DetailRow label="Yoni" value={baseData.nakshtra_all_details.yoni} />
              <DetailRow label="Gender" value={baseData.nakshtra_all_details.gender} />
              <DetailRow label="Guna" value={baseData.nakshtra_all_details.guna} />
              <DetailRow label="Paya" value={baseData.nakshtra_all_details.paya} />
              <DetailRow label="Deity" value={baseData.nakshtra_all_details.deity} />
              <DetailRow label="Fast Day" value={baseData.nakshtra_all_details.fast_day} />
              <DetailRow label="Dosha" value={baseData.nakshtra_all_details.dosha} />
              <DetailRow label="Direction" value={baseData.nakshtra_all_details.direction} />
              <DetailRow label="Favorite Alphabet" value={baseData.nakshtra_all_details.fav_alphabet?.join(', ')} />
              {/* <DetailRow label="Favorite Sign" value={baseData.nakshtra_all_details.fav_sign} /> */}
              <DetailRow label="Mantra" value={baseData.nakshtra_all_details.mantra} />
              <DetailRow label="Ruling Planet" value={baseData.nakshtra_all_details.ruling_planet} />
              <DetailRow label="Symbol" value={baseData.nakshtra_all_details.symbol} />
              <DetailRow label="Tara" value={baseData.nakshtra_all_details.tara} />
              <DetailRow label="Yog" value={baseData.yog_name} />
            </div>
            {baseData.nakshtra_all_details.pada && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>Nakshatra Pada Details:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  {Object.entries(baseData.nakshtra_all_details.pada).map(([key, value]) => (
                    <div key={key} style={{ padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #eee', backgroundColor: '#fff' }}>
                      <h4 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#333' }}>Pada {key}</h4>
                      <DetailRow label="Akshara" value={value.akshara} />
                      <DetailRow label="Navamsa Sign" value={value.navamsa_sign} />
                      <DetailRow label="Rashi" value={value.rashi} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {baseData.rashi_all_details && Object.keys(baseData.rashi_all_details).length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>Rashi Details:</h3>
                {Object.entries(baseData.rashi_all_details).map(([rashiName, rashiDetails]) => (
                  <div key={rashiName} style={{ padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #eee', backgroundColor: '#fff', marginTop: '15px' }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#333' }}>{rashiName}</h4>
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

        {/* Planetary Positions Section */}
        {planets && (
          <div style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
            <SectionTitle title="Planetary Positions" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {Object.entries(planets).map(([planetName, details]) => (
                <div key={planetName} style={{ padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #eee', backgroundColor: '#fff' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>{planetName}</h3>
                  <DetailRow label="Avastha" value={details.Avastha} />
                  <DetailRow label="Combust" value={details.Combust} />
                  <DetailRow label="DMS" value={details.DMS} />
                  <DetailRow label="Degree in Sign" value={details['Degree in sign']?.toString().substring(0, 5)} />
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

        {/* Report Footer */}
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#777', paddingTop: '20px', borderTop: '1px solid #eee', marginTop: 'auto' }}>
          <p>&copy; {new Date().getFullYear()} Astrology Insights. All rights reserved.</p>
          <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
});

export default AstroReport;