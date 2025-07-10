import React from 'react';

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// This array defines the fixed positions of the houses in the North Indian chart.
// The `gridArea` corresponds to a 4x4 grid that creates the diamond shape.
const HOUSE_POSITIONS = [
    { house: 1, gridArea: '1 / 1 / 3 / 3' },
    { house: 2, gridArea: '1 / 3 / 3 / 5' },
    { house: 3, gridArea: '3 / 3 / 5 / 5' },
    { house: 4, gridArea: '3 / 1 / 5 / 3' },
    { house: 5, gridArea: '3 / 2 / 4 / 3' },
    { house: 6, gridArea: '2 / 2 / 3 / 3' },
    { house: 7, gridArea: '2 / 1 / 3 / 2' },
    { house: 8, gridArea: '1 / 2 / 2 / 3' },
    { house: 9, gridArea: '2 / 3 / 3 / 4' },
    { house: 10, gridArea: '3 / 3 / 4 / 4' },
    { house: 11, gridArea: '3 / 4 / 4 / 5' },
    { house: 12, gridArea: '2 / 4 / 3 / 5' },
];

const NorthIndianChart = ({ planets, lagnaSign }) => {
  const lagnaRashiIndex = RASHI_NAMES.indexOf(lagnaSign);

  if (lagnaRashiIndex === -1) {
    return <div className="text-red-500">Invalid Lagna Sign: {lagnaSign}</div>;
  }

  // Group planets by the house they are in.
  const planetsByHouse = {};
  for (let i = 1; i <= 12; i++) {
    planetsByHouse[i] = [];
  }

  if (planets) {
    Object.entries(planets).forEach(([planet, details]) => {
      if (planet.toLowerCase() !== 'ascendant') {
        const house = details.house;
        if (planetsByHouse[house]) {
          const shortName = planet.substring(0, 2).toUpperCase();
          planetsByHouse[house].push(shortName);
        }
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 p-4 font-inter text-white">
      <h2 className="text-2xl font-bold mb-6">North Indian Chart</h2>
      <div className="relative w-[400px] h-[400px]">
        {/* Create the diamond shape with rotated divs */}
        <div className="absolute w-full h-full transform rotate-45">
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
            <div className="border-2 border-white"></div>
            <div className="border-2 border-white"></div>
            <div className="border-2 border-white"></div>
            <div className="border-2 border-white"></div>
          </div>
        </div>

        {/* Place houses within the chart */}
        <div className="absolute w-full h-full">
          {HOUSE_POSITIONS.map(({ house }) => {
            const rashiIndex = (lagnaRashiIndex + house - 1) % 12;
            const rashiNumber = rashiIndex + 1;
            const housePlanets = planetsByHouse[house] || [];
            
            // This mapping is for positioning the houses visually in the grid
            const positionMap = {
                1: { top: '5%', left: '40%' },
                2: { top: '20%', left: '60%' },
                3: { top: '40%', left: '75%' },
                4: { top: '60%', left: '60%' },
                5: { top: '75%', left: '40%' },
                6: { top: '60%', left: '20%' },
                7: { top: '40%', left: '5%' },
                8: { top: '20%', left: '20%' },
                9: { top: '27%', left: '40%' },
                10: { top: '40%', left: '52%' },
                11: { top: '52%', left: '40%' },
                12: { top: '40%', left: '27%' },
            };
            
            // A different positioning for the central houses
            if(house > 8){
                 positionMap[9] = { top: '27%', left: '52%' };
                 positionMap[10] = { top: '40%', left: '65%' };
                 positionMap[11] = { top: '52%', left: '52%' };
                 positionMap[12] = { top: '52%', left: '40%' };
            }


            return (
              <div
                key={house}
                className="absolute text-center"
                style={positionMap[house]}
              >
                <div className="text-cyan-400 text-xs mb-1">({rashiNumber})</div>
                <div className="font-bold text-sm">
                  {house === 1 && <span className="text-red-500">As </span>}
                  {housePlanets.join(' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NorthIndianChart;