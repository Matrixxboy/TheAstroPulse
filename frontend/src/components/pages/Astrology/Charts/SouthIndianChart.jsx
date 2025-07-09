import React from "react";

// Define the fixed order of signs relative to the Lagna for South Indian Chart
// If Lagna is Aries, then Lagna_Rashi_Index_0 is 0 (Aries)
// This array represents the Rashi that will appear in each fixed box,
// starting from the Lagna box (top-middle).
// The order is clockwise.
const SOUTH_INDIAN_CHART_RASHI_ORDER = [
  // Row 1 (Top)
  null, // Placeholder for the first empty cell
  0,    // Lagna (1st Rashi) - Top Middle
  null, // Placeholder for the third empty cell

  // Row 2 (Middle)
  11,   // 12th Rashi - Middle Left
  null, // Center (not a Rashi box)
  1,    // 2nd Rashi - Middle Right

  // Row 3 (Bottom)
  10,   // 11th Rashi - Bottom Left
  9,    // 10th Rashi - Bottom Middle
  8     // 9th Rashi - Bottom Right
];

// This is the 0-indexed list of Rashi names
const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SouthIndianChart = ({ planets, lagnaSign }) => {
  // lagnaSign should be the name of the Ascendant sign (e.g., "Aries")

  // Create a map of Rashi name to list of planets in that Rashi
  const getPlanetsByRashi = () => {
    const rashiMap = {};
    RASHI_NAMES.forEach(rashi => (rashiMap[rashi] = [])); // Initialize all signs

    Object.entries(planets).forEach(([planetName, details]) => {
      const rashi = details.Sign; // Get the Rashi name from planet details
      if (rashiMap[rashi]) {
        rashiMap[rashi].push(planetName);
      }
    });
    return rashiMap;
  };

  const planetsInRashis = getPlanetsByRashi();

  // Determine the 0-based index of the Lagna Sign
  const lagnaIndex = RASHI_NAMES.indexOf(lagnaSign);
  if (lagnaIndex === -1) {
    console.error(`Lagna sign '${lagnaSign}' not found in RASHI_NAMES.`);
    return <div className="text-red-500">Error: Invalid Lagna Sign.</div>;
  }

  // Calculate the actual Rashi for each box in the fixed South Indian layout
  const chartBoxes = SOUTH_INDIAN_CHART_RASHI_ORDER.map(offset => {
    if (offset === null) return null; // Empty placeholder box

    const actualRashiIndex = (lagnaIndex + offset) % 12;
    return RASHI_NAMES[actualRashiIndex];
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 font-inter">
      <h2 className="text-2xl font-bold text-white mb-6">South Indian Kundali Chart</h2>
      <div className="relative w-[360px] h-[360px] border-2 border-white bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Main 3x3 Grid for the Chart Boxes */}
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
          {/* Top Row */}
          <div className="border-r border-b border-white flex flex-col items-center justify-center p-1 text-white text-xs">
            {/* House 12 - Top Left */}
            <span className="text-cyan-300 font-semibold">House 12</span>
            <span className="font-bold text-lg">{chartBoxes[3]}</span> {/* 12th Rashi */}
            <span className="text-gray-400">{(planetsInRashis[chartBoxes[3]] || []).join(", ")}</span>
          </div>
          <div className="border-r border-b border-white flex flex-col items-center justify-center p-1 text-white text-xs">
            {/* House 1 - Top Middle (Lagna) */}
            <span className="text-cyan-300 font-semibold">House 1 (Lagna)</span>
            <span className="font-bold text-lg">{chartBoxes[1]}</span> {/* Lagna Rashi */}
            <span className="text-gray-400">{(planetsInRashis[chartBoxes[1]] || []).join(", ")}</span>
          </div>
          <div className="border-b border-white flex flex-col items-center justify-center p-1 text-white text-xs">
            {/* House 2 - Top Right */}
            <span className="text-cyan-300 font-semibold">House 2</span>
            <span className="font-bold text-lg">{chartBoxes[5]}</span> {/* 2nd Rashi */}
            <span className="text-gray-400">{(planetsInRashis[chartBoxes[5]] || []).join(", ")}</span>
          </div>

          {/* Middle Row */}
          <div className="border-r border-b border-white flex flex-col items-center justify-center p-1 text-white text-xs">
            {/* House 11 - Middle Left */}
            <span className="text-cyan-300 font-semibold">House 11</span>
            <span className="font-bold text-lg">{chartBoxes[6]}</span> {/* 11th Rashi */}
            <span className="text-gray-400">{(planetsInRashis[chartBoxes[6]] || []).join(", ")}</span>
          </div>
          <div className="border-r border-b border-white flex flex-col items-center justify-center p-1 text-white text-xs">
            {/* Center Box - Not a house, often empty or for general info */}
            <span className="text-gray-500"></span>
            <span className="text-gray-500"></span>
            <span className="text-gray-500"></span>
          </div>
          <div className="border-b border-white flex flex-col items-center justify-center p-1 text-white text-xs">
            {/* House 3 - Middle Right */}
            <span className="text-cyan-300 font-semibold">House 3</span>
            <span className="font-bold text-lg">{chartBoxes[7]}</span> {/* 3rd Rashi */}
            <span className="text-gray-400">{(planetsInRashis[chartBoxes[7]] || []).join(", ")}</span>
          </div>

          {/* Bottom Row */}
          <div className="border-r border-white flex flex-col items-center justify-center p-1 text-white text-xs">
            {/* House 10 - Bottom Left */}
            <span className="text-cyan-300 font-semibold">House 10</span>
            <span className="font-bold text-lg">{chartBoxes[8]}</span> {/* 10th Rashi */}
            <span className="text-gray-400">{(planetsInRashis[chartBoxes[8]] || []).join(", ")}</span>
          </div>
          <div className="border-r border-white flex flex-col items-center justify-center p-1 text-white text-xs">
            {/* House 9 - Bottom Middle */}
            <span className="text-cyan-300 font-semibold">House 9</span>
            <span className="font-bold text-lg">{chartBoxes[9]}</span> {/* 9th Rashi */}
            <span className="text-gray-400">{(planetsInRashis[chartBoxes[9]] || []).join(", ")}</span>
          </div>
          <div className="border-white flex flex-col items-center justify-center p-1 text-white text-xs">
            {/* House 8 - Bottom Right */}
            <span className="text-cyan-300 font-semibold">House 8</span>
            <span className="font-bold text-lg">{chartBoxes[10]}</span> {/* 8th Rashi */}
            <span className="text-gray-400">{(planetsInRashis[chartBoxes[10]] || []).join(", ")}</span>
          </div>
        </div>

        {/* Diagonal Lines - South Indian Chart Style */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Main diagonals */}
          <div className="absolute top-0 left-0 w-full h-full border-b-2 border-r-2 border-white transform origin-top-left rotate-45 scale-x-[1.414] scale-y-[1.414] translate-x-[-50%] translate-y-[-50%]"></div>
          <div className="absolute top-0 right-0 w-full h-full border-b-2 border-l-2 border-white transform origin-top-right -rotate-45 scale-x-[1.414] scale-y-[1.414] translate-x-[50%] translate-y-[-50%]"></div>
          {/* Inner diagonals for the central square */}
          <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border-b-2 border-r-2 border-white transform origin-top-left rotate-45 scale-x-[1.414] scale-y-[1.414] translate-x-[-50%] translate-y-[-50%]"></div>
          <div className="absolute top-1/3 right-1/3 w-1/3 h-1/3 border-b-2 border-l-2 border-white transform origin-top-right -rotate-45 scale-x-[1.414] scale-y-[1.414] translate-x-[50%] translate-y-[-50%]"></div>
        </div>
      </div>
    </div>
  );
};

export default SouthIndianChart;
