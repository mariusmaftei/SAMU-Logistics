"use client"

import { createContext, useState, useContext, useEffect } from "react"

const ZoomContext = createContext()

export const useZoom = () => {
  return useContext(ZoomContext)
}

export const ZoomProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(1)

  // Update the handleZoomChange function to be more robust
  const handleZoomChange = (newZoomLevel) => {
    // Limit zoom to between 50% and 150%
    const limitedZoom = Math.min(Math.max(newZoomLevel, 0.5), 1.5)

    // If the user tries to zoom beyond 150%, show a message
    if (newZoomLevel > 1.5) {
      // Create or update the warning message
      let warningEl = document.getElementById("zoom-limit-warning")
      if (!warningEl) {
        warningEl = document.createElement("div")
        warningEl.id = "zoom-limit-warning"
        warningEl.style.position = "fixed"
        warningEl.style.bottom = "80px"
        warningEl.style.right = "20px"
        warningEl.style.backgroundColor = "rgba(30, 41, 59, 0.9)"
        warningEl.style.color = "white"
        warningEl.style.padding = "10px 15px"
        warningEl.style.borderRadius = "8px"
        warningEl.style.zIndex = "9999"
        warningEl.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
        warningEl.style.fontSize = "14px"
        warningEl.style.transition = "opacity 0.3s ease"
        document.body.appendChild(warningEl)
      }

      // Update the message
      warningEl.textContent = "Zoom limitat la 150% pentru a păstra aspectul formularului"
      warningEl.style.opacity = "1"

      // Hide the message after 3 seconds
      setTimeout(() => {
        if (warningEl) {
          warningEl.style.opacity = "0"
          setTimeout(() => {
            if (warningEl && warningEl.parentNode) {
              warningEl.parentNode.removeChild(warningEl)
            }
          }, 300)
        }
      }, 3000)
    }

    // Only update if the zoom level actually changed
    if (limitedZoom !== zoomLevel) {
      console.log(`Setting zoom level to: ${limitedZoom * 100}%`)
      setZoomLevel(limitedZoom)
    }
  }

  const zoomIn = () => {
    handleZoomChange(zoomLevel + 0.1)
  }

  const zoomOut = () => {
    handleZoomChange(zoomLevel - 0.1)
  }

  const resetZoom = () => {
    handleZoomChange(1)
  }

  // Handle keyboard shortcuts for zoom (Ctrl + Plus, Ctrl + Minus, Ctrl + 0)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl key is pressed
      if (e.ctrlKey || e.metaKey) {
        // Plus key (+ or =) for zoom in
        if (e.key === "+" || e.key === "=" || e.keyCode === 187) {
          e.preventDefault() // Prevent default browser zoom
          handleZoomChange(zoomLevel + 0.1)
        }
        // Minus key (-) for zoom out
        else if (e.key === "-" || e.keyCode === 189) {
          e.preventDefault() // Prevent default browser zoom
          handleZoomChange(zoomLevel - 0.1)
        }
        // Zero key (0) for reset zoom
        else if (e.key === "0" || e.keyCode === 48) {
          e.preventDefault() // Prevent default browser zoom
          handleZoomChange(1)
        }
      }
    }

    // Add event listener for keyboard shortcuts
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [zoomLevel])

  // Handle mouse wheel zoom (Ctrl + wheel)
  useEffect(() => {
    const handleWheel = (e) => {
      // Only handle zoom events (Ctrl + wheel)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault() // Prevent default browser zoom
        e.stopPropagation() // Stop event propagation

        // Get the delta from the wheel event
        const delta = e.deltaY || e.detail || e.wheelDelta

        // Determine zoom direction and amount
        const zoomDelta = 0.1
        const newZoom =
          delta > 0
            ? Math.max(0.5, zoomLevel - zoomDelta) // Zoom out (minimum 50%)
            : Math.min(1.5, zoomLevel + zoomDelta) // Zoom in (maximum 150%)

        // Apply the zoom change
        handleZoomChange(newZoom)
      }
    }

    // Add event listeners with the correct options
    // Use { passive: false } to allow preventDefault()
    document.addEventListener("wheel", handleWheel, { passive: false })

    // Add support for Firefox's DOMMouseScroll event
    document.addEventListener("DOMMouseScroll", handleWheel, { passive: false })

    return () => {
      document.removeEventListener("wheel", handleWheel)
      document.removeEventListener("DOMMouseScroll", handleWheel)
    }
  }, [zoomLevel])

  // Handle browser window resize events
  useEffect(() => {
    const handleResize = () => {
      // If width changed significantly, it might be a zoom
      const currentWidth = window.innerWidth
      const ratio = currentWidth / lastWidth

      // Only respond to significant changes that might be zoom
      if (Math.abs(1 - ratio) > 0.05) {
        // Estimate new zoom level based on width change
        const estimatedZoom = zoomLevel * ratio
        handleZoomChange(estimatedZoom)
        lastWidth = currentWidth
      }
    }

    let lastWidth = window.innerWidth
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [zoomLevel])

  const value = {
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
  }

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>
}
