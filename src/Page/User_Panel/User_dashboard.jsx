import user_img from "../../../public/images/Avater.png";
import download_img from "../../../public/images/download.svg";
import { useEffect, useState } from "react";
import { post } from "../../api/axios";
import { saveAs } from "file-saver";
import React from "react";
const API_URL = import.meta.env.VITE_BASE_URL;

const UserDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [address, setAddress] = useState(null);
  const [file, setFile] = useState(null);
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("user");
    if (storedUser) {
      setData(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    post("/api/user/candidate/get_candidate")
      .then((res) => {
        setCandidate(res.data?.candidate);
        window.localStorage.setItem("candidate", JSON.stringify(res.data?.candidate));
        const storedCandidate = JSON.parse(window.localStorage.getItem("candidate"));
        setCandidate(storedCandidate);
        const parsedAddress = JSON.parse(storedCandidate?.address);
        setAddress(parsedAddress);
        
      })
      .catch((err) => console.error(err))
      .finally(() =>{
        setLoading(false);
        checkIsCertificateVerified()
      });
      
  }, []);


  let checkIsCertificateVerified =  async() => {

    let res =await post('api/user/check_upload_verified_certificate');
    setAlreadyVerified(res.isVerified);
  }

  const downloadImage = () => {
    saveAs(`${API_URL}/${candidate?.qr_code}`, "QR_Code.jpg");
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadSubmit = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      post("api/user/upload_verified_certificate", formData, {
        headers: {  "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          console.log("File uploaded successfully:", res.data);
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Upload failed:", err));
    }
  };

  return (
    <div className="lg:mt-10 mt-2">
      {/* Header */}
      <div className="flex items-center justify-between mt-6">
        <h2 className="text-2xl text-gray-600">Dashboard</h2>
        <button className="py-3 px-6 bg-blue-900 text-white font-bold rounded-md flex items-center gap-4">
          <img src={download_img} alt="Download Icon" />
          <h3>Download CV</h3>
        </button>
      </div>

      {/* User Profile Section */}
      <div className="bg-gray-200 mt-8 rounded-md lg:flex lg:px-12 px-4 py-7 justify-between">
        <div className="flex flex-col items-center">
          <div className="h-36 w-36 rounded-full overflow-hidden">
            <img
              className="w-full h-full"
              src={candidate?.photo ? `${API_URL}/${candidate?.photo}` : user_img}
              alt="User"
            />
          </div>
          <h2 className="mt-3 font-semibold text-center text-2xl text-gray-600">
            {data?.name}
          </h2>
        </div>

        {/* Basic Info */}
        <div className="border-l-2 border-gray-600 mx-4"></div>
        <div>
          <h2 className="font-semibold text-xl text-gray-800 mb-5">Basic Info</h2>
          <div className="lg:flex justify-between gap-4 mb-5">
            <div>
              <p className="text-gray-600 mb-6">NAME: {data?.name}</p>
              <p className="text-gray-600">PHONE: {data?.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-6">EMAIL: {data?.email}</p>
              <h2>
                Registration date: <small>{data?.created_at?.slice(0, 10)}</small>
              </h2>
            </div>
          </div>

          <div className="border-2 border-gray-600 rounded-lg mb-4"></div>

          <h2 className="text-xl font-semibold mb-2">Present Address</h2>
          <p>{address ? `${address.address}, ${address.city}, ${address.country}` : "No address available"}</p>
          <p>{address ? `${address.post_code}, ${address.post_office}` : ""}</p>
        </div>

        <div className="lg:hidden border-t-2 border-gray-600 rounded-lg my-4"></div>

        {/* QR Code Section */}
        <div className="text-center">
          <h2>Download QR For More Details</h2>
          <div className="flex justify-center mt-2">
            {candidate?.qr_code ? (
              <img className="w-36" src={`${API_URL}/${candidate?.qr_code}`} alt="QR Code" />
            ) : (
              <h1 className="my-8 font-bold">Not Found</h1>
            )}
          </div>
          <button
            onClick={downloadImage}
            className="bg-blue-900 py-2 px-8 rounded-md text-white mt-6 font-semibold"
          >
            Download QR
          </button>
        </div>
      </div>

      {/* Medical Status */}
      <div className="mt-5 bg-gray-200 font-semibold w-full py-2 px-3 rounded-md">
        Medical Status
      </div>
      <div className="flex items-center justify-between my-3 font-semibold bg-gray-200 w-full py-1.5 px-3 rounded-md">
        <h2>Selected Medical Center:</h2>
        <span className="text-gray-600">Uttara Medical Center, Uttara, Dhaka-1218</span>
        <button className="bg-blue-900 text-white text-sm rounded-md px-6 py-1.5">Update</button>
      </div>

      {/* Upload Certificate Modal */}
     { !alreadyVerified && ( <div className="flex items-center justify-between my-3 font-semibold bg-gray-200 w-full py-1.5 px-3 rounded-md">
        <div>Upload Verified SSC Certificate</div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-900 text-white text-sm rounded-md px-6 py-1.5"
        >
          Update
        </button>
      </div>) }

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-semibold mb-4">Upload SSC Certificate</h2>
            <input type="file" onChange={handleFileUpload} />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Training Center Info */}
      <div className="my-3 bg-gray-200 w-full py-3 px-4 rounded-md flex items-center justify-between">
        <h1 className="font-semibold">
          Mirpur Training Center: <span className="text-gray-600">Mirpur-12, Dhaka-1216</span>
        </h1>
        <h3 className="font-semibold">
          Selected Skill: <small className="text-gray-600">Brigadier (Foreman)</small>
        </h3>
      </div>

      {/* Skill Status Table */}
      <div className="overflow-x-auto mb-10">
        <table className="table-auto w-full border">
          <thead className="bg-gray-200 border-b-2">
            <tr className="uppercase border-b-2 border-gray-500">
              <th className="px-4 py-2 rounded-tl-md">ID</th>
              <th className="px-4 py-2">Skilled</th>
              <th className="px-4 py-2">Crash Training</th>
              <th className="px-4 py-2">Payment Status</th>
              <th className="px-4 py-2">Exam Result</th>
              <th className="px-4 py-2">Further Training</th>
              <th className="px-4 py-2 rounded-tr-md">Status</th>
            </tr>
          </thead>
          <tbody>{/* Rows to be added dynamically */}</tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
