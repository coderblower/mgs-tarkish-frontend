const API_URL = import.meta.env.VITE_BASE_URL;

const FullPageDocumentViewer = ({ file, onClose }) => {

  
    console.log(file, 'ss');
    
    const fullUrl = `${API_URL}/${file.url}`; // Prefix the file URL with API_URL
  
    const isPDF = file?.url?.toLowerCase().endsWith(".pdf");
    const isImage = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(file?.url);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="relative w-full h-full lg:w-[80%] lg:h-[90%] bg-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
          {isPDF ? (
            <iframe
              src={fullUrl}
              title="PDF Viewer"
              className="w-full h-full"
            ></iframe>
          ) : isImage ? (
            <img
              src={fullUrl}
              alt="Document Viewer"
              className="w-full h-full object-contain"
            />
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