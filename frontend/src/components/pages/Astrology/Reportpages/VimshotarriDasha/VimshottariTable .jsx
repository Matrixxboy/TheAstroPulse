import React, { useState } from "react";

const VimshottariTable = ({ data }) => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
  };

  const handleLevelUp = () => {
    setSelectedPlanet(null);
  };

  return (
    <div className="mt-10 p-6 rounded-xl shadow-inner bg-white/20">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">
        {selectedPlanet ? `${selectedPlanet} Antardasha` : "Maha Dasha Periods"}
      </h2>

      {!selectedPlanet ? (
        <table className="w-full table-auto border border-gray-300 shadow-md">
          <thead className="glass-dark">
            <tr>
              <th className="p-3 border">Planet</th>
              <th className="p-3 border">Start Date</th>
              <th className="p-3 border">End Date</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([planet, info]) => (
              <tr
                key={planet}
                className="cursor-pointer hover:bg-[#53476b]"
                onClick={() => handlePlanetClick(planet)}
              >
                <td className="p-3 border text-center font-semibold">{planet}</td>
                <td className="p-3 border text-center">{info.start_date}</td>
                <td className="p-3 border text-center">{info.end_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <table className="w-full table-auto border glass-white shadow-md">
            <thead className="glass-dark">
              <tr>
                <th className="p-3 border">Antardasha Planet</th>
                <th className="p-3 border">Start Date</th>
                <th className="p-3 border">End Date</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data[selectedPlanet].antarDasha || {}).map(
                ([antarPlanet, antarInfo]) => (
                  <tr key={antarPlanet}>
                    <td className="p-3 border text-center font-medium">{selectedPlanet}-{antarPlanet}</td>
                    <td className="p-3 border text-center">{antarInfo.start_date}</td>
                    <td className="p-3 border text-center">{antarInfo.end_date}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <div className="mt-4 text-center">
            <button
              onClick={handleLevelUp}
              className="bg-[#53476b] hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
            >
              Level Up
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VimshottariTable;
