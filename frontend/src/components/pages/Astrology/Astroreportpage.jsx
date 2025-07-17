import React, { useState } from "react";
import KundaliReportPage from "./Reportpages/KundaliReportPage";

const Astroreportpage = () => {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [lob, setLob] = useState("");
  const [timezone,setTimezone] =useState("Asia/Kolkata");
  const [suggestions, setSuggestions] = useState([]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLobInput = async (value) => {
    setLob(value);
    if (value.length > 2) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}&limit=5`
        );
        const data = await res.json();
        setSuggestions(data.map((place) => place.display_name));
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dob || !tob || !lob || !timezone) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_ASTRO_API_URL}?dob=${dob}&tob=${tob}&lob=${encodeURIComponent(lob)}&timezone=${timezone}`,
        {
          headers: {
            "Astro-API-KEY": import.meta.env.VITE_API_KEY_TOKEN,
          },
        }
      );

      const data = await response.json();
      if (data.error) {
        setResult({ error: data.error });
        showToast("Something went wrong", "error");
      } else {
        setResult(data);
        showToast("Astrology report fetched successfully", "success");
      }
    } catch (e) {
      setResult({ error: "Failed to fetch astrology report. Please try again." });
      showToast("API Error", "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 flex flex-col items-center">
      <div className="flex flex-col items-center w-full  max-w-[100%] sm:max-w-[95%] md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]">
        <h1 className="text-3xl font-bold text-center text-cyan-300 mb-6">Astrology Report Generator 🔮</h1>

        <form onSubmit={handleSubmit} className="flex flex-col w-3/5 space-y-4 relative">
          {/* DOB */}
          <div>
            <label className="block text-sm mb-1 text-white">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* TOB */}
          <div>
            <label className="block text-sm mb-1 text-white">Time of Birth</label>
            <input
              type="time"
              value={tob}
              onChange={(e) => setTob(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* LOB with suggestions */}
          <div className="relative">
            <label className="block text-sm mb-1 text-white">Location of Birth</label>
            <input
              type="text"
              value={lob}
              onChange={(e) => handleLobInput(e.target.value)}
              placeholder="e.g. Surat, Gujarat"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              autoComplete="on"
              required
            />
            {suggestions.length > 0 && (
              <div className="absolute z-50 bg-white text-black w-full mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setLob(item);
                      setSuggestions([]);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
  <label className="block text-sm mb-2 text-violet-300 font-medium tracking-wide">
    Select Timezone:
  </label>
  <select
    id="timezone"
    name="timezone"
    onChange={(e) => setTimezone(e.target.value)}
    className="w-full px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-violet-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-200 cursor-pointer"
  >
    <option value="Asia/Kolkata">Asia/Kolkata</option>
    <option value="America/New_York">America/New_York</option>
    <option value="America/Chicago">America/Chicago</option>
    <option value="America/Denver">America/Denver</option>
    <option value="America/Los_Angeles">America/Los_Angeles</option>
    <option value="Europe/London">Europe/London</option>
    <option value="Europe/Berlin">Europe/Berlin</option>
    <option value="Asia/Dubai">Asia/Dubai</option>
    <option value="Asia/Singapore">Asia/Singapore</option>
    <option value="Asia/Tokyo">Asia/Tokyo</option>
    <option value="Australia/Sydney">Australia/Sydney</option>
    <option value="UTC">UTC</option>
  </select>
</div>

          <div className="relative z-10">
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-2 rounded-lg transition"
              >
              {loading ? "Calculating..." : "Get Astrology Report"}
            </button>
            </div>
        </form>
        
        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white z-50 transition-opacity duration-300 animate-fade-in-up ${
              toast.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 w-full">
            {result.error ? (
              <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
                <p className="font-bold">Error:</p>
                <p>{result.error}</p>
              </div>
            ) : (
              <KundaliReportPage reportData={result} />
            )}
          </div>
        )}
      </div>      
    </div>
  );
};

export default Astroreportpage;
