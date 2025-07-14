import React, { useEffect, useRef } from "react";

// Planet shorthand mapping
const planetShort = {
  Ascendant: "ASC", Sun: "SU", Moon: "MO", Mars: "MA",
  Mercury: "ME", Jupiter: "JU", Venus: "VE", Saturn: "SA",
  Rahu: "RA", Ketu: "KE", Uranus: "UR", Neptune: "NE", Pluto: "PL"
};

const BG_COLOR = "#C29DE6";
const STROKE_COLOR = "#fefefe";
const TEXT_COLOR = "#02d1e4";
const PLANET_COLOR = "#00eaff";
const ASC_BORDER_COLOR = "#FFD700";
const ASC_TEXT_COLOR = "#FFD700";
const FONT = "Arial";

const SouthIndianChart = ({ data, isPdfMode }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null); // Ref for the parent container

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      // Get the current computed size of the parent container
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Use the minimum of the container's width and height to maintain aspect ratio
      // This ensures the chart scales down gracefully on smaller screens
      const size = Math.min(containerWidth, containerHeight);
      
      canvas.width = size;
      canvas.height = size;
      drawChart(ctx, size, data, isPdfMode);
    };

    // Initial resize and draw
    resizeCanvas();

    // Add event listener for window resize
    window.addEventListener("resize", resizeCanvas);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [data, isPdfMode]); // Depend on data and isPdfMode to redraw if data changes

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center p-2 font-inter text-white">
      <h2 className="text-lg lg:text-2xl font-bold mb-6">South Indian Rashi Chart</h2>
      {/* The canvas should fill its parent, and the parent's size will be managed by Tailwind's flex/p-4 */}
      <canvas ref={canvasRef} className="w-full h-auto rounded shadow-lg" />
    </div>
  );
};

function drawChart(ctx, size, backendData, isPdfMode) {
  const cell = size / 4;
  const fontSize = cell * 0.22;

  ctx.strokeStyle = isPdfMode ? "#000000" : STROKE_COLOR;
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, size-4, size-4);
  
  ctx.beginPath();
  ctx.moveTo(size/2 , size/2 + size/4);      
  ctx.lineTo(size / 2, size);             
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size/2 , 0);      
  ctx.lineTo(size/2, size/4);             
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size/2+size/4,size/2);      
  ctx.lineTo(size, size/2);             
  ctx.stroke();


  ctx.beginPath();
  ctx.moveTo(0 , size/2);      
  ctx.lineTo(size/4, size/2);             
  ctx.stroke();

  // Draw grid
  for (let i = 0; i < 5; i++) {
    if(i == 1 || i == 3){
      const pos = i * cell;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }
  }

  const scale = size / 600; // Scale relative to an assumed base size of 600px
  const fixedHouseCoords = [
    { x: 225, y: 25 }, 
    { x: 375, y: 25 }, 
    { x: 525, y: 25 },
    { x: 525, y: 170 }, 
    { x: 525, y: 320 }, 
    { x: 525, y: 470 },
    { x: 375, y: 470 }, 
    { x: 225, y: 470 }, 
    { x: 75, y: 470 },
    { x: 75, y: 320 }, 
    { x: 75, y: 170 }, 
    { x: 75, y: 25 }
  ].map(pt => ({ x: pt.x * scale, y: pt.y * scale }));

  let ascHouse = 1;
  if (backendData.Ascendant) ascHouse = backendData.Ascendant.house;

  const rotatedHouses = {};
  for (let i = 0; i < 12; i++) {
    const actualHouse = ((ascHouse - 1 + i) % 12) + 1;
    rotatedHouses[actualHouse] = i;
  }

  const planetsByPosition = Array(12).fill(null).map(() => []);
  for (const [planet, details] of Object.entries(backendData)) {
    const short = planetShort[planet] || planet.slice(0, 2).toUpperCase();
    const dms = details.DMS.split(" ")[0] + " " + details.DMS.split(" ")[1];
    const label = `${short} ${dms}`;
    const house = details.house;
    const rotatedIndex = rotatedHouses[house];
    if (rotatedIndex !== undefined) {
      planetsByPosition[rotatedIndex].push({ label, isAsc: planet === "Ascendant" });
    }
  }

  ctx.font = `${Math.floor(size * 0.03)}px ${FONT}`;
  ctx.textAlign = "center";

  for (let i = 0; i < 12; i++) {
    const { x, y } = fixedHouseCoords[i];
    const houseNum = ((ascHouse - 1 + i) % 12) + 1;

    ctx.fillStyle = isPdfMode ? "#000000" : TEXT_COLOR;
    ctx.fillText(houseNum.toString(), x, y);

    if (i === 0) {
      ctx.beginPath();
      ctx.arc(x + 1, y - 8, 14 * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = isPdfMode ? "#000000" : ASC_BORDER_COLOR;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    planetsByPosition[i].forEach((p, idx) => {
      ctx.fillStyle = isPdfMode ? "#000000" : (p.isAsc ? ASC_TEXT_COLOR : PLANET_COLOR);
      ctx.fillText(p.label, x, y + (idx + 1) * (size * 0.04));
    });
  }
}

export default SouthIndianChart;