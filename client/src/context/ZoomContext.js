import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

const ZoomContext = createContext();

export const useZoom = () => {
  return useContext(ZoomContext);
};

export const ZoomProvider = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomChange = useCallback(
    (newZoomLevel) => {
      const limitedZoom = Math.min(Math.max(newZoomLevel, 0.5), 1.5);

      if (newZoomLevel > 1.5) {
        let warningEl = document.getElementById("zoom-limit-warning");
        if (!warningEl) {
          warningEl = document.createElement("div");
          warningEl.id = "zoom-limit-warning";
          warningEl.style.position = "fixed";
          warningEl.style.bottom = "80px";
          warningEl.style.right = "20px";
          warningEl.style.backgroundColor = "rgba(30, 41, 59, 0.9)";
          warningEl.style.color = "white";
          warningEl.style.padding = "10px 15px";
          warningEl.style.borderRadius = "8px";
          warningEl.style.zIndex = "9999";
          warningEl.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          warningEl.style.fontSize = "14px";
          warningEl.style.transition = "opacity 0.3s ease";
          document.body.appendChild(warningEl);
        }

        warningEl.textContent =
          "Zoom limitat la 150% pentru a păstra aspectul formularului";
        warningEl.style.opacity = "1";

        setTimeout(() => {
          if (warningEl) {
            warningEl.style.opacity = "0";
            setTimeout(() => {
              if (warningEl && warningEl.parentNode) {
                warningEl.parentNode.removeChild(warningEl);
              }
            }, 300);
          }
        }, 3000);
      }

      if (limitedZoom !== zoomLevel) {
        console.log(`Setting zoom level to: ${limitedZoom * 100}%`);
        setZoomLevel(limitedZoom);
      }
    },
    [zoomLevel]
  );

  const zoomIn = useCallback(() => {
    handleZoomChange(zoomLevel + 0.1);
  }, [handleZoomChange, zoomLevel]);

  const zoomOut = useCallback(() => {
    handleZoomChange(zoomLevel - 0.1);
  }, [handleZoomChange, zoomLevel]);

  const resetZoom = useCallback(() => {
    handleZoomChange(1);
  }, [handleZoomChange]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "=" || e.keyCode === 187) {
          e.preventDefault();
          handleZoomChange(zoomLevel + 0.1);
        } else if (e.key === "-" || e.keyCode === 189) {
          e.preventDefault();
          handleZoomChange(zoomLevel - 0.1);
        } else if (e.key === "0" || e.keyCode === 48) {
          e.preventDefault();
          handleZoomChange(1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomLevel, handleZoomChange]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY || e.detail || e.wheelDelta;

        const zoomDelta = 0.1;
        const newZoom =
          delta > 0
            ? Math.max(0.5, zoomLevel - zoomDelta)
            : Math.min(1.5, zoomLevel + zoomDelta);

        handleZoomChange(newZoom);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    document.addEventListener("DOMMouseScroll", handleWheel, {
      passive: false,
    });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("DOMMouseScroll", handleWheel);
    };
  }, [zoomLevel, handleZoomChange]);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const ratio = currentWidth / lastWidth;

      if (Math.abs(1 - ratio) > 0.05) {
        const estimatedZoom = zoomLevel * ratio;
        handleZoomChange(estimatedZoom);
        lastWidth = currentWidth;
      }
    };

    let lastWidth = window.innerWidth;
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [zoomLevel, handleZoomChange]);

  const value = {
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
  };

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
};
