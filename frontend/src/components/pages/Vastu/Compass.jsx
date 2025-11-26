
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CircularSlider from './CircularSlider';

const Compass = () => {
    const [file, setFile] = useState(null);
    const [angle, setAngle] = useState(0);
    const [autoAngle, setAutoAngle] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [compassBox, setCompassBox] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const imageCanvasRef = useRef(null);
    const drawingCanvasRef = useRef(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const lastPanPoint = useRef({ x: 0, y: 0 });

    const drawImage = () => {
        const canvas = imageCanvasRef.current;
        if (!canvas || !originalImage) return;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = `data:image/png;base64,${originalImage}`;
        img.onload = () => {
            canvas.width = imageDimensions.width;
            canvas.height = imageDimensions.height;
            ctx.save();
            ctx.translate(panOffset.x, panOffset.y);
            ctx.scale(zoomLevel, zoomLevel);
            ctx.drawImage(img, 0, 0);
            ctx.restore();
        };
    };

    const drawCompass = () => {
        const canvas = drawingCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = imageDimensions.width;
        canvas.height = imageDimensions.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const wheelSize = 300;
        const wheelCanvas = document.createElement('canvas');
        wheelCanvas.width = wheelSize;
        wheelCanvas.height = wheelSize;
        const wheelCtx = wheelCanvas.getContext('2d');
        drawWheelArrow(wheelCtx, wheelSize, angle);

        if (compassBox) {
            const [x1, y1, x2, y2] = compassBox;
            const w = x2 - x1;
            const h = y2 - y1;
            ctx.drawImage(wheelCanvas, x1, y1, w, h);
        } else {
            ctx.drawImage(wheelCanvas, 20, 20, 150, 150);
        }
        
        ctx.font = '40px Arial';
        ctx.fillStyle = 'green';
        ctx.fillText(`${angle}°`, 20, 50);
    };

    const drawWheelArrow = (ctx, size, angleValue) => {
        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2 - 10;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(0, 255, 0, 1)';
        ctx.lineWidth = 10;
        ctx.stroke();
        const theta = (angleValue - 90) * (Math.PI / 180);
        const arrowLen = radius - 40;
        const endX = cx + arrowLen * Math.cos(theta);
        const endY = cy + arrowLen * Math.sin(theta);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
        ctx.lineWidth = 15;
        ctx.stroke();
    };

    useEffect(() => {
        drawImage();
    }, [originalImage, imageDimensions, zoomLevel, panOffset]);

    useEffect(() => {
        drawCompass();
    }, [angle, imageDimensions, compassBox]);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setAutoAngle(null);
            setError(null);
            setOriginalImage(null);
            setZoomLevel(1);
            setPanOffset({ x: 0, y: 0 });
            const formData = new FormData();
            formData.append('image', selectedFile);
            setIsLoading(true);
            try {
                const response = await axios.post('http://localhost:5000/vastu/compass', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const { image, width, height, auto_angle, compass_box } = response.data;
                setOriginalImage(image);
                setImageDimensions({ width, height });
                if (auto_angle) {
                    const detectedAngle = Math.round(auto_angle);
                    setAutoAngle(detectedAngle);
                    setAngle(detectedAngle);
                }
                setCompassBox(compass_box);
            } catch (err) {
                setError('An error occurred while processing the image.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    const handleDownload = () => {
        const imageCanvas = imageCanvasRef.current;
        const drawingCanvas = drawingCanvasRef.current;
        if (imageCanvas && drawingCanvas) {
            const mergedCanvas = document.createElement('canvas');
            mergedCanvas.width = imageCanvas.width;
            mergedCanvas.height = imageCanvas.height;
            const mergedCtx = mergedCanvas.getContext('2d');
            mergedCtx.drawImage(imageCanvas, 0, 0);
            mergedCtx.drawImage(drawingCanvas, 0, 0);
            const link = document.createElement('a');
            link.download = 'compass_result.png';
            link.href = mergedCanvas.toDataURL('image/png');
            link.click();
        }
    };

    const handleMouseDown = (e) => {
        setIsPanning(true);
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            const dx = e.clientX - lastPanPoint.current.x;
            const dy = e.clientY - lastPanPoint.current.y;
            setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });
            lastPanPoint.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    return (
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md animate-fade-in-down">
                    Vastu Compass
                </h1>
                <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto animate-fade-in delay-200">
                    Upload a blueprint to detect the compass direction.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left Column: Controls */}
                <div className="w-full md:w-1/3 flex flex-col items-center gap-6 p-6 bg-gray-800 bg-opacity-50 rounded-lg">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-indigo-900 hover:file:bg-yellow-500 transition-colors duration-300"
                    />
                    
                    <div className="my-4">
                        <CircularSlider
                            size={250}
                            min={0}
                            max={359}
                            value={angle}
                            onChange={setAngle}
                        />
                    </div>

                    {autoAngle !== null && (
                        <p className="text-green-400 text-lg">
                            AI Detected Angle: <strong>{autoAngle}°</strong>
                        </p>
                    )}

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                {/* Right Column: Image Display */}
                <div className="w-full md:w-2/3 flex flex-col items-center justify-center p-6 bg-gray-800 bg-opacity-50 rounded-lg min-h-[400px]">
                    {isLoading ? (
                        <div className="text-white">Processing...</div>
                    ) : originalImage ? (
                        <div className="text-center">
                             <h2 className="text-2xl font-bold text-white mb-4">Result</h2>
                             <div className="relative">
                                <canvas 
                                    ref={imageCanvasRef} 
                                    className="max-w-full max-h-[500px] mx-auto rounded-lg shadow-lg"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                />
                                <canvas 
                                    ref={drawingCanvasRef} 
                                    className="absolute top-0 left-0 max-w-full max-h-[500px] mx-auto rounded-lg shadow-lg pointer-events-none"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={() => setZoomLevel(zoomLevel * 1.2)} className="bg-gray-700 text-white p-2 rounded-full">+</button>
                                    <button onClick={() => setZoomLevel(zoomLevel / 1.2)} className="bg-gray-700 text-white p-2 rounded-full">-</button>
                                    <button onClick={() => {setZoomLevel(1); setPanOffset({ x: 0, y: 0 });}} className="bg-gray-700 text-white p-2 rounded-full">Reset</button>
                                </div>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                                Download Image
                            </button>
                        </div>
                    ) : (
                        <div className="text-gray-400">
                            <p>Upload an image to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Compass;
