import { useEffect, useState } from "react";
import { post } from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import user_img from "../../../public/images/Avater.png";
import Pagination from "../../component/Pagination";
import Select from "../../component/Select";
import TableLoading from "../../component/TableLoading";
import veiw_icon from "../../../public/images/veiw_ison.svg";
import Modal from "../../component/Modal";
import document_view from "../../../public/images/document.svg";


import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_BASE_URL;

const TrainingReports = () => {
  const [candidate, setCandate] = useState(null);
  const [paginations, setPaginations] = useState({
    per_page: "",
    total: "",
  });


  const [uploadModal, setUploadModal] = useState(false);

  const [modals, setModals] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [medicalList, setMedicalList] = useState([]);
  const [agent_list, setAgent_list] = useState([]);
  const [result, setResult] = useState("");
  const [user_id, setUser_id] = useState("");
  const [agent_id, setAgent_id] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingReport();
  }, [currentPage, user_id, result]);

  const fetchTrainingReport = async () => {
    setLoading(true);
    try {
      const res = await post(`/api/final_test/filter`, {
        user_id,
        status: result,
      });
      console.log(res);
      if (res) {
        setCandate(res.data);
        setCount(res.count);
        setPaginations({
          per_page: res.data.per_page,
          total: res.data.total,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log("Error creating app:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraining();
    fetchAgent();
  }, []);

  const fetchTraining = async () => {
    try {
      const res = await post(`/api/final_test/training_centers`);
      console.log(res);
      if (res.success) {
        setMedicalList(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAgent = async () => {
    try {
      const res = await post(`/api/partner/get_partners`, {
        role_id: 4,
      });
      console.log(res);
      if (res.success) {
        setAgent_list(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="lg:mt-10 mt-2">
      {/* Partner Registration filter */}
      <div className="flex justify-between items-center ">
        <h2 className="font-bold text-[24px] ">Training Reports ({count})</h2>

        <div className="flex gap-4">
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className=" px-2 p-[8px]  mb-5 rounded-md outline-none border-2 border-[#C5BFBF]"
          >
            <option value="">--select--</option>
            <option value="1">Qualified</option>
            <option value="0">UnQualified</option>
          </select>

          <Select data={user_id} setData={setUser_id} option={medicalList} />
          <Select data={agent_id} setData={setAgent_id} option={agent_list} />
          <div>
            <input
              type="date"
              className=" px-2 p-[8px]  mb-5 rounded-md outline-none border-2 border-[#C5BFBF]"
            />
          </div>
        </div>
      </div>

      {/* table  */}
      <div className="overflow-auto mt-6">
        <table className="table table-zebra  overflow-x-auto">
          {/* head */}
          <thead className=" border-b-2">
            <tr className="uppercase bg-[#f2f2f2] whitespace-nowrap">
              <th>ID</th>
              <th>Name</th>
              <th>Register date</th>
              <th>Passport</th>
              <th>Agent</th>
              <th>Email</th>
              <th>Pre Skilled</th>
              <th>Skill Test</th>
              <th>Final Test</th>
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
                <tr className="whitespace-nowrap">
                  <th>{i + 1}</th>
                  <th>{item?.user?.name}</th>
                  <th>{item?.created_at.slice(0, 10)}</th>
                  <th>{item?.candidate?.passport}</th>
                  <th>{item?.user?.createdby.name}</th>
                  <th>{item?.user?.email}</th>
                  <th>Qualified</th>
                  <th>Qualified</th>
                  <th>{item?.status == 1 ? "Qualified" : "UnQualified"}</th>
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
                      className="h-[40px] w-[40px] "
                      src={
                        item?.candidate?.qr_code
                          ? `${API_URL}/${item?.candidate?.qr_code}`
                          : user_img
                      }
                      alt=""
                    />
                  </th>
                  <th>
                   <div className=" flex gap-1 ">
                      <Link to={`/admin/user_profile/${item.user_id}`}>
                          <img src={veiw_icon} alt="" className="w-5" />
                        </Link>


                        {
                          item?.certificate_upload ? (
                            <img className=" cursor-pointer" src={document_view} 
                                onClick={() => {
                                setCertificateUrl(`${API_URL}${item?.certificate_upload}` );
                                setUploadModal(true);
                              }}
                              
                              alt="certificate" /> 
                          ): ''
                        }
                   </div>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="flex justify-center min-w-full mt-20 ">
          <TableLoading />
        </div>
      )}
      {!loading && candidate.length === 0 && (
        <div className="flex justify-center min-w-full mt-20 ">
          <h4 className="text-black font-bold text-xl">No Data found!</h4>
        </div>
      )}

      {/* pagition  */}

      {!loading && candidate.length > 0 && (
        <Pagination
          paginations={paginations}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}


      <Modal modals={uploadModal}  setCertificateUrl={setCertificateUrl} setModals={setUploadModal}>
        {certificateUrl ? (
          <div>
            <h1 className="text-center text-xl font-bold pb-2">Uploaded Certificate</h1>
            <img
              src={certificateUrl}
              alt="Uploaded Certificate"
              className="max-w-full max-h-[400px] mx-auto border rounded shadow"
            />
          </div>
        ) : ''}
      </Modal>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default TrainingReports;
