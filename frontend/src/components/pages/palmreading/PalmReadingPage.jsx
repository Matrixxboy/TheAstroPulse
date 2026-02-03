import React, { useState, useRef } from "react"
import SectionWrapper from "../../partials/SectionWrapper"
import {
  FaCamera,
  FaUpload,
  FaMagic,
  FaExclamationTriangle,
} from "react-icons/fa"

const PalmReadingPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [error, setError] = useState(null)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // File upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setPreviewURL(URL.createObjectURL(file))
      setResultImage(null)
      setError(null)
    }
  }

  // Start camera
  const startCamera = async () => {
    setError(null)
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError("Unable to access camera. Please allow permissions.")
      setShowCamera(false)
    }
  }

  // Capture from video stream
  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const context = canvas.getContext("2d")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      const file = new File([blob], "captured_palm.jpg", { type: "image/jpeg" })
      setSelectedImage(file)
      setPreviewURL(URL.createObjectURL(file))
      setShowCamera(false)

      // Stop camera
      const stream = video.srcObject
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }, "image/jpeg")
  }

  // Send image to backend
  const handleUpload = async () => {
    if (!selectedImage) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("image", selectedImage)

    try {
      const apiUrl =
        import.meta.env.VITE_ASTRO_API_URL || "http://localhost:8000"
      const res = await fetch(`${apiUrl}/process-image`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Processing failed. Server might be busy.")

      const blob = await res.blob()
      const imageUrl = URL.createObjectURL(blob)
      setResultImage(imageUrl)
    } catch (err) {
      console.error("Error:", err)
      setError(
        "Analysis failed. Please ensure the image is clear and try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-10 w-full">
      <SectionWrapper>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-400 mb-4">
            AI Palm Scanner
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Upload a clear photo of your palm or use your camera to get an
            instant AI-powered analysis of your major lines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Input Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>

            {!previewURL && !showCamera && (
              <div className="border-2 border-dashed border-white/20 rounded-2xl h-64 flex flex-col items-center justify-center text-gray-400 transition-colors hover:border-pink-500/50 hover:bg-white/5">
                <FaUpload className="text-4xl mb-4" />
                <p className="mb-4">Drag & drop or Click to Upload</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>or</span>
                  <button
                    onClick={startCamera}
                    className="text-pink-400 hover:text-pink-300 font-semibold z-10 relative"
                  >
                    Use Camera
                  </button>
                </div>
              </div>
            )}

            {showCamera && (
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/20">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={capturePhoto}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
                >
                  <FaCamera size={24} />
                </button>
              </div>
            )}

            {previewURL && !showCamera && (
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/20 group-preview">
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => {
                    setPreviewURL(null)
                    setSelectedImage(null)
                    setResultImage(null)
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors text-xs"
                >
                  Change
                </button>
              </div>
            )}

            {/* Action API */}
            <div className="mt-8">
              <button
                onClick={handleUpload}
                disabled={!selectedImage || loading}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2 animate-pulse">
                    <FaMagic /> Analyzing Lines...
                  </span>
                ) : (
                  "Analyze My Palm"
                )}
              </button>
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                  <FaExclamationTriangle /> {error}
                </div>
              )}
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <div
              className={`p-8 rounded-3xl transition-all duration-500 border ${resultImage ? "bg-white/5 border-white/10" : "bg-black/20 border-white/5 border-dashed"} min-h-[400px] flex flex-col items-center justify-center text-center`}
            >
              {resultImage ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Analysis Complete
                  </h3>
                  <img
                    src={resultImage}
                    alt="Analyzed Palm"
                    className="w-full rounded-xl shadow-2xl border border-pink-500/30"
                  />
                  <p className="mt-6 text-gray-300 text-sm">
                    The AI has highlighted major characteristic lines. Consult a
                    professional astrologer for detailed interpretation.
                  </p>
                </>
              ) : (
                <div className="text-gray-500">
                  <FaMagic className="text-5xl mx-auto mb-4 opacity-20" />
                  <p>Analysis results will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </SectionWrapper>
    </div>
  )
}

export default PalmReadingPage
