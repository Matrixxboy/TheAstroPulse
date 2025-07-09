import React from "react";

// Map house number to box index (1-based)
const northIndianPositions = {
  1: "house-1",
  2: "house-2",
  3: "house-3",
  4: "house-4",
  5: "house-5",
  6: "house-6",
  7: "house-7",
  8: "house-8",
  9: "house-9",
  10: "house-10",
  11: "house-11",
  12: "house-12"
};

const NorthIndianChart = ({ planets }) => {
  const getPlanetsByHouse = () => {
    const houseMap = {};
    Object.entries(planets).forEach(([planet, details]) => {
      const house = details.house;
      if (!houseMap[house]) houseMap[house] = [];
      houseMap[house].push(planet);
    });
    return houseMap;
  };

  const housePlanets = getPlanetsByHouse();

  return (
    <div className="w-[320px] h-[320px] grid grid-cols-3 grid-rows-3 border border-white relative text-xs text-white">
      {Array.from({ length: 9 }).map((_, idx) => (
        <div
          key={idx}
          className="border border-white flex items-center justify-center h-full w-full"
        >
          {/* Empty grid box for spacing */}
        </div>
      ))}

      {/* Custom absolute positioning for houses inside the chart */}
      {Object.entries(northIndianPositions).map(([house, className]) => (
        <div
          key={house}
          className={`absolute ${getHousePositionStyle(house)} border border-white p-1 text-center`}
        >
          <div className="font-bold text-cyan-300">House {house}</div>
          <div className="text-xs leading-tight whitespace-pre-wrap">
            {planetsInHouse.map((p, i) => (
              <div key={i}>{p}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper for positioning
const getHousePositionStyle = (house) => {
  const base = "w-[100px] h-[100px]";
  const posMap = {
    1: "top-[110px] left-[220px]",
    2: "top-[220px] left-[220px]",
    3: "top-[220px] left-[110px]",
    4: "top-[220px] left-[0px]",
    5: "top-[110px] left-[0px]",
    6: "top-[0px] left-[0px]",
    7: "top-[0px] left-[110px]",
    8: "top-[0px] left-[220px]",
    9: "top-[0px] left-[110px]",
    10: "top-[110px] left-[110px]",
    11: "top-[220px] left-[110px]",
    12: "top-[110px] left-[220px]"
  };
  return `${base} ${posMap[house] || ""}`;
};

export default NorthIndianChart;
