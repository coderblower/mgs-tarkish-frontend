import React, { useEffect, useRef } from "react";

const Table = ({ data, title }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <table className="w-full text-left text-gray-800 border border-gray-300 rounded-md">
      <thead>
        <tr>
          <th className="p-2 border-b bg-gray-200">Field</th>
          <th className="p-2 border-b bg-gray-200">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([key, value]) => (
          <tr key={key}>
            <td className="p-2 border-b font-medium capitalize">
              {key.replace(/_/g, ' ')}
            </td>
            <td className="p-2 border-b">
              {typeof value === 'object' && !(value instanceof File)
                ? <span>Nested Data</span> // Display a placeholder for nested data
                : value instanceof File ? value.name : value || 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ReviewModal = ({ modals, setModals, payload }) => {
  
  let modalRef = useRef();

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
      className={`fixed inset-0 flex items-center justify-center z-50 ${modals ? "" : "hidden"}`}
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

        <div className="w-full text-black">
          <h1 className="text-2xl font-bold mb-4">Form Data Review</h1>
          {/* Main fields */}


        {payload && (
<>
<Table data={payload} title="Main Information" />

{/* Nested tables for specific sections */}
{payload.address && <Table data={payload.address} title="Address" />}
{payload.academic && <Table data={payload.academic} title="Academic Information" />}
{payload.experience && <Table data={payload.experience} title="Experience" />}
{payload.training && <Table data={payload.training} title="Training & Skills" />}

</>


        )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
