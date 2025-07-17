import React, { useEffect, useRef } from "react";

// Planet shorthand mapping
const planetShort = {
  Ascendant: "ASC", Sun: "SU", Moon: "MO", Mars: "MA",
  Mercury: "ME", Jupiter: "JU", Venus: "VE", Saturn: "SA",
  Rahu: "RA", Ketu: "KE", Uranus: "UR", Neptune: "NE", Pluto: "PL"
};

const BG_COLOR = "#C29DE6";
const STROKE_COLOR = "#1b1919ff";
const TEXT_COLOR = "#02d1e4";
const PLANET_COLOR = "#00eaff";
const ASC_BORDER_COLOR = "#FFD700";
const ASC_TEXT_COLOR = "#FFD700";
const FONT = "Arial";

const Test1 = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    const resizeCanvas = () => {
      const size = Math.min(window.innerWidth, 600);
      console.log(size)
      canvas.width = size;
      canvas.height = size;
      drawChart(ctx, size, data);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [data]);

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <canvas ref={canvasRef} className="rounded shadow-lg" />
    </div>
  );
};

function drawChart(ctx, size, backendData, isPdfMode) {
  const center = size / 2;
  // ctx.fillStyle = BG_COLOR; // This was commented out in original, keeping it that way
  // ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = isPdfMode ? "#000000" : STROKE_COLOR;
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, size-4, size-4);

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
  const fixedHouseCoords = [
    { x: 300, y: 90 }, 
    { x: 150, y: 40 }, 
    { x: 50, y: 110 },
    { x: 150, y: 220 }, 
    { x: 50, y: 400 }, 
    { x: 150, y: 500 },
    { x: 300, y: 400 }, 
    { x: 450, y: 520 }, 
    { x: 550, y: 450 },
    { x: 450, y: 220 }, 
    { x: 550, y: 100 }, 
    { x: 450, y: 30 }
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
    const fixedNumbers = [
  { num: "1", x: 300, y: 280 },
  { num: "2", x: 150, y: 135 },
  { num: "3", x: 130, y: 155 },
  { num: "4", x: 280, y: 305 },
  { num: "5", x: 130, y: 455 },
  { num: "6", x: 150, y: 475 },
  { num: "7", x: 300, y: 325 },
  { num: "8", x: 450, y: 475 },
  { num: "9", x: 465, y: 455 },
  { num: "10", x: 320, y: 305 },
  { num: "11", x: 470, y: 155 },
  { num: "12", x: 450, y: 135 }
].map(({ num, x, y }) => ({ num, x: x * scale, y: y * scale }));

// Draw fixed house numbers
ctx.font = `${Math.floor(size * 0.025)}px ${FONT}`;
ctx.fillStyle = "#666"; // subtle gray or any muted color
fixedNumbers.forEach(({ num, x, y }) => {
  ctx.fillText(num, x, y);
});
  }
}


const Test = () => {
  const data = {
    "Ascendant": { "DMS": "21° 27' 46\"", "house": 12 },
    "Jupiter": { "DMS": "21° 27' 46\"", "house": 5 },
    "Ketu": { "DMS": "13° 27' 19\"", "house": 7 },
    "Mars": { "DMS": "18° 48' 26\"", "house": 4 },
    "Mercury": { "DMS": "21° 34' 38\"", "house": 4 },
    "Moon": { "DMS": "20° 50' 52\"", "house": 2 },
    "Neptune": { "DMS": "20° 40' 57\"", "house": 10 },
    "Pluto": { "DMS": "26° 10' 48\"", "house": 1 },
    "Rahu": { "DMS": "13° 27' 19\"", "house": 8 },
    "Saturn": { "DMS": "23° 36' 41\"", "house": 3 },
    "Sun": { "DMS": "28° 2' 37\"", "house": 3 },
    "Uranus": { "DMS": "12° 26' 52\"", "house": 11 },
    "Venus": { "DMS": "19° 10' 17\"", "house": 2 }
  };
  return <Test1 data={data} />;
};

export default Test;
