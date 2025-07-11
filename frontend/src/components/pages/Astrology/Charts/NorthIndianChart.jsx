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
    <div className="flex flex-col items-center justify-center p-4 font-inter text-white">
      <h2 className="text-2xl font-bold mb-6">North Indian Rasi Chart</h2>
      <canvas ref={canvasRef} className="w-full h-auto rounded shadow-lg" />
  </div>
  );
};

function drawChart(ctx, size, backendData) {
  const center = size / 2;
//   ctx.fillStyle = BG_COLOR;
//   ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth =3;
  ctx.strokeRect(0, 0, size, size);

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

  const scale = size / 600;
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

export default NorthIndianChart;