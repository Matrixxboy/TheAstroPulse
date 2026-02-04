import React, { useState } from "react"
import { ArrowLeft, ChevronRight, Star } from "lucide-react"

const VimshottariTable = ({ data }) => {
  const [selectedPlanet, setSelectedPlanet] = useState(null) // Mahadasha
  const [selectedAntarPlanet, setSelectedAntarPlanet] = useState(null) // Antardasha

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet)
    setSelectedAntarPlanet(null)
  }

  const handleAntarPlanetClick = (antarPlanet) => {
    setSelectedAntarPlanet(antarPlanet)
  }

  const handleLevelUp = () => {
    if (selectedAntarPlanet) {
      setSelectedAntarPlanet(null)
    } else if (selectedPlanet) {
      setSelectedPlanet(null)
    }
  }

  return (
    <div className="mt-10 p-4 sm:p-6 rounded-2xl border border-gold/20 shadow-inner bg-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-6">
        {(selectedPlanet || selectedAntarPlanet) && (
          <button
            onClick={handleLevelUp}
            className="p-2 rounded-full bg-white/10 hover:bg-gold/20 text-gold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-xl sm:text-2xl font-bold text-gold flex items-center gap-2">
          <Star className="w-6 h-6 text-saffron" />
          {!selectedPlanet
            ? "Maha Dasha Periods"
            : !selectedAntarPlanet
              ? `${selectedPlanet} Antardasha`
              : `${selectedPlanet} - ${selectedAntarPlanet} Pratyantardasha`}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        {!selectedPlanet ? (
          // Mahadasha Table
          <table className="min-w-full table-auto">
            <thead className="bg-cosmic-dark text-gold border-b border-white/10">
              <tr>
                <th className="p-3 sm:p-4 text-left text-sm sm:text-base font-bold">
                  Planet
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base font-bold">
                  Start Date
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base font-bold">
                  End Date
                </th>
                <th className="p-3 sm:p-4 text-right text-sm sm:text-base"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(data).map(([planet, info]) => (
                <tr
                  key={planet}
                  className="cursor-pointer hover:bg-gold/5 transition-colors group"
                  onClick={() => handlePlanetClick(planet)}
                >
                  <td className="p-3 sm:p-4 text-left font-semibold text-white group-hover:text-gold transition-colors">
                    {planet}
                  </td>
                  <td className="p-3 sm:p-4 text-center text-smoke">
                    {info.start_date}
                  </td>
                  <td className="p-3 sm:p-4 text-center text-smoke">
                    {info.end_date}
                  </td>
                  <td className="p-3 sm:p-4 text-right text-white/40 group-hover:text-gold transition-colors">
                    <ChevronRight className="w-5 h-5 inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : !selectedAntarPlanet ? (
          // Antardasha Table
          <table className="min-w-full table-auto">
            <thead className="bg-cosmic-dark text-gold border-b border-white/10">
              <tr>
                <th className="p-3 sm:p-4 text-left text-sm sm:text-base font-bold">
                  Antardasha Planet
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base font-bold">
                  Start Date
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base font-bold">
                  End Date
                </th>
                <th className="p-3 sm:p-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(data[selectedPlanet].antarDasha || {}).map(
                ([antarPlanet, antarInfo]) => (
                  <tr
                    key={antarPlanet}
                    className="cursor-pointer hover:bg-gold/5 transition-colors group"
                    onClick={() => handleAntarPlanetClick(antarPlanet)}
                  >
                    <td className="p-3 sm:p-4 text-left font-medium text-white group-hover:text-gold transition-colors">
                      {selectedPlanet}-{antarPlanet}
                    </td>
                    <td className="p-3 sm:p-4 text-center text-smoke">
                      {antarInfo.start_date}
                    </td>
                    <td className="p-3 sm:p-4 text-center text-smoke">
                      {antarInfo.end_date}
                    </td>
                    <td className="p-3 sm:p-4 text-right text-white/40 group-hover:text-gold transition-colors">
                      <ChevronRight className="w-5 h-5 inline-block" />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        ) : (
          // Pratyantardasha Table
          <table className="min-w-full table-auto">
            <thead className="bg-cosmic-dark text-gold border-b border-white/10">
              <tr>
                <th className="p-3 sm:p-4 text-left text-sm sm:text-base font-bold">
                  Pratyantardasha Planet
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base font-bold">
                  Start Date
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base font-bold">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(
                data[selectedPlanet]?.antarDasha?.[selectedAntarPlanet]
                  ?.pratyantarDasha || {},
              ).map(([pratyPlanet, pratyInfo]) => (
                <tr
                  key={pratyPlanet}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="p-3 sm:p-4 text-left font-medium text-white">
                    {selectedPlanet}-{selectedAntarPlanet}-{pratyPlanet}
                  </td>
                  <td className="p-3 sm:p-4 text-center text-smoke">
                    {pratyInfo.start_date}
                  </td>
                  <td className="p-3 sm:p-4 text-center text-smoke">
                    {pratyInfo.end_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default VimshottariTable
