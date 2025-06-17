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
                `http://127.0.0.1:5000/horoscope?dob=${dob}&day=${day}`
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
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-white w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-yellow-300 mb-6">🔮 Horoscope</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Date of Birth</label>
                        <input
                            type="text"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            placeholder="e.g. 2002-08-15"
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Select Day</label>
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="yesterday">Yesterday</option>
                            <option value="today">Today</option>
                            <option value="tomorrow">Tomorrow</option>
                        </select>
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
