import React, { useState } from "react";
const VimshottariTable = ({ data }) => {
  const [selectedPlanet, setSelectedPlanet] = useState(null); // Mahadasha
  const [selectedAntarPlanet, setSelectedAntarPlanet] = useState(null); // Antardasha
  

  const handlePlanetClick = (planet) => {
  setSelectedPlanet(planet);
  setSelectedAntarPlanet(null);
};

const handleAntarPlanetClick = (antarPlanet) => {
  setSelectedAntarPlanet(antarPlanet);
};

const handleLevelUp = () => {
  if (selectedAntarPlanet) {
    setSelectedAntarPlanet(null);
  } else if (selectedPlanet) {
    setSelectedPlanet(null);
  }
};


  return (
    <div className="mt-10 p-6 rounded-xl shadow-inner bg-white/20">
  <h2 className="text-2xl font-bold mb-6 text-indigo-700">
    {!selectedPlanet
      ? "Maha Dasha Periods"
      : !selectedAntarPlanet
      ? `${selectedPlanet} Antardasha`
      : `${selectedPlanet} - ${selectedAntarPlanet} Pratyantardasha`}
  </h2>

  {!selectedPlanet ? (
    // Mahadasha Table
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
  ) : !selectedAntarPlanet ? (
    // Antardasha Table
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
            <tr
              key={antarPlanet}
              className="cursor-pointer hover:bg-[#53476b]"
              onClick={() => handleAntarPlanetClick(antarPlanet)}
            >
              <td className="p-3 border text-center font-medium">
                {selectedPlanet}-{antarPlanet}
              </td>
              <td className="p-3 border text-center">{antarInfo.start_date}</td>
              <td className="p-3 border text-center">{antarInfo.end_date}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  ) : (
    // Pratyantardasha Table
    <table className="w-full table-auto border glass-white shadow-md">
      <thead className="glass-dark">
        <tr>
          <th className="p-3 border">Pratyantardasha Planet</th>
          <th className="p-3 border">Start Date</th>
          <th className="p-3 border">End Date</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(
          data[selectedPlanet]?.antarDasha?.[selectedAntarPlanet]
            ?.pratyantarDasha || {}
        ).map(([pratyPlanet, pratyInfo]) => (
          <tr key={pratyPlanet}>
            <td className="p-3 border text-center font-medium">
              {selectedPlanet}-{selectedAntarPlanet}-{pratyPlanet}
            </td>
            <td className="p-3 border text-center">{pratyInfo.start_date}</td>
            <td className="p-3 border text-center">{pratyInfo.end_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

  <div className="mt-4 text-center">
    <button
      onClick={handleLevelUp}
      className="bg-[#53476b] hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
    >
      Level Up
    </button>
  </div>
</div>

  );
};

export default VimshottariTable;
