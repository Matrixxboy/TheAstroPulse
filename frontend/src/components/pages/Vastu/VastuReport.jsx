import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  MapPin,
  FileCheck,
  AlertCircle,
  Loader2,
  Download,
  FileText,
} from "lucide-react"

const VastuReport = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedFileType, setUploadedFileType] = useState(null)
  const [analysisImage, setAnalysisImage] = useState(null)
  const formRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedImage(URL.createObjectURL(file))
      setUploadedFileType(file.type)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage({ text: "", type: "" })

    const formData = new FormData(formRef.current)
    // Use existing environment variable
    const apiUrl = import.meta.env.VITE_ASTRO_API_URL || "http://localhost:5000"

    try {
      const response = await fetch(`${apiUrl}/vastu`, {
        method: "POST",
        body: formData,
      })

      if (
        response.ok &&
        response.headers.get("Content-Type") === "application/pdf"
      ) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        setAnalysisImage(url)
        setMessage({
          text: "Success! Your analysis is ready.",
          type: "success",
        })
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || "An unknown error occurred."
        console.error("API Error:", errorMessage)
        setMessage({ text: `Error: ${errorMessage}`, type: "danger" })
      }
    } catch (error) {
      console.error("Fetch Error:", error)
      setMessage({
        text: "Failed to connect to the API. Please ensure the server is running.",
        type: "danger",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 relative z-10 w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold mb-4 flex items-center justify-center gap-3">
            <FileText className="w-10 h-10 text-saffron" /> Vastu Analysis
            Portal
          </h1>
          <p className="text-lg text-smoke font-light max-w-2xl mx-auto">
            Upload your blueprint and provide location details to receive a
            detailed Vastu compliance report.
          </p>
        </motion.div>

        <div className="glass p-8 md:p-10 rounded-3xl border border-gold/20 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-maroon/5 rounded-full blur-3xl -z-10" />

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column: File Upload */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors">
                <h2 className="text-xl font-bold text-gold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" /> 1. Upload Blueprint
                </h2>
                <label
                  htmlFor="blueprint-file"
                  className="block text-sm text-smoke mb-2"
                >
                  Supported formats: PDF, PNG, JPG
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-cosmic-dark hover:file:bg-saffron transition-all cursor-pointer focus:outline-none focus:border-gold/50"
                    id="blueprint-file"
                    name="blueprint"
                    accept=".pdf,.png,.jpg,.jpeg"
                    required
                    onChange={handleFileChange}
                  />
                </div>

                <AnimatePresence>
                  {uploadedImage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6"
                    >
                      <h3 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-green-400" />{" "}
                        Blueprint Preview
                      </h3>
                      <div className="rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black/40">
                        {uploadedFileType === "application/pdf" ? (
                          <iframe
                            src={uploadedImage}
                            className="w-full h-64 md:h-80"
                            title="PDF Preview"
                          />
                        ) : (
                          <img
                            src={uploadedImage}
                            alt="Blueprint Preview"
                            className="w-full h-auto max-h-[350px] object-contain"
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Coordinates */}
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors">
                  <h2 className="text-xl font-bold text-gold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> 2. Site Location
                  </h2>
                  <p className="text-sm text-smoke mb-4">
                    Enter existing coordinates of the property.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="point_lat"
                        className="block text-xs uppercase font-bold text-white/60 mb-1 ml-1"
                      >
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                        id="point_lat"
                        name="point_lat"
                        placeholder="e.g., 19.027050"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="point_lon"
                        className="block text-xs uppercase font-bold text-white/60 mb-1 ml-1"
                      >
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                        id="point_lon"
                        name="point_lon"
                        placeholder="e.g., 72.851651"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-colors">
                  <h2 className="text-xl font-bold text-gold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> 3. South Landmark
                  </h2>
                  <p className="text-sm text-smoke mb-4">
                    Coordinates of a nearby landmark strictly to the South.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="center_lat"
                        className="block text-xs uppercase font-bold text-white/60 mb-1 ml-1"
                      >
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                        id="center_lat"
                        name="center_lat"
                        placeholder="e.g., 19.026167"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="center_lon"
                        className="block text-xs uppercase font-bold text-white/60 mb-1 ml-1"
                      >
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        className="w-full px-4 py-3 rounded-xl bg-cosmic-dark/50 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
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

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={loading}
                className="group relative px-10 py-4 bg-gradient-to-r from-saffron to-maroon rounded-full text-white font-bold shadow-xl shadow-saffron/20 hover:shadow-saffron/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                  {loading
                    ? "Generating Analysis..."
                    : "Generate Analysis Report"}
                </span>
              </button>
            </div>
          </form>

          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-8 p-4 rounded-xl flex items-center justify-center gap-3 backdrop-blur-md border ${
                  message.type === "success"
                    ? "bg-green-500/20 border-green-500/50 text-green-200"
                    : "bg-red-500/20 border-red-500/50 text-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <FileCheck className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-semibold">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {analysisImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 bg-white/5 p-6 rounded-2xl border border-white/10"
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gold flex items-center gap-2">
                  <FileCheck className="w-6 h-6" /> Analysis Result
                </h2>
                <a
                  href={analysisImage}
                  download="vastu_analysis_output.pdf"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-full transition-colors mt-4 md:mt-0"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
              </div>

              <iframe
                src={analysisImage}
                className="w-full h-[80vh] rounded-xl border border-white/20 shadow-inner bg-white"
                title="Vastu Report"
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VastuReport
