import React, { useState, useRef } from 'react';

const VastuReport = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedFileType, setUploadedFileType] = useState(null);
    const [analysisImage, setAnalysisImage] = useState(null);
    const formRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedImage(URL.createObjectURL(file));
            setUploadedFileType(file.type);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const formData = new FormData(formRef.current);
        const apiUrl = import.meta.env.VITE_VASTU_API_URL ;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok && response.headers.get("Content-Type") === "application/pdf") {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                setAnalysisImage(url);
                setMessage({ text: 'Success! Your analysis is ready.', type: 'success' });
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'An unknown error occurred.';
                console.error('API Error:', errorMessage);
                setMessage({ text: `Error: ${errorMessage}`, type: 'danger' });
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            setMessage({ text: 'Failed to connect to the API. Please ensure the server is running.', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container mx-auto p-6 color-text-primary">
                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold">Vastu Analysis Portal</h1>
                        <p className="text-lg mt-2">Upload your blueprint to generate a Vastu analysis report.</p>
                    </div>
                    <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: File Upload */}
                            <div className="bg-white/10 p-6 rounded-xl">
                                <h2 className="text-2xl font-semibold mb-4">1. Upload Blueprint</h2>
                                <label htmlFor="blueprint-file" className="block text-lg mb-2">Blueprint (PDF, PNG, JPG)</label>
                                <input 
                                    type="file" 
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-transparent focus:border-cyan-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                                    id="blueprint-file" 
                                    name="blueprint" 
                                    accept=".pdf,.png,.jpg,.jpeg" 
                                    required 
                                    onChange={handleFileChange} 
                                />
                                {uploadedImage && (
                                    <div className="mt-4">
                                        <h3 className="text-xl font-semibold mb-2">Blueprint Preview</h3>
                                        {uploadedFileType === 'application/pdf' ? (
                                            <iframe src={uploadedImage} className="w-full h-96 rounded-lg shadow-md" />
                                        ) : (
                                            <img src={uploadedImage} alt="Blueprint Preview" className="w-full rounded-lg shadow-md" />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Coordinates */}
                            <div className="space-y-6 bg-white/10 p-6 rounded-xl">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">2. Geographic Coordinates</h2>
                                    <p className="text-sm mb-4">Enter the coordinates for the analysis location.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="point_lat" className="block text-lg mb-2">Main Latitude</label>
                                            <input 
                                                type="number" 
                                                step="any" 
                                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-transparent focus:border-cyan-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                                                id="point_lat" 
                                                name="point_lat" 
                                                placeholder="e.g., 19.027050" 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="point_lon" className="block text-lg mb-2">Main Longitude</label>
                                            <input 
                                                type="number" 
                                                step="any" 
                                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-transparent focus:border-cyan-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                                                id="point_lon" 
                                                name="point_lon" 
                                                placeholder="e.g., 72.851651" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">3. Landmark Coordinates</h2>
                                    <p className="text-sm mb-4">Enter the coordinates of a nearby landmark to the south.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="center_lat" className="block text-lg mb-2">Landmark Latitude</label>
                                            <input 
                                                type="number" 
                                                step="any" 
                                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-transparent focus:border-cyan-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                                                id="center_lat" 
                                                name="center_lat" 
                                                placeholder="e.g., 19.026167" 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="center_lon" className="block text-lg mb-2">Landmark Longitude</label>
                                            <input 
                                                type="number" 
                                                step="any" 
                                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-transparent focus:border-cyan-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                                                id="center_lon" 
                                                name="center_lon" 
                                                placeholder="e.g., 72.851914" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center mt-8">
                            <button 
                                type="submit" 
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </div>
                                ) : 'Generate Analysis PDF'}
                            </button>
                        </div>
                    </form>
                    {message.text && (
                        <div 
                            id="message-box" 
                            className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                                message.type === 'success' ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'
                            }`}
                        >
                            {message.text}
                        </div>
                    )}
                    {analysisImage && (
                        <div className="mt-8 text-center">
                            <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
                            <iframe src={analysisImage} className="w-full h-screen rounded-lg shadow-md" />
                            <a 
                                href={analysisImage} 
                                download="vastu_analysis_output.pdf" 
                                className="mt-4 inline-block bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                            >
                                Download Analysis
                            </a>
                        </div>
                    )}
                </div>
            </div>
            
        </>
    );
};

export default VastuReport;