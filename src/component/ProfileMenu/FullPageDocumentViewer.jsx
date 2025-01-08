import React from "react";
import {post} from "../../api/axios";
import ReactImageMagnify from "react-image-magnify"; // Install with npm install react-image-magnify
import { Viewer, Worker  } from '@react-pdf-viewer/core';
import { useState, useEffect } from "react";
 // Install with npm install @react-pdf-viewer/core
 import '@react-pdf-viewer/core/lib/styles/index.css';


 
const API_URL = import.meta.env.VITE_BASE_URL;

const FullPageDocumentViewer = ({ file, onClose }) => {
  const fullUrl = `${API_URL}/${file?.url}`;
  const [fileData, setFileData] = useState(null);
  const isPDF = file?.url?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(file?.url);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pageNumber, setPageNumber] = React.useState(1);
  const [zoom, setZoom] = React.useState(1.0);


  console.log('file: url >>>>', fullUrl)



  useEffect(() => {
    // Prevent multiple fetches for the same file
    if (!file?.url || loading) return; // If no URL or still loading, do nothing
  
    const fetchFile = async () => {
      try {
        setLoading(true);
        const response = await post(`/api/country/get_file`, { file: file?.url }, {
          responseType: "blob", // Fetch as Blob
        });
        console.log("Response Blob:", response);
        setFileData(response.data); // Assuming the response has the `data` field for Blob
      } catch (err) {
        console.error("Error fetching file:", err);
        setError("Failed to load the file.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchFile();
  }, [file?.url, loading]); // Add loading to prevent multiple fetches while in progress
  






  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative w-full h-full lg:w-[80%] lg:h-[90%] bg-white overflow-auto">
      <a
        href={fullUrl}
        download={file?.url?.split("/").pop()} // Use the file name for download
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-10"
      >
        Download
      </a>

      
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
        {isPDF ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
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
              {/* Conditional rendering of the PDF Viewer */}
              {fileData && (
                <Viewer
                  fileUrl={URL.createObjectURL(fileData)} // Create URL from Blob
                />
              )}
            </div>
          </Worker>
        ) : isImage ? (
            <div className="w-[400px] h-[400px] flex mt-[100px] ml-[200px] justify-center items-center">
  <ReactImageMagnify
    {...{
      smallImage: {
        alt: "Document Viewer",
        isFluidWidth: true, // Ensures responsiveness
        src: fullUrl,
        style: {
          maxWidth: "100px", // Set the initial small image size
          maxHeight: "100px", // Optional, maintain aspect ratio
        },
      },
      largeImage: {
        src: fullUrl,
        width: 800, // Larger image dimensions for zoom
        height: 800,
      },
      enlargedImageContainerStyle: {
        background: "#fff", // Optional background for zoomed area
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Optional shadow effect
      },
      enlargedImageContainerDimensions: {
        width: "160%", // Adjust zoomed width (relative to the small image)
        height: "80%", // Adjust zoomed height
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
