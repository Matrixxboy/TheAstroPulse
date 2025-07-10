import React, { useState } from "react";

const Horoscope = () => {
    const [dob, setDob] = useState("");
    const [day, setDay] = useState("today");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dob || !day) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(
                `${VITE_HOROSCOPE_API_KEY}?dob=${dob}&day=${day}`
            );
            const data = await response.json();

            if (data.horoscope) {
                setResult(data);
            } else {
                setResult({ error: "No horoscope found." });
            }
        } catch (e) {
            setResult({ error: "Failed to fetch horoscope. Please try again.",e });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen py-12 flex flex-col items-center ">
           <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[40%]">
                <h1 className="text-3xl font-bold text-center text-yellow-300 mb-6">Horoscope</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Date of Birth</label>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            placeholder="e.g. 2002-08-15"
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <div className="relative w-full">
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Select Day
                        </label>
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full appearance-none cursor-pointer bg-white/20 text-white py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ease-in-out duration-150 backdrop-blur-md"
                        >
                            <option value="yesterday" className="bg-slate-900 text-white">Yesterday</option>
                            <option value="today" className="bg-slate-900 text-white">Today</option>
                            <option value="tomorrow" className="bg-slate-900 text-white">Tomorrow</option>
                        </select>

                        {/* Custom dropdown arrow */}
                        <div className="pointer-events-none absolute inset-y-0 mt-4 right-3 flex items-center">
                            <svg
                            className="h-4 w-4 text-gray-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-lg transition"
                    >
                        {loading ? "Fetching..." : "Get Horoscope"}
                    </button>
                </form>

                {result && (
                    <div className="mt-6 p-4 rounded-lg bg-white/20 border border-yellow-300">
                        {result.error ? (
                            <p className="text-red-400">{result.error}</p>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-yellow-200 mb-2">Your Horoscope </h2>
                                <p className="text-sm text-gray-100">
                                    <strong>DOB:</strong> {result.dob}
                                </p>
                                <p className="text-sm text-gray-100">
                                    <strong>Your Zodic Sign:</strong> {result.zodiac_sign}
                                </p>
                                <p className="text-sm text-gray-100">
                                    <strong>Day:</strong> {result.day_type}
                                </p>
                                <p className="text-sm mt-2 text-white whitespace-pre-wrap">
                                    {result.horoscope}
                                </p>
                                {/* <p className="text-xs text-green-400 mt-2">{result.message}</p> */}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Horoscope;
