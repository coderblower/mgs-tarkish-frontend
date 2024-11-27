import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { post } from "../../api/axios";
import download_img from "../../../public/images/download.svg";
import pdf_icon from "../../../public/images/pdfImg.svg";
import user_img from "../../../public/images/Avater.png";
import success_img from "../../../public/images/success_2.svg";
import reject_img from "../../../public/images/alert_icon.svg";
import DocumentCard from "../DocumentCard";
import toast, { Toaster } from "react-hot-toast";
import TableLoading from "../TableLoading";
const API_URL = import.meta.env.VITE_BASE_URL;

const DocumentView = ({userId}) => {
  const { id = userId } = useParams();
  const [candidateID, setCandidateID] = useState();
  const [approvelStatus, setApprovelStatus] = useState("");
  const [approvelNote, setApprovelNote] = useState("");
  const [data, setData] = useState();
  const [statusValue, setStatusValuet] = useState();
  const [statusMessage, setStatusMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(id);

  useEffect(() => {
    if (id) {
      fetchUser().then((result) => {
        
        setData(result);
      });
    }
  }, [id, refresh]);

  // Get user role
  useEffect(() => {
    const json_data = window.localStorage.getItem("user");
    const user_data = JSON.parse(json_data);
    setUserRole(user_data);
  }, []);

  const [userRole, setUserRole] = useState();
  const [deletedData, setDeletedData] = useState({}); 

  // Fetch user
  const fetchUser = async () => {
    setLoading(true);
    let allFile = [];
    try {
      const response = await post(`api/user/get_user`, { id: id });
      console.log(response.data, "====>");
      // setData(response.data);
      setCandidateID(response?.data?.candidate?.id);
      setApprovelNote(response?.data?.candidate?.note);
      setApprovelStatus(response?.data?.candidate?.approval_status);
      setDeletedData(response?.data?.candidate?.delete_files ?? {});
      
      const {
        photo,
        nid_file,
        passport_file,
        academic_file,
        experience_file,
        training_file,
        pif_file,
        passport_all_page,
        cv,
        resume,
        birth_certificate



        

      } = response?.data?.candidate;



      allFile.push({
        id: 1,
        toDelete: 'photo', 
        title: "Profile Photo",
        url: photo ? photo : null,
        error: "Profile Photo not uploaded",
      });
      allFile.push({
        id: 2,
        toDelete: 'nid_file',
        title: "NID Photo",
        url: nid_file ? nid_file : null,
        error: "NID file not uploaded",
      });
      allFile.push({
        id: 3,
        toDelete: 'passport_file',
        title: "Passport Photo",
        url: passport_file ? passport_file : null,
        error: "Passport file not uploaded",
      });
      allFile.push({
        id: 4,
        toDelete: 'academic_file',
        title: "Academic Photo",
        url: academic_file ? academic_file : null,
        error: "Academic file not uploaded",
      });
      allFile.push({
        id: 5,
        toDelete: 'experience_file',
        title: "Experience Photo",
        url: experience_file ? experience_file : null,
        error: "Experience file not uploaded",
      });
      allFile.push({
        id: 6,
        toDelete: 'training_file',
        title: "Training Photo",
        url: training_file ? training_file : null,
        error: "Training file not uploaded",
      });
      allFile.push({
        id: 7,
        toDelete: 'pif_file',
        title: "PIF",
        url: pif_file ? pif_file : null,
        error: "Training file not uploaded",
      });

      allFile.push({
        id: 8,
        toDelete: 'passport_all_page',
        title: "Passport All page",
        url: passport_all_page ? passport_all_page : null,
        error: "Training file not uploaded",
      });

      allFile.push({
        id: 9,
        toDelete: 'cv',
        title: "CV",
        url: cv ? cv : null,
        error: "Training file not uploaded",
      });

      allFile.push({
        id: 10,
        toDelete: 'resume',
        title: "Resume",
        url: resume ? resume : null,
        error: "Training file not uploaded",
      });
      allFile.push({
        id: 11,
        toDelete: 'birth_certificate',
        title: "CV",
        url: birth_certificate ? birth_certificate : null,
        error: "Training file not uploaded",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error creating app:", error);
      setLoading(false);
    } finally {
      console.log(allFile);
      setLoading(false);
      return allFile;
    }
  };

  // Submit candidate
  const submitCandidate = async () => {
    const payload = {
      id: candidateID,
      approval_status: statusValue,
      note: statusMessage,
    };

    console.log(payload);

    try {
      const res = await post("api/candidate/update_approval_status", payload);
      if (res?.success) {
        console.log(res);
        setStatusValuet("");
        setStatusMessage("");
        toast.success(res.message);
      }
    } catch (error) {
      console.log("Failed to post/======>182", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mt-8">
        <h2 className="font-bold text-[24px] ">Document view</h2>
      </div>

      {/* Rejectet candidate  */}
      {!loading &&
        (approvelStatus === "reject" || approvelStatus === "approve") && (
          <div className="flex justify-center mt-14 mb-[70px]">
            <div>
              <div
                className={`py-[50px] border ${
                  approvelStatus === "reject" && "border-[red]"
                } lg:w-[650px]  rounded-md flex items-center justify-center`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-7">
                    {approvelStatus === "reject" ? (
                      <img className="w-[53px]" src={reject_img} alt="" />
                    ) : (
                      <img className="w-[53px]" src={success_img} alt="" />
                    )}
                  </div>
                  <p
                    className={`text-center ${
                      approvelStatus === "reject" ? "text-[red]" : "text-black"
                    }`}
                  >
                    {approvelNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* document view  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] relative mt-[50px]">
        {!loading &&
          data?.length > 0 &&
          data.map((file, i) => {
            console.log(deletedData, file.toDelete)
        
            return !deletedData[file?.toDelete] && file.url ? <DocumentCard key={i} userId = {userId} setRefresh = {setRefresh} file={file} />: ''})}
      </div>

      {/* Loading  */}
      {loading && (
        <div className="flex justify-center min-w-full mt-20 ">
          <TableLoading />
        </div>
      )}
      {!loading && data?.length === 0 && (
        <div className="flex justify-center min-w-full mt-20 ">
          <h4 className="text-black font-bold text-xl">No Data found!</h4>
        </div>
      )}

      {/* Candidate aprove, reject and message  */}
      {!loading && (
        <div className="mt-14">
          {/* message area */}
          {userRole?.role_id === 1 && approvelStatus === "pending" && (
            <>
              <div className="flex items-center justify-between mb-[15px]">
                <h2 className=""> Message </h2>
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValuet(e.target.value)}
                  className="px-4 py-1  border-[1px]  rounded-md outline-none border-[#b9b9b9]"
                >
                  <option value="">-- Set Status --</option>
                  <option value="approved">Approved</option>
                  <option value="reject">Reject</option>
                </select>
              </div>
              <textarea
                className="border-[1px] border-black w-full outline-none rounded-md p-5"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                rows="10"
              />
              <div className="flex justify-end">
                <button
                  onClick={submitCandidate}
                  className="py-[15px] px-[40px] transition-transform active:scale-95 bg-[#1E3767] text-white font-bold rounded-md mt-5 flex gap-2"
                  type="button"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default DocumentView;
