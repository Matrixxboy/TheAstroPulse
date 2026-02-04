import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import CircularSlider from "./CircularSlider"
import { motion, AnimatePresence } from "framer-motion"
import {
  Compass,
  Upload,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Download,
  AlertCircle,
  RotateCw,
} from "lucide-react"

const VastuCompass = () => {
  const [file, setFile] = useState(null)
  const [angle, setAngle] = useState(0)
  const [autoAngle, setAutoAngle] = useState(null)
  const [originalImage, setOriginalImage] = useState(null)
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [compassBox, setCompassBox] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const imageCanvasRef = useRef(null)
  const drawingCanvasRef = useRef(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const lastPanPoint = useRef({ x: 0, y: 0 })

  const drawImage = () => {
    const canvas = imageCanvasRef.current
    if (!canvas || !originalImage) return
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.src = `data:image/png;base64,${originalImage}`
    img.onload = () => {
      canvas.width = imageDimensions.width
      canvas.height = imageDimensions.height
      ctx.save()
      ctx.translate(panOffset.x, panOffset.y)
      ctx.scale(zoomLevel, zoomLevel)
      ctx.drawImage(img, 0, 0)
      ctx.restore()
    }
  }

  const drawCompass = () => {
    const canvas = drawingCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    canvas.width = imageDimensions.width
    canvas.height = imageDimensions.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const wheelSize = 300
    const wheelCanvas = document.createElement("canvas")
    wheelCanvas.width = wheelSize
    wheelCanvas.height = wheelSize
    const wheelCtx = wheelCanvas.getContext("2d")
    drawWheelArrow(wheelCtx, wheelSize, angle)

    if (compassBox) {
      const [x1, y1, x2, y2] = compassBox
      const w = x2 - x1
      const h = y2 - y1
      ctx.drawImage(wheelCanvas, x1, y1, w, h)
    } else {
      ctx.drawImage(wheelCanvas, 20, 20, 150, 150)
    }

    ctx.font = "bold 40px Arial"
    ctx.fillStyle = "#FFD700" // Gold color
    ctx.shadowColor = "rgba(0,0,0,0.5)"
    ctx.shadowBlur = 4
    ctx.fillText(`${Math.round(angle)}°`, 20, 50)
  }

  const drawWheelArrow = (ctx, size, angleValue) => {
    const cx = size / 2
    const cy = size / 2
    const radius = size / 2 - 10

    // Outer glow
    ctx.shadowColor = "#FFD700"
    ctx.shadowBlur = 10

    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "rgba(255, 215, 0, 0.8)" // Gold
    ctx.lineWidth = 8
    ctx.stroke()

    ctx.shadowBlur = 0 // Reset shadow

    const theta = (angleValue - 90) * (Math.PI / 180)
    const arrowLen = radius - 40
    const endX = cx + arrowLen * Math.cos(theta)
    const endY = cy + arrowLen * Math.sin(theta)

    // Draw North Pointer
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = "rgba(255, 69, 0, 0.9)" // Red-Orange (Saffron-ish)
    ctx.lineWidth = 12
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw Center Dot
    ctx.beginPath()
    ctx.arc(cx, cy, 8, 0, 2 * Math.PI)
    ctx.fillStyle = "#FFF"
    ctx.fill()
  }

  useEffect(() => {
    drawImage()
  }, [originalImage, imageDimensions, zoomLevel, panOffset])

  useEffect(() => {
    drawCompass()
  }, [angle, imageDimensions, compassBox])

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setAutoAngle(null)
      setError(null)
      setOriginalImage(null)
      setZoomLevel(1)
      setPanOffset({ x: 0, y: 0 })
      const formData = new FormData()
      formData.append("image", selectedFile)
      setIsLoading(true)
      try {
        const response = await axios.post(
          "http://localhost:5000/vastu/compass",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        )
        const { image, width, height, auto_angle, compass_box } = response.data
        setOriginalImage(image)
        setImageDimensions({ width, height })
        if (auto_angle) {
          const detectedAngle = Math.round(auto_angle)
          setAutoAngle(detectedAngle)
          setAngle(detectedAngle)
        }
        setCompassBox(compass_box)
      } catch (err) {
        setError("An error occurred while processing the image.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDownload = () => {
    const imageCanvas = imageCanvasRef.current
    const drawingCanvas = drawingCanvasRef.current
    if (imageCanvas && drawingCanvas) {
      const mergedCanvas = document.createElement("canvas")
      mergedCanvas.width = imageCanvas.width
      mergedCanvas.height = imageCanvas.height
      const mergedCtx = mergedCanvas.getContext("2d")
      mergedCtx.drawImage(imageCanvas, 0, 0)
      mergedCtx.drawImage(drawingCanvas, 0, 0)
      const link = document.createElement("a")
      link.download = "compass_result.png"
      link.href = mergedCanvas.toDataURL("image/png")
      link.click()
    }
  }

  const handleMouseDown = (e) => {
    setIsPanning(true)
    lastPanPoint.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - lastPanPoint.current.x
      const dy = e.clientY - lastPanPoint.current.y
      setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy })
      lastPanPoint.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  return (
    <div className="relative z-10 min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-gradient-gold mb-3 flex items-center justify-center gap-3">
            <Compass className="w-10 h-10 text-saffron" /> Vastu Compass
          </h1>
          <p className="text-smoke text-lg max-w-2xl mx-auto">
            Interact with your floor plan and detect optimal orientations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Controls */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-xl font-bold text-gold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" /> Upload Plan
              </h2>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, application/pdf"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-cosmic-dark hover:file:bg-saffron transition-all cursor-pointer bg-white/5 rounded-xl border border-white/10"
              />

              {/* Circular Slider */}
              <div className="my-8 flex justify-center py-4 bg-black/20 rounded-xl border border-white/5">
                <CircularSlider
                  size={220}
                  min={0}
                  max={359}
                  value={angle}
                  onChange={setAngle}
                />
              </div>

              <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-sm text-smoke uppercase font-bold tracking-wider">
                  Current Angle
                </span>
                <span className="text-3xl font-bold text-white flex items-center gap-2">
                  {Math.round(angle)}°{" "}
                  <RotateCw className="w-5 h-5 text-gold animate-pulse-slow" />
                </span>
              </div>

              <AnimatePresence>
                {autoAngle !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5 text-green-400" />
                    <p className="text-green-200">
                      AI Detected: <strong>{autoAngle}°</strong>
                    </p>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-200">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Image Display */}
          <div className="w-full lg:w-2/3 glass p-2 rounded-2xl border border-white/10 min-h-[500px] flex items-center justify-center relative bg-black/40 overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-gold font-bold">Processing Blueprint...</p>
              </div>
            ) : originalImage ? (
              <div className="w-full h-full flex flex-col items-center">
                <div
                  className="relative w-full overflow-hidden rounded-xl border border-white/10 shadow-inner bg-black/60 cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <canvas ref={imageCanvasRef} className="mx-auto" />
                  <canvas
                    ref={drawingCanvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  />

                  {/* Controls Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    <button
                      onClick={() =>
                        setZoomLevel((prev) => Math.min(prev * 1.2, 5))
                      }
                      className="bg-black/50 hover:bg-gold text-white hover:text-black p-2 rounded-lg backdrop-blur-sm border border-white/20 transition-all"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setZoomLevel((prev) => Math.max(prev / 1.2, 0.5))
                      }
                      className="bg-black/50 hover:bg-gold text-white hover:text-black p-2 rounded-lg backdrop-blur-sm border border-white/20 transition-all"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setZoomLevel(1)
                        setPanOffset({ x: 0, y: 0 })
                      }}
                      className="bg-black/50 hover:bg-gold text-white hover:text-black p-2 rounded-lg backdrop-blur-sm border border-white/20 transition-all"
                      title="Reset View"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="mt-6 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="w-5 h-5" /> Download Result
                </button>
              </div>
            ) : (
              <div className="text-white/40 flex flex-col items-center gap-4">
                <ImageIcon className="w-16 h-16 opacity-50" />
                <p className="text-lg">
                  Upload a blueprint to verify compass direction.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VastuCompass
