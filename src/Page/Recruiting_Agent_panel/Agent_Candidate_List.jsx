import { useEffect, useState } from "react";
import { post } from "../../api/axios";
import user_img from "../../../public/images/Avater.png";
import notQR_img from "../../../public/images/notQR.jpeg";
import delete_icon from "../../../public/images/delete_icon.svg";
import edit_icon from "../../assets/update.svg";
import veiw_icon from "../../../public/images/veiw_ison.svg";
import { Link, NavLink, json } from "react-router-dom";
import Pagination from "../../component/Pagination";
import SearchInput from "../../component/SearchInput";
import TableLoading from "../../component/TableLoading";
import CSVBtn from "../../component/CSVBtn";
import success_icon from "../../../public/images/success.svg";
import documentUploadet from "../../../public/images/document.svg";
import documentNotUploadet from "../../../public/images/documentNot.svg";
import exportImg from "../../../public/images/export.svg";

import Profile_Details from "../../component/ProfileMenu/Profile_Details";
import UpdateCadidate from "../../component/UpdateCandidate/UpdateCadidate";
import UserProfileModal from "../../component/CandidateModal";
import DocumentView from "../../component/ProfileMenu/DocumentView"

const API_URL = import.meta.env.VITE_BASE_URL;

const Agent_Candidate_List = () => {
  const [candidate, setCandidate] = useState(null);
  const [allCandidate, setAllCandate] = useState([]);
  const [csv_data, setCsv_data] = useState([]);
  const [countryResult, setCountryResult] = useState();
  const [newSearchValue, setNewSearchValue] = useState("");
  const [cachedCandidates, setCachedCandidates] = useState({}); 
  const [search, setSearch] = useState("");
  const [showBio, setShowBio] = useState(false); 
  const [editProfile, setEditProfile] = useState(false); 
  const [ documentViewModal, SetDocumentViewModal] = useState(false);
  const [userId, setUserId] = useState(null);

  const agent = JSON.parse(window.localStorage.getItem('user')).name;

  

  const [paginations, setPaginations] = useState({
    per_page: "",
    total: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (cachedCandidates[currentPage]) {
      setCandidate(cachedCandidates[currentPage]);
    } else {
      fetchCandidate(search, currentPage);
    }
     preloadCandidates();
  }, [currentPage]);

 


  useEffect(()=>{
    
    fetchCandidate( search,  currentPage);
  
    setCurrentPage(1)
  }, [search,  countryResult]); 



const fetchCandidate = async (search, page) => {
  
  setLoading(true);
  try {
    console.log("Fetching candidates for search:", search, );
    const res = await post(`/api/user/search_candidate?page=${search ? 1 : page}`, {
      pg: "a",
      phone: search,
      agent: agent,
      country: countryResult,

    });
    const data = res?.data?.data || [];
    console.log(data);
    setCachedCandidates((prevCache) => ({ ...prevCache, [page]: data }));
    setCandidate(data);

    setPaginations({
      per_page: res?.data?.per_page || 10,
      total: res?.data?.total || 0,
    });
  } catch (error) {
    console.log("Error fetching candidates:", error);
  } finally {
    setLoading(false);
  }
};


const preloadCandidates = async () => {
  for (let i = 1; i <= 4; i++) {
    const prevPage = currentPage-i;
    const nextPage = currentPage + i;

    
    if (cachedCandidates[nextPage]) continue; // Skip if data for this page is already cached

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const res = await post(`/api/user/search_candidate?page=${nextPage}`);
      console.log('resolved ', res);

      const data = res?.data?.data || [];

      // Cache the preloaded data for the next page
      setCachedCandidates((prevCache) => ({ ...prevCache, [nextPage]: data }));
    } catch (error) {
      console.log(`Error preloading candidates for page ${nextPage}:`, error);
    }
  }
};


const handleCSVData = async () => {
  
  try {
    const res = await post(`api/user/search_candidate`, {
      pg: "a",
      phone: search,
      agent: agent,
      country: parseInt(countryResult) || "",
      export_all: true,
    }, {
      responseType: 'blob',});
    console.log(res);
    if (res) {
      // Create a link element, set its href to the CSV file URL, and click it
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'candidates.csv'); // or any other filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } 
  } catch (error) {
    console.log("Error fetching CSV data:", error);
  } finally {
    
  }
};















  // console.log(candidate?.candidate?.country === 1);


  // console.log(candidate);
  return (
    <div className="lg:mt-10 mt-2">
      {/* Partner Registration filter */}
      <div className="lg:flex justify-between items-center ">
        <div className="">
          <h2 className="font-bold text-[24px] ">
            Candidates ({paginations?.total})
          </h2>
        </div>
        <div className="flex gap-4 mt-[20px] lg:mt-0">
          <select
            value={countryResult}
            onChange={(e) => setCountryResult(e.target.value)}
            className="px-4 py-1  border-2  rounded-md outline-none"
          >
            <option value="">--select--</option>
            <option value="2">Turkey</option>
            <option value="1">Russia</option>
            <option value="3">Hungery</option>
          </select>


          <div className=" flex gap-5 mx-5 ">
         


          <button onClick={()=>handleCSVData()} >
              <img src={exportImg} className=" w-[22px]" alt="" />
            </button>
        </div>
          

          {/* search candidate */}
          <SearchInput
            placeholder="Search Candidates "
            search={search}
            setSearch={setSearch}
            newSearchValue={newSearchValue}
            setNewSearchValue={setNewSearchValue}
          />
       
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
              <th>Passport</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Photo</th>
              <th className="text-center">QR</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              candidate?.length > 0 &&
              candidate?.map((item, i) => {
                const index = (currentPage - 1) * paginations.per_page + i + 1;

                return (
                  <>
                    <tr className="whitespace-nowrap">
                      <th>{index}</th>
                      {/* <th>{ item?.name}</th> */}
                      <th>
                        <div className="flex gap-2 items-center">
                          <>
                            {item?.candidate?.photo &&
                              item?.candidate?.passport_file &&
                              item?.candidate?.nid_file &&
                              item?.candidate?.training_file && (
                                <img src={success_icon} alt="success" />
                              )}
                          </>
                          <>{item?.name}</>
                        </div>
                      </th>
                      <th>{item?.candidate?.passport || "Null"}</th>
                      <th>{item?.email}</th>
                      <th>{item?.phone}</th>
                      {<th>{item?.candidate?.approval_status}</th>}
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
                        {item?.candidate?.qr_code &&
                        item?.candidate?.approval_status !== "reject" &&
                        item?.candidate?.approval_status !== "pending" ? (
                          <img
                            className="h-[40px] w-[40px] "
                            src={`${API_URL}/${item?.candidate?.qr_code}`}
                            alt=""
                          />
                        ) : (
                          <img
                            className="h-[40px] w-[40px] "
                            src={notQR_img}
                            alt=""
                          />
                        )}
                      </th>
                      <th>
                         <div className="flex items-center justify-between gap-3 w-[90px]">
                        {/* <Link to={`/admin/user_profile/${item.id}`}>
                          <img src={veiw_icon} alt="" className="w-5" />
                        </Link> */}

                        <button
                          onClick={ ()=> {
                            setShowBio(true)
                            setUserId(item?.id)
                          }}
                          >
                          <img src={veiw_icon} alt="" className="w-5" /> 
                        </button>


                        <button
                          onClick={ ()=> {
                            setEditProfile(true)
                            setUserId(item?.id)
                          }}
                          >
                          <img src={edit_icon} alt="" className="w-5" /> 
                        </button>
{/*  */}
                        {/* <Link to={`/admin/user_update/${item.id}`}>
                          <img src={edit_icon} alt="" className="w-5" />
                        </Link> */}


                        <button
                          onClick={ ()=> {
                            SetDocumentViewModal(true)
                            setUserId(item?.id)
                          }}
                          >
                            <img
                            src={item?.candidate?.approval_status === "reject" || item?.candidate?.approval_status === "pending" ? documentNotUploadet : documentUploadet}
                            alt="file"
                            className="max-w-[20px] max-h-[20px]"
                          />
                        </button>

                      </div>
                      </th>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
      {loading && (
        <div className="flex justify-center min-w-full mt-20 ">
          <TableLoading />
        </div>
      )}
      {!loading && candidate?.length === 0 && (
        <div className="flex justify-center min-w-full mt-20 ">
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

       



{showBio&& (
        <UserProfileModal modals={showBio} setModals={setShowBio}>
         <Profile_Details userId = {userId} />
        </UserProfileModal>
      )}


    {editProfile&& (
            <UserProfileModal modals={editProfile} setModals={setEditProfile}>
            <UpdateCadidate userId = {userId} />
            </UserProfileModal>
          )}
        

    {documentViewModal&& (
            <UserProfileModal modals={documentViewModal} setModals={SetDocumentViewModal}>
            <DocumentView userId = {userId} />
            </UserProfileModal>
          )}

    </div>
  );
};

export default Agent_Candidate_List;
