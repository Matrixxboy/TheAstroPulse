import React from "react";

// This is the 0-indexed list of Rashi names
const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// This array defines the layout of the South Indian chart.
// Each element is a Rashi name, or null for an empty cell.
// The layout is a 4x4 grid, read row by row, representing the 12 houses.
const CHART_LAYOUT = [
  "Pisces", "Aries",    "Taurus",  "Gemini",
  "Aquarius",    null,      null,        "Cancer",
  "Capricorn", null,      null,        "Leo",
  "Sagittarius","Scorpio", "Libra","Virgo"
];

const SouthIndianChart = ({ planets, lagnaSign }) => {
  // Create a map of Rashi name to a list of planet objects
  const getPlanetsByRashi = () => {
    const rashiMap = {};
    RASHI_NAMES.forEach(rashi => (rashiMap[rashi] = [])); // Initialize all signs

    // Place planets in their respective rashis
    if (planets) {
        Object.entries(planets).forEach(([planetName, details]) => {
          // 'Ascendant' is not a planet, it's the lagna.
          if (planetName.toLowerCase() === 'ascendant') return;

          const rashi = details.Sign; // Get the Rashi name from planet details
          if (rashiMap[rashi]) {
            const shortName = planetName.substring(0, 2).toUpperCase();
            const angle_val = details.DMS.substring(0, 7);
            rashiMap[rashi].push({ planet: shortName, angle: angle_val });
          }
        });
    }
    return rashiMap;
  };

  const planetsInRashis = getPlanetsByRashi();
  const lagnaIndex = RASHI_NAMES.indexOf(lagnaSign);

  return (
    <div className="flex flex-col items-center justify-center p-4 font-inter text-white">
      <h2 className="text-2xl font-bold mb-6">South Indian Rasi Chart</h2>
      <div className="grid grid-cols-4 w-[400px] h-[400px] border-2 border-white">
        {CHART_LAYOUT.map((rashi, index) => {
          // Handle the central empty space
          if (rashi === null) {
            if (index === 5) {
              return (
                <div key={index} className="col-span-2 row-span-2 flex items-center justify-center border border-gray-500">
                  <h3 className="text-lg font-semibold">Rasi Chart</h3>
                </div>
              );
            }
            return null;
          }

          const rashiIndex = RASHI_NAMES.indexOf(rashi);
          const signNumber = rashiIndex + 1;
          const houseNumber = (rashiIndex - lagnaIndex + 12) % 12 + 1;
          const isLagna = rashi === lagnaSign;
          const rashiPlanets = planetsInRashis[rashi] || [];

          return (
            <div
              key={index}
              className={`border border-gray-500 p-2 flex flex-col ${isLagna ? 'bg-indigo-900' : ''}`}
            >
              <div className="text-xs font-semibold text-cyan-300 flex justify-between">
                <span>{rashi} ({signNumber})</span>
                <span className='text-yellow-400'>{houseNumber}</span>
              </div>
              <div className="flex-grow flex flex-col items-center justify-center text-center">
                {isLagna && <span className="text-red-500 font-bold">Asc</span>}
                <div className="w-full mt-1">
                  {rashiPlanets.map(({ planet, angle }, i) => (
                    <div key={i} className="grid grid-cols-2 text-xs gap-x-2">
                      <span className="font-semibold text-left">{planet}</span>
                      <span className="text-gray-400 text-right">{angle}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SouthIndianChart;
