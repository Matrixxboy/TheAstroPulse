import React, { useState, useRef } from 'react';

const PalmReadingPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // File upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        setPreviewURL(URL.createObjectURL(file));
        setResultImage(null);
    };

    // Start camera
    const startCamera = async () => {
        setShowCamera(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    };

    // Capture from video stream
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], "captured_palm.jpg", { type: 'image/jpeg' });
            setSelectedImage(file);
            setPreviewURL(URL.createObjectURL(file));
            setShowCamera(false);

            // Stop camera
            const stream = video.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }, 'image/jpeg');
    };

    // Send image to backend
    const handleUpload = async () => {
        if (!selectedImage) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const res = await fetch('http://127.0.0.1:5000/process-image', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error("Image processing failed");

            const blob = await res.blob(); // 🔁 Get binary response
            const imageUrl = URL.createObjectURL(blob); // 🔁 Convert to browser-viewable URL

            setResultImage(imageUrl); // 🔁 Set in state to show in <img />
        } catch (err) {
            console.error('Error:', err);
            alert("Upload failed. Check server.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen px-4 py-12 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-6">Palm Reading</h1>

            <div className="bg-white/5 p-6 rounded-xl shadow-lg w-full max-w-md text-center">
                {/* Upload from file */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-4 w-full text-sm text-white file:bg-purple-700 file:text-white file:py-2 file:px-4 file:rounded-full file:border-0 hover:file:bg-purple-600"
                />

                {/* Take from camera */}
                {!showCamera && (
                    <button
                        onClick={startCamera}
                        className="mb-4 w-full bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-full"
                    >
                        📷 Take a Photo
                    </button>
                )}

                {/* Camera stream */}
                {showCamera && (
                    <div className="mb-4">
                        <video ref={videoRef} autoPlay className="w-full rounded-lg mb-2" />
                        <button
                            onClick={capturePhoto}
                            className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold py-2 px-6 rounded-full"
                        >
                            Capture
                        </button>
                    </div>
                )}

                {/* Preview selected/captured image */}
                {previewURL && (
                    <div className="mb-4">
                        <p className="text-sm mb-2 text-gray-300">Preview:</p>
                        <img src={previewURL} alt="Palm Preview" className="w-full rounded-lg border border-purple-600" />
                    </div>
                )}

                {/* Upload to server */}
                <button
                    onClick={handleUpload}
                    disabled={!selectedImage || loading}
                    className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold py-2 px-6 rounded-full disabled:opacity-50"
                >
                    {loading ? "Reading..." : "Send for Analysis"}
                </button>
            </div>

            {/* Result Image */}
            {resultImage && (
                <div className="mt-10 text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-300">Detected Palm Lines:</h2>
                    <img src={resultImage} alt="Detected Palm" className="w-full max-w-md rounded-xl border border-yellow-400 shadow-xl" />
                </div>
            )}

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default PalmReadingPage;