import { useEffect, useState } from "react";
import { post } from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import user_img from "../../../public/images/Avater.png";
import delete_icon from "../../../public/images/delete_icon.svg";
import view_icon from "../../../public/images/veiw_ison.svg";
import document_view from "../../../public/images/document.svg";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../component/Pagination";
import Modal from "../../component/Modal";
import TableLoading from "../../component/TableLoading";
const API_URL = import.meta.env.VITE_BASE_URL;

const Final_Test = () => {
  const navigate = useNavigate();
  const [modals, setModals] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [candidate, setCandate] = useState(null);
  const [qualified, setQualified] = useState("");
  const [user_id, setUser_id] = useState("");
  const [certificateUrl, setCertificateUrl] = useState(null);

  const [paginations, setPaginations] = useState({
    per_page: "",
    total: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinalTest();
  }, [currentPage]);

  const fetchFinalTest = async () => {
    setLoading(true);
    try {
      const res = await post(`/api/final_test/all0`);
      console.log("res", res);
      if (res) {
        setCandate(res.data);
        setPaginations({
          per_page: res.data.per_page,
          total: res.data.total,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (id) => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("certificate_upload", selectedFile);

    try {
      const res = await post(`api/final_test/upload_certificate/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("res", res);
      if (res.success) {
        toast.success("Certificate uploaded successfully!");
        setUploadModal(false);
        setSelectedFile(null);
        fetchFinalTest(); // Refresh data after upload
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload certificate.");
    }
  };

  const handleSubmit = async () => {
    const payload = {
      id: parseInt(user_id),
      status: parseInt(qualified),
    };
    try {
      const res = await post(`api/final_test/update`, payload);
      if (res.success) {
        navigate("/training/qualified-candidates");
        setModals(false);
        toast.success(res.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="lg:mt-10 mt-2">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-[24px]">Final Test Candidates</h2>
      </div>

      <div className="overflow-auto mt-6">
        <table className="table table-zebra overflow-x-auto">
          <thead className="border-b-2">
            <tr className="uppercase bg-[#f2f2f2] whitespace-nowrap">
              <th>ID</th>
              <th>Name</th>
              <th>Passport</th>
              <th>Register date</th>
              <th>Email</th>
              <th>Pre Skilled</th>
              <th>Skill Test</th>
              <th>Phone</th>
              <th>Photo</th>
              <th className="text-center">QR</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              candidate?.length > 0 &&
              candidate?.map((item, i) => (
                <tr key={i} className="whitespace-nowrap">
                  <th>{i + 1}</th>
                  <th>{item?.user?.name}</th>
                  <th>{item?.candidate?.passport}</th>
                  <th>{item?.created_at.slice(0, 10)}</th>
                  <th>{item?.user?.email}</th>
                  <th>Qualified</th>
                  <th>Qualified</th>
                  <th>{item?.user?.phone}</th>
                  <th>
                    <img
                      className="h-[48px] w-[48px] rounded-full"
                      src={
                        item?.candidate?.photo
                          ? `${API_URL}/${item?.candidate?.photo}`
                          : user_img
                      }
                      alt=""
                    />
                  </th>
                  <th className="flex justify-center">
                    <img
                      className="h-[40px] w-[40px]"
                      src={
                        item?.candidate?.qr_code
                          ? `${API_URL}/${item?.candidate?.qr_code}`
                          : user_img
                      }
                      alt=""
                    />
                  </th>
                  <th>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setModals(true);
                          setUser_id(item.id);
                        }}
                        className="bg-[#1E3767] px-[20px] py-[6px] rounded-[4px] text-white"
                      >
                        Details
                      </button>
                   
                    </div>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="flex justify-center min-w-full mt-20">
          <TableLoading />
        </div>
      )}
      {!loading && candidate?.length === 0 && (
        <div className="flex justify-center min-w-full mt-20">
          <h4 className="text-black font-bold text-xl">No Data found!</h4>
        </div>
      )}
      {!loading &&
        candidate?.length > 0 &&
        paginations?.total > paginations?.per_page && (
          <Pagination
            paginations={paginations}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

      {/* Upload Modal */}
      <Modal modals={uploadModal}  setModals={setUploadModal}>
        {certificateUrl ? (
          <div>
            <h1 className="text-center text-xl font-bold pb-2">Uploaded Certificate</h1>
            <img
              src={certificateUrl}
              alt="Uploaded Certificate"
              className="max-w-full max-h-[400px] mx-auto border rounded shadow"
            />
          </div>
        ) : (
          <div>
            <h1 className="text-center text-xl font-bold pb-2">Upload Certificate</h1>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={ ()=>{
                    console.log(candidateId)
                    handleFileUpload(candidateId)}}
                className="bg-[#1E3767] px-[40px] py-[12px] rounded-lg text-white transition-transform active:scale-95"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>


      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Final_Test;
