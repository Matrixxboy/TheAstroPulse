import React, { useState } from "react";

const BusinessNumerology = () => {
    const [name, setName] = useState("");
    const [cuname, setCuname] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000); // hide after 3 sec
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) return;

        setCuname(name);

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BUSINESS_NUMCALCU_API_KEY}?bname=${name}`,
                // `http://127.0.0.1:5000/business-numerology?bname=${name}`,
                {
                headers:{
                    "Numlogy-API-KEY": import.meta.env.VITE_API_KEY_TOKEN,
                },
            }
            );
            const data = await response.json();
            if (data.error) {
                setResult({ error: data.error });
                showToast("Something went wrong", "error");

            } else {
                setResult(data);  
                showToast("Numerology report fetched successfully", "success");
            }
        } catch (e) {
            setResult({ error: "Failed to fetch numerology report. Please try again.", e });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen py-12 flex flex-col items-center ">
           <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[40%]">
                <h1 className="text-3xl font-bold text-center text-cyan-300 mb-6">Business Numerology</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Business Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. The Astral Pulse"
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
                {toast && (
                    <div
                        className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white z-50 transition-opacity duration-300 animate-fade-in-up ${
                        toast.type === "error" ? "bg-red-500" : "bg-green-500"
                        }`}
                    >
                        {toast.message}
                    </div>
                )}
                <br />
                {result && (
                    <div className="mt-6 p-4 rounded-lg bg-white/20 border border-yellow-300">
                        {result.error ? (
                            <p className="text-red-400">{result.error}</p>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-cyan-200 mb-2">Your Business Numerology Report</h2>
                                <p className="text-md text-gray-100">
                                    <strong>Name : </strong> {cuname}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Cleaned Name : </strong> {result.cleaned_name}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Name Number : </strong> {result.name_number}
                                </p>
                                 <p className="text-md text-gray-100">
                                    <strong>Master number : </strong> {result.master_sum}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Vowels Sum : </strong> {result.vowels_sum}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>connector number : </strong> {result.connector_number}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Consonants number : </strong> {result.consonants_sum}
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessNumerology;
