import React, { useState } from "react";

const NameNumerology = () => {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [cgender, setCgender] = useState("");
    const [cuname, setCuname] = useState("");
    const [cudob, setCudob] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000); // hide after 3 sec
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
        if (!name || !dob) {
            console.log("Missing values")
        };

        setCuname(name);
        setCudob(dob);
        setCgender(gender);

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_NAME_NUMCALCU_API_KEY}?fname=${name}&dob=${dob}&gen=${gender}`,
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
                <h1 className="text-3xl font-bold text-center text-cyan-300 mb-6">Name Numerology</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Pratap Sharma"
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Date of Birth</label>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            placeholder="DD-MM-YYYY"
                            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>
                    <div>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full appearance-none cursor-pointer bg-white/20 text-white py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ease-in-out duration-150 backdrop-blur-md"
                        >
                            <option value="Gender" className="bg-slate-900 text-white">Gender</option>
                            <option value="Male" className="bg-slate-900 text-white">Male</option>
                            <option value="Female" className="bg-slate-900 text-white">Female</option>
                        </select>
                    </div>

                    <div className="relative z-10">
                        <button
                        type="submit"
                        className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-2 rounded-lg transition relative z-10">
                            {loading ? "Calculating..." : "Get Numerology Report"}
                        </button>
                    </div>

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
                                <h2 className="text-2xl font-bold text-cyan-200 mb-2">Your Numerology Report</h2>
                                <p className="text-md text-gray-100">
                                    <strong>Name : </strong> {cuname}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Gender : </strong> {cgender}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Name Number : </strong> {result.name_number}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>DOB : </strong> {cudob}
                                </p>
                                 <p className="text-md text-gray-100">
                                    <strong>Life Path / destiny number : </strong> {result.master_sum}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Soul number : </strong> {result.vowels_sum}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Driver number : </strong> {result.driver_number}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>connector number : </strong> {result.connector_number}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Kua number : </strong> {result.kua_number}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Personality : </strong> {result.personality_traits?.traits.join(", ")}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Best Career : </strong> {result.life_path_number?.career}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Your desired Career : </strong> {result.soul_urge_number?.career.join(", ")}
                                </p>
                                <p className="text-md text-gray-100">
                                    <strong>Lucky list : </strong> {result.dob}
                                    <ul>
                                        <li><><strong>Day : </strong>{result.lucky_list?.day}</></li>
                                        <li><><strong>Planet : </strong>{result.lucky_list?.planet}</></li>
                                        <li><><strong>Color : </strong>{result.lucky_list?.lucky_colors}</></li>
                                        <li><><strong>Stone : </strong>{result.lucky_list?.lucky_stones}</></li>
                                    </ul>
                                </p>
                                
                                <p className="text-md mt-2 text-white whitespace-pre-wrap">
                                    {/* <strong className="text-xl font-bold text-cyan-200 mb-2" >Report</strong> */}
                                    <p><strong>Personality type : </strong>{result.personality_traits.nickname}</p>
                                    {result.personality_traits?.vibe}{result.personality_traits?.how_people_see_you}{result.life_path_number?.strengths}{result.life_path_number?.challenges}{result.life_path_number?.life_purpose}{result.soul_urge_number?.description}
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NameNumerology;
