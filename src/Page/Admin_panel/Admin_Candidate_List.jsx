import { useEffect, useState } from "react";
import { post } from "../../api/axios";
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
const API_URL = import.meta.env.VITE_BASE_URL;

const Admin_Candidate_List = () => {
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
  const [countryResult, setCountryResult] = useState("");
  const [cachedCandidates, setCachedCandidates] = useState({}); 

  useEffect(() => {
    if (cachedCandidates[currentPage]) {
      // Load from cache if data for the current page is already preloaded
      setCandidate(cachedCandidates[currentPage]);
    } else {
      // Fetch data for the current page if not cached
      fetchCandidate(search, currentPage);
    }
    preloadCandidates(); // Preload next pages
  }, [currentPage, search, countryResult]);

  const fetchCandidate = async (search, page) => {
    setLoading(true);
    try {
      const res = await post(`/api/user/search_candidate?page=${page}`, {
        pg: "a",
        phone: search,
        country: parseInt(countryResult) || "",
      });
      const data = res?.data?.data || [];
  
      // Store the fetched data in the cache for the current page
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
    for (let i = 1; i <= 2; i++) {
      const prevPage = currentPage-i;
      const nextPage = currentPage + i;

      
      if (cachedCandidates[nextPage]) continue; // Skip if data for this page is already cached
  
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const res = await post(`/api/user/search_candidate?page=${nextPage}`, {
          pg: "a",
          phone: search,
          country: parseInt(countryResult) || "",
        });
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
      const res = await post(`/api/candidate/all`, { pg: "" });
      if (res?.data) {
        setAllCandidate(res.data);
      }
    } catch (error) {
      console.log("Error fetching CSV data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:mt-10 mt-2">
      <div className="lg:flex justify-between items-center ">
        <h2 className="font-bold text-[24px] ">
          Candidates ({paginations?.total})
        </h2>
        <div className="lg:flex block gap-4 mt-6 lg:mt-0">
          <div className="flex gap-4">
            <select
              value={countryResult}
              onChange={(e) => setCountryResult(e.target.value)}
              className="px-4 py-1 border-2 rounded-md outline-none"
            >
              <option value="">--select--</option>
              <option value="2">Turkey</option>
              <option value="1">Russia</option>
            </select>

            <select className="px-4 py-1 border-2 rounded-md outline-none">
              <option value="grapefruit">Agent Center</option>
              <option value="lime">Training Center</option>
              <option value="mango">Medical Center</option>
            </select>
          </div>
          <div className="flex gap-4 mt-6 lg:mt-0">
            <SearchInput
              placeholder="Search Candidates"
              search={search}
              setSearch={setSearch}
              newSearchValue={newSearchValue}
              setNewSearchValue={setNewSearchValue}
            />
            {csv_data?.length > 0 && (
              <div className="mt-2">
                <CSVBtn data={csv_data} filename={"Candidates List"} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-auto mt-6">
        <table className="table table-zebra overflow-x-auto">
          <thead className="border-b-2">
            <tr className="uppercase bg-[#f2f2f2]">
              <th>ID</th>
              <th>Name</th>
              <th>Passport</th>
              <th>Created By</th>
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
                  <tr className="whitespace-nowrap" key={i}>
                    <th>{index}</th>
                    <th>
                      <div className="flex gap-1 items-center">
                        {item?.candidate?.photo && item?.candidate?.passport_file && item?.candidate?.nid_file && item?.candidate?.training_file && (
                          <img src={success_icon} alt="success" />
                        )}
                        {item?.name}
                      </div>
                    </th>
                    <th>{item?.candidate?.passport || "Null"}</th>
                    <th>{item?.created_by?.name}</th>
                    <th>{item?.phone}</th>
                    <th>{item?.candidate?.approval_status}</th>
                    <th>
                      <img
                        className="h-[48px] w-[48px] rounded-full"
                        src={item?.candidate?.photo ? `${API_URL}/${item?.candidate?.photo}` : user_img}
                        alt=""
                      />
                    </th>
                    <th className="flex justify-center">
                      {item?.candidate?.qr_code &&
                      item?.candidate?.approval_status !== "reject" &&
                      item?.candidate?.approval_status !== "pending" ? (
                        <img
                          className="h-[40px] w-[40px]"
                          src={`${API_URL}/${item?.candidate?.qr_code}`}
                          alt=""
                        />
                      ) : (
                        <img className="h-[40px] w-[40px]" src={notQR_img} alt="" />
                      )}
                    </th>
                    <th>
                      <div className="flex items-center justify-between gap-3">
                        <Link to={`/admin/user_profile/${item.id}`}>
                          <img src={veiw_icon} alt="" className="w-5" />
                        </Link>
                        <Link to={`/admin/user_update/${item.id}`}>
                          <img src={edit_icon} alt="" className="w-5" />
                        </Link>
                        <NavLink to={`/admin/document_view/${item?.id}`}>
                          <img
                            src={item?.candidate?.approval_status === "reject" || item?.candidate?.approval_status === "pending" ? documentNotUploadet : documentUploadet}
                            alt="file"
                            className="max-w-[20px] max-h-[20px]"
                          />
                        </NavLink>
                      </div>
                    </th>
                  </tr>
                );
              })}
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
          <h4 className="text-black font-bold text-xl">No Data Found!</h4>
        </div>
      )}

      {!loading && candidate?.length > 0 && paginations?.total > paginations?.per_page && (
        <Pagination paginations={paginations} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
};

export default Admin_Candidate_List;
