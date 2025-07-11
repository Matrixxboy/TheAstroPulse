import React, { useEffect, useRef } from "react";

// Short codes for planet names
const planetShort = {
  "Ascendant": "ASC",
  "Sun": "SU",
  "Moon": "MO",
  "Mars": "MA",
  "Mercury": "ME",
  "Jupiter": "JU",
  "Venus": "VE",
  "Saturn": "SA",
  "Rahu": "RA",
  "Ketu": "KE",
  "Uranus": "UR",
  "Neptune": "NE",
  "Pluto": "PL"
};

const NorthIndianChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const size = Math.min(window.innerWidth, 600);
      canvas.width = size;
      canvas.height = size;
      drawChart(ctx, size, data);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [data]);

  return (
    <div className="flex justify-center items-center p-4">
      <canvas ref={canvasRef} className="border border-gray-400" />
    </div>
  );
};

function drawChart(ctx, size, backendData) {
  const center = size / 2;
  const step = size / 3;

  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;

  // Draw square border
  ctx.strokeRect(0, 0, size, size);

  // Inner lines (diamond + cross)
  ctx.beginPath();
  ctx.moveTo(0, center); ctx.lineTo(center, 0);
  ctx.lineTo(size, center); ctx.lineTo(center, size);
  ctx.closePath();
  ctx.stroke();

  // X across the square
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(size, size);
  ctx.moveTo(size, 0); ctx.lineTo(0, size);
  ctx.stroke();

  // Label positions (house numbers)
  const houseCoords = [
    { x: 300 , y: 90  },  //1
    { x: 150, y: 40 },    //2
    { x: 50, y: 110 },    //3
    { x: 150, y: 220 },   //4
    { x: 50, y: 400 },    //5
    { x: 150, y: 500 },   //6
    { x: 300, y: 400 },   //7
    { x: 450, y: 520 },   //8
    { x: 550, y: 450 },   //9
    { x: 450, y: 350 },   //10
    { x: 550, y: 150 },   //11
    { x: 450, y: 30 },    //12
  ];

  // Re-map planets by house
  const planetsByHouse = {};
  for (const [planet, details] of Object.entries(backendData)) {
    const house = details.house.toString();
    const short = planetShort[planet] || planet.slice(0, 2).toUpperCase();
    const dms = details.DMS.split(" ")[0] + " " + details.DMS.split(" ")[1];
    const label = `${short} ${dms}`;
    if (!planetsByHouse[house]) planetsByHouse[house] = [];
    planetsByHouse[house].push(label);
  }

  // Draw house numbers and planet texts
  ctx.font = `${Math.floor(size * 0.03)}px Arial`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";

  for (let i = 0; i < 12; i++) {
    const houseNum = (i + 1).toString();
    const { x, y } = houseCoords[i];

    // House number
    ctx.fillText(houseNum, x, y);

    // Planets
    if (planetsByHouse[houseNum]) {
      planetsByHouse[houseNum].forEach((p, idx) => {
        ctx.fillStyle = "#ffffff";
        ctx.fillText(p, x, y + (idx + 1) * size * 0.04);
      });
    }

    ctx.fillStyle = "#DDE6E1";
  }
}

export default NorthIndianChart;
