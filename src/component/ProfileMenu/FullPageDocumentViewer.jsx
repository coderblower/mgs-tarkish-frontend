import React from "react";
import ReactImageMagnify from "react-image-magnify"; // Install with npm install react-image-magnify
import { Document, Page } from '@react-pdf/renderer';
 // Install with npm install @react-pdf-viewer/core
import "@react-pdf-viewer/core/lib/styles/index.css";

const API_URL = import.meta.env.VITE_BASE_URL;

const FullPageDocumentViewer = ({ file, onClose }) => {
  const fullUrl = `${API_URL}/${file?.url}`;
  const isPDF = file?.url?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(file?.url);

  const [pageNumber, setPageNumber] = React.useState(1);
  const [zoom, setZoom] = React.useState(1.0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative w-full h-full lg:w-[80%] lg:h-[90%] bg-white overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
        {isPDF ? (
          <div className="w-full h-full flex flex-col items-center">
            <div className="flex justify-between w-full px-4 py-2">
              <button
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Prev Page
              </button>
              <button
                onClick={() => setPageNumber((prev) => prev + 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next Page
              </button>
              <button
                onClick={() => setZoom((prev) => prev + 0.1)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Zoom In
              </button>
              <button
                onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Zoom Out
              </button>
            </div>
            <Document file={fullUrl} className="overflow-auto">
              <Page
                pageNumber={pageNumber}
                scale={zoom}
                className="shadow-lg"
              />
            </Document>
          </div>
        ) : isImage ? (
            <div className="w-[400px] h-[400px] flex justify-center items-center">
  <ReactImageMagnify
   {...{
    smallImage: {
      alt: "Document Viewer",
      isFluidWidth: true, // Ensures responsiveness
      src: fullUrl,
      style: {
        maxWidth: "100px", // Set the initial small image size (you can adjust this value)
        maxHeight: "100px", // Optional, maintain aspect ratio
      },
    },
    largeImage: {
      src: fullUrl,
      width: 6000, // Set this large enough to allow proper zoom
      height: 8000, // Set this large enough to allow proper zoom
    },
    enlargedImageContainerStyle: {
      background: "#fff", // Optional background for zoomed area
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Optional shadow effect
      position: "absolute", // Position the zoomed image correctly
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    enlargedImageContainerDimensions: {
      width: "100%", // Ensure it fills the full container width
      height: "100%", // Ensure it fills the full container height
    },
    lensStyle: {
      background: "rgba(0,0,0,0.2)", // Optional lens styling
    },
  }}
  />
</div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
            <p>Unsupported file format</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullPageDocumentViewer;
