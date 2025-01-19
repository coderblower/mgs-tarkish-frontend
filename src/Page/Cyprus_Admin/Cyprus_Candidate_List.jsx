import { useEffect, useState } from "react";
import { post, get } from "../../api/axios";
import user_img from "../../../public/images/Avater.png";
import notQR_img from "../../../public/images/notQR.jpeg";
import veiw_icon from "../../../public/images/veiw_ison.svg";
import edit_icon from "../../assets/update.svg";
import { Link, NavLink } from "react-router-dom";
import Pagination from "../../component/Pagination";
import SearchInput from "../../component/SearchInput";
import CSVBtn from "../../component/CSVBtn";
import TableLoading from "../../component/TableLoading";
import success_icon from "../../../public/images/success.svg";
import documentUploadet from "../../../public/images/document.svg";
import documentNotUploadet from "../../../public/images/documentNot.svg";
import Profile_details_Syprus from "../../component/ProfileMenu/Profile_details_Syprus";
import UpdateCadidate from "../../component/UpdateCandidate/UpdateCadidate";
import UserProfileModal from "../../component/CandidateModal";
import DocumentViewSyprus from "../../component/ProfileMenu/DocumentViewSyprus";
import grid from "../../../public/images/grid.svg";
import list from "../../../public/images/list.svg";
import exportImg from "../../../public/images/export.svg";
import jsPDF from 'jspdf';

import MultiLevelDropdown from "../../component/MultiLevelDropdown";

import CandidateModal from "../../component/CandidateModal";
const API_URL = import.meta.env.VITE_BASE_URL;

const Cyprus_Candidate_List = () => {
  const [candidate, setCandidate] = useState([]);
  const [allCandidate, setAllCandidate] = useState([]);
  const [csv_data, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newSearchValue, setNewSearchValue] = useState("");
  
  const [paginations, setPaginations] = useState({
    per_page: 10,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [countryResult, setCountryResult] = useState("");
  const [agent, setAgent] = useState("");

  
  const [cachedCandidates, setCachedCandidates] = useState({}); 
  const [showBio, setShowBio] = useState(false); 
  const [editProfile, setEditProfile] = useState(false); 
  const [ documentViewModal, SetDocumentViewModal] = useState(false); 
  const [ gridView, setGridView] = useState(true); 
  const [userId, setUserId] = useState(null); 
  const [agentSubmenu, setAgentSubmenu] = useState([]);
  const [designationMenu, setDesignationMenu] = useState([]);
  const [designation, setDesignation] = useState("");
  

  useEffect(() => {
    fetchAgentSubmenu();
    fetchDesignation()
  }, []);

  const fetchAgentSubmenu = async () => {
    try {
      const response = await post('api/partner/get_partners_name', { role_id: 4 });
      const data = response?.data || [];
      setAgentSubmenu(data);
      console.log(data) // Store submenu items
    } catch (error) {
      console.error("Error fetching agent submenu items:", error);
    }
  };

  const fetchDesignation = async () => {
    try {
      const response = await post('api/designation/all');
      console.log(response);
      const data = response?.data || [];
      setDesignationMenu(data);
      console.log(data) // Store submenu items
    } catch (error) {
      console.error("Error fetching agent submenu items:", error);
    }
  };




  useEffect(()=>{
    
      fetchCandidate( search,  currentPage);
    
  }, [search, agent, countryResult, designation]); 

  useEffect(() => {
    if (cachedCandidates[currentPage]) {
      setCandidate(cachedCandidates[currentPage]);
    } else {
      fetchCandidate(search, currentPage);
    }
     preloadCandidates();
  }, [currentPage, countryResult]);
  
  const fetchCandidate = async (search, page) => {
    
    setLoading(true);
    try {
      console.log("Fetching candidates for search:", search, );
      const res = await post(`/api/user/search_candidate?page=${search ? 1 : page}`, {
        pg: "a",
        phone: search,
        agent: agent,
        country: parseInt(countryResult) || "",
        designation: designation,
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
        const res = await post(`/api/user/search_candidate?page=${nextPage}`, {
          pg: "a",
          phone: search,
          country: parseInt(countryResult) || "",
          designation: designation,
        });
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
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleImageClick = async (id) => {
    try {
      
      

      // Fetch the image as a Blob
      const response = await get(`/api/candidate/get_qr/${id}`, {
        responseType: 'blob',}).then((response) => {
          console.log(response); 
          const blob = new Blob([response],  { type: 'application/pdf' });
          
         

          const url = window.URL.createObjectURL(blob);

          // Create an <a> element for download
          const a = document.createElement('a');
          a.href = url;
          a.download = 'qr_code.pdf'; // Set the filename
          document.body.appendChild(a);
          a.click(); // Trigger the download
          a.remove(); // Cleanup the element

          // Revoke the blob URL
          window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
          console.error('Error downloading QR code:', error);
      });
  } catch(error){
    console.log(error)
  }

}

  return (
    <div className="lg:mt-10 mt-2">
       <h2 className="font-bold text-[24px] mb-10 ">
          Candidates ({paginations?.total})
        </h2>
      <div className="lg:flex justify-center items-center ">
       
        <div className="lg:flex block gap-4 mt-6 lg:mt-0 mb-4">
          <div className="flex gap-4 ">

           

           

            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="px-4 py-1 border-2 rounded-md outline-none"
            >
              <option value="">Trade List </option>
              {designationMenu.map((x) => (
                <option key={x.id} value={x.name}> {/* Assuming each agent has a unique `id` */}
                  {x.name} &nbsp;( {x.count})
                </option>
              ))}
            </select>

            
          

</div>
        

        <div className=" flex gap-5 mx-5 ">
          <button  className="mx-2"
                  onClick={()=>setGridView(!gridView)}
                >
                {gridView ? (<img src={grid} className=" w-[20px]"  alt="" />): (<img src={list} alt=""  className=" w-[20px]" />)} 
                </button>


          <button onClick={()=>handleCSVData()} >
              <img src={exportImg} className=" w-[22px]" alt="" />
            </button>
        </div>
          

          
          <div className="flex gap-4 mt-6 lg:mt-0 w-[300px]">
            
            <SearchInput
              placeholder="Search Candidates"
              search={search}
              setSearch={setSearch}
              newSearchValue={newSearchValue}
              setNewSearchValue={setNewSearchValue}
              search = {search}
            />
         
          </div>
        </div>
      </div>

  { gridView && (    <div className="overflow-auto mt-6">
        <table className="table table-zebra overflow-x-auto">
          <thead className="border-b-2">
            <tr className="uppercase bg-[#f2f2f2]">
              <th>SL</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Passport</th>
              <th>Created By</th>
              <th>Current Status</th>
              
              
              <th className="text-center">QR</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              candidate?.length > 0 &&
              candidate?.map((item, i) => {
                console.log(item)
                const index = (currentPage - 1) * paginations.per_page + i + 1;
                return (
                  <tr className="whitespace-nowrap" key={i}>
                    <th>{index}</th>
                    <th>
                      <img
                        className="h-[48px] w-[48px] rounded-full"
                        src={item?.candidate?.photo ? `${API_URL}/${item?.candidate?.photo}` : user_img}
                        alt=""
                      />
                    </th>
                    <th>
                      <div className="flex gap-1 items-center">
                        <img src={success_icon} alt="success" />
                        {`${item?.name || item?.candidate?.firstName || ''} ${item?.candidate?.lastName || ''}`}
                      </div>
                    </th>
                    <th>{item?.candidate?.passport || " - "}</th>
                    <th>{ "VHR - LBIBA "  || item?.created_by?.name}</th>
                    <th>{ " Approved " || item?.candidate?.current_status||  item?.candidate?.approval_status  }</th>
                    
                   
                    <th className="flex justify-center">

                      {item?.candidate?.qr_code &&
                      item?.candidate?.approval_status !== "reject" &&
                      item?.candidate?.approval_status !== "pending" ? (
                        <img
                          className="h-[40px] w-[40px] cursor-pointer"
                          src={`${API_URL}/${item?.candidate?.qr_code}`}
                          alt=""
                          onClick={() => handleImageClick(item.id)}
                        />
                      ) : (
                        <img className="h-[40px] w-[40px]" src={`${API_URL}/${item?.candidate?.qr_code}`} alt="" />
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
                            src={item?.candidate?.approval_status === "reject" || item?.candidate?.approval_status === "pending" ? documentUploadet : documentUploadet}
                            alt="file"
                            className="max-w-[20px] max-h-[20px]"
                          />
                        </button>

                      </div>
                    </th>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>)}

      {
        !gridView && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
  {candidate.map((item, i) => (
    <div key={i} className="border p-4 rounded-lg shadow-md flex flex-col items-center">
      {/* Candidate Photo */}
      <img
        className="h-20 w-20 rounded-full"
        src={item?.candidate?.photo ? `${API_URL}/${item?.candidate?.photo}` : user_img}
        alt="Candidate"
      />

      {/* Candidate Name */}
      <h3 className="text-center font-semibold mt-2">{item?.name}</h3>

      {/* Candidate Passport */}
      <p className="text-center text-sm text-gray-500">{item?.candidate?.passport || "N/A"}</p>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2 mt-3">
        <button onClick={() => {setShowBio(true); setUserId(item?.id)}}>
          <img src={veiw_icon} alt="View" className="w-5" />
        </button>
        <button onClick={() =>{ setEditProfile(true); setUserId(item?.id)}}>
          <img src={edit_icon} alt="Edit" className="w-5" />
        </button>
        <button onClick={() => {SetDocumentViewModal(true); setUserId(item?.id)}}>
          <img
            src={
              item?.candidate?.approval_status === "reject" || item?.candidate?.approval_status === "pending"
                ? documentUploadet
                : documentUploadet
            }
            alt="Documents"
            className="w-5"
          />
        </button>
      </div>
    </div>
  ))}
</div>

        )
      }

      {loading && (
        <div className="flex justify-center min-w-full mt-20">
          <TableLoading />
        </div>
      )}


      {!loading && candidate?.length === 0 && (
        <div className="flex justify-center min-w-full mt-20">
          <h4 className="text-black font-bold text-xl">No Data Found!</h4>
        </div>
      )}

      {showBio&& (
        <UserProfileModal modals={showBio} setModals={setShowBio}>
         <Profile_details_Syprus userId = {userId} />
        </UserProfileModal>
      )}


    {editProfile&& (
            <UserProfileModal modals={editProfile} setModals={setEditProfile}>
            <UpdateCadidate ty = 'edit' userId = {userId} />
            </UserProfileModal>
          )}
        

    {documentViewModal&& (
            <UserProfileModal modals={documentViewModal} setModals={SetDocumentViewModal}>
            <DocumentViewSyprus userId = {userId} />
            </UserProfileModal>
          )}




      {!loading && candidate?.length > 0 && paginations?.total > paginations?.per_page && (
        <Pagination paginations={paginations} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
};

export default Cyprus_Candidate_List;
