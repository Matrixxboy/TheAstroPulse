import React, { useState } from "react";

const Numerology = () => {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !dob) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/numerology?name=${name}&dob=${dob}`
            );
            const data = await response.json();

            if (data.numerology_report) {
                setResult(data);
            } else {
                setResult({ error: "No numerology report found." });
            }
        } catch (e) {
            setResult({ error: "Failed to fetch numerology report. Please try again.", e });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen px-4 py-12 flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-white w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-cyan-300 mb-6">🔢 Numerology</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Date of Birth</label>
                        <input
                            type="text"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            placeholder="e.g. 2002-08-15"
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-2 rounded-lg transition"
                    >
                        {loading ? "Calculating..." : "Get Numerology Report"}
                    </button>
                </form>

                {result && (
                    <div className="mt-6 p-4 rounded-lg bg-white/20 border border-cyan-300">
                        {result.error ? (
                            <p className="text-red-400">{result.error}</p>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-cyan-200 mb-2">Your Numerology Report</h2>
                                <p className="text-sm text-gray-100">
                                    <strong>Name:</strong> {result.name}
                                </p>
                                <p className="text-sm text-gray-100">
                                    <strong>DOB:</strong> {result.dob}
                                </p>
                                <p className="text-sm mt-2 text-white whitespace-pre-wrap">
                                    {result.numerology_report}
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Numerology;
