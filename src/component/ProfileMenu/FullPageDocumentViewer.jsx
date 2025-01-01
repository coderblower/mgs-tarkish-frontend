import React from "react";
import ReactImageMagnify from "react-image-magnify"; // Install with npm install react-image-magnify
import { Document, Page } from "react-pdf"; // Install with npm install @react-pdf-viewer/core
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
          <div className="w-full h-full flex justify-center items-center">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Document Viewer",
                  isFluidWidth: true,
                  src: fullUrl,
                },
                largeImage: {
                  src: fullUrl,
                  width: 1200,
                  height: 1200,
                },
                enlargedImageContainerDimensions: {
                  width: "200%",
                  height: "200%",
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
