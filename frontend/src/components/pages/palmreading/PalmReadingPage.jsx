import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Camera, Upload, Sparkles, Loader2, RefreshCw } from "lucide-react"

const PalmReadingPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // File upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setPreviewURL(URL.createObjectURL(file))
      setResultImage(null)
    }
  }

  // Start camera
  const startCamera = async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Camera error:", err)
      alert("Unable to access camera.")
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

    const formData = new FormData()
    formData.append("image", selectedImage)

    try {
      const res = await fetch("http://127.0.0.1:5000/process-image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Image processing failed")

      const blob = await res.blob()
      const imageUrl = URL.createObjectURL(blob)

      setResultImage(imageUrl)
    } catch (err) {
      console.error("Error:", err)
      alert("Upload failed. Check server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12 flex flex-col items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold mb-3">
            AI Palmistry Scan
          </h1>
          <p className="text-smoke text-sm md:text-base font-body">
            Capture your palm to reveal the cosmic map written on your hands.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Input Area */}
            <div className="space-y-6">
              {/* Camera & Upload Buttons */}
              {!showCamera ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl group-hover:border-gold/50 transition-colors bg-white/5">
                      <Upload className="w-8 h-8 text-gold mb-2" />
                      <p className="text-sm text-smoke">Upload Palm Image</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-cosmic-dark px-2 text-smoke">Or</span>
                    </div>
                  </div>

                  <button
                    onClick={startCamera}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white flex items-center justify-center gap-2 transition-all font-semibold"
                  >
                    <Camera className="w-5 h-5" /> Open Camera
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-gold/50 shadow-lg">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-gradient-to-r from-saffron to-maroon text-white font-bold py-2 rounded-xl shadow-lg hover:brightness-110 transition-all"
                    >
                      Capture
                    </button>
                    <button
                      onClick={() => setShowCamera(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Area */}
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              {previewURL ? (
                <div className="relative w-full aspect-square md:aspect-auto md:h-64 rounded-xl overflow-hidden border-2 border-gold/30 shadow-lg group">
                  <img
                    src={previewURL}
                    alt="Palm Preview"
                    className="w-full h-full object-cover"
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                      <Loader2 className="w-10 h-10 text-gold animate-spin mb-2" />
                      <p className="text-gold font-bold animate-pulse">
                        Analyzing Lines...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-white/30 space-y-2">
                  <div className="w-32 h-32 border-2 border-dashed border-white/10 rounded-full mx-auto flex items-center justify-center">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <p className="text-sm">Image Preview will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleUpload}
              disabled={!selectedImage || loading}
              className="w-full bg-gradient-to-r from-gold to-yellow-600 text-black font-bold py-4 rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/40 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />{" "}
              {loading ? "Communicating with AI..." : "Analyze Palm"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {resultImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-heading font-bold text-center text-white mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-gold" /> Analysis Result
            </h2>
            <div className="p-1 bg-gradient-to-br from-gold via-saffron to-maroon rounded-2xl shadow-2xl">
              <div className="bg-cosmic-dark rounded-xl overflow-hidden relative">
                <img
                  src={resultImage}
                  alt="Detected Palm"
                  className="w-full rounded-xl"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
                  <p className="text-white font-body text-sm">
                    AI has mapped the major lifelines. Consult our Vedic AI Chat
                    for a detailed interpretation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default PalmReadingPage
