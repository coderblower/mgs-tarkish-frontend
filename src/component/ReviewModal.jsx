import React, { useEffect, useRef } from "react";

const ReviewModal = ({ modals, setModals, payload }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handlerClose = (e) => {
      if (!modalRef?.current?.contains(e.target)) {
        setModals(false);
      }
    };
    document.addEventListener("mousedown", handlerClose);
    return () => {
      document.removeEventListener("mousedown", handlerClose);
    };
  }, [setModals]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        modals ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        className="bg-white text-black w-10/12 md:w-1/2 max-w-[1200px] p-6 rounded-2xl shadow-lg z-20 relative overflow-y-auto max-h-[90vh]"
        ref={modalRef}
      >
        <span
          onClick={() => setModals(false)}
          className="absolute top-4 right-5 text-2xl cursor-pointer z-50 hover:bg-slate-400/50 px-1 py-[5px] rounded-md leading-3 text-black bg-slate-200"
        >
          &times;
        </span>

        <div className="w-full text-black mt-5 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Review Form Data</h2>

          {/* Mapping over payload */}
          {Object.entries(payload).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col md:flex-row md:justify-between border-b border-gray-300 py-2"
            >
              <span className="font-medium capitalize text-gray-600">
                {key.replace(/_/g, " ")}:
              </span>
              <span className="text-gray-800">
                {typeof value === "object" && value !== null
                  ? JSON.stringify(value, null, 2)
                  : value?.toString() || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
