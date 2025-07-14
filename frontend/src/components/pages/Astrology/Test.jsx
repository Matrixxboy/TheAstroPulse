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

function drawChart(ctx, size, backendData) {
  const cell = size / 4;
  const fontSize = cell * 0.22;

  ctx.strokeStyle = STROKE_COLOR;
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


  const scale = size / 600;
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

    ctx.fillStyle = TEXT_COLOR;
    ctx.fillText(houseNum.toString(), x, y);

    if (i === 0) {
      ctx.beginPath();
      ctx.arc(x+1, y - 8, 14 * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = ASC_BORDER_COLOR;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    planetsByPosition[i].forEach((p, idx) => {
      ctx.fillStyle = p.isAsc ? ASC_TEXT_COLOR : PLANET_COLOR;
      ctx.fillText(p.label, x, y + (idx + 1) * (size * 0.04));
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
