import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { post } from "../../api/axios";
import TableLoading from "../../component/TableLoading";
import Pagination from "../../component/Pagination";





const RequestedCandidate = () => {
  const [paginations, setPaginations] = useState({
    per_page: 10,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [count, setCount ] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [country, setCountry] = useState(null);
  const [agent, setAgent] = useState(null);
  
  const [agentSubmenu, setAgentSubmenu] = useState([]);

  useEffect(() => {
    fetchAgentSubmenu();
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





 
  useEffect(() => {
    setCurrentPage(1);
    
  }, [country, agent]);

 
  useEffect(() => {
    handleGetAllCandidate();
    
  }, [currentPage,country, agent]);

  const handleGetAllCandidate = async () => {
    setLoading(true);
    try {
      
      const res = await post(`/api/candidate/all?page=${currentPage}`, {
        pg: "10",
        approval_status: "pending",
        country: parseInt(country) || "",
        agent
      });
      


      console.log(res);

      setData(res?.data?.data);
      setCount(res?.count|| res?.data?.total)

      


      setPaginations({
        per_page: res?.data?.per_page || 10,
        total: res?.data?.total || 0,
      });


    } catch (error) {
      setLoading(false);
      console.log("Error creating app:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:mt-10 mt-2">
      {/* Partner Registration filter */}
      <div className="flex items-center  justify-between mt-8">
        <h2 className="font-bold text-[24px] ">
          Requested Candidate ({count})
        </h2>
      </div>

      <div className="lg:flex justify-center items-center ">
       
       <div className="lg:flex block gap-4 mt-6 lg:mt-0 mb-4">
         <div className="flex gap-4 ">
      

           <select
             value={country}
             onChange={(e) => setCountry(e.target.value)}
             className="px-4 py-1 border-2 rounded-md outline-none"
           >
             <option value="">--select--</option>
             <option value="2">Turkey</option>
             <option value="1">Russia</option>
             <option value="3">Hungary</option>
           </select>

           <select
             value={agent}
             onChange={(e) => setAgent(e.target.value)}
             className="px-4 py-1 border-2 rounded-md outline-none"
           >
             <option value="">Agent List</option>
             {agentSubmenu.map((x) => (
               <option key={x.id} value={x.name}> {/* Assuming each agent has a unique `id` */}
                 {x.name}
               </option>
             ))}
           </select>
        


     
         </div>
         <div className="flex gap-4 mt-6 lg:mt-0 w-[400px]">
       
           <button
             onClick={()=>handleCSVData()}
           >
             Export  CSV 
           </button>
         </div>
       </div>
     </div>
      
    

      {/* table  */}
      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra">
          {/* head */}
          <thead className="bg-[#EEE]">
            <tr className="uppercase">
              <th>ID</th>
              <th>Name</th>
              <th>Passport</th>
              <th>Created By</th>
              <th>Register date</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          {/* Todo */}
          <tbody>
            {!loading &&
              data?.length > 0 &&
              data?.map((item, i) => {
                const index = (currentPage - 1) * paginations.per_page + i + 1;
               return  (
                
                <tr key={index}>
                  <td>{index}</td>
                  <td>{item?.name}</td>
                  <th className="whitespace-nowrap">
                    {item?.candidate?.passport || "Null"}
                  </th>
                  <th>{item?.created_by?.name}</th>
                  <th>{item?.created_at.slice(0, 10)}</th>

                  <td>{item?.candidate?.approval_status}</td>
                  <td className="text-center">
                    <Link to={`/admin/document_view/${item?.id}`}>
                      <button
                        // onClick={handlePrint}
                        className="py-3 px-6 bg-[#1E3767] text-white font-bold rounded-md transition-transform active:scale-95"
                      >
                        <h2 className="whitespace-nowrap">Document View </h2>
                      </button>
                    </Link>
                  </td>
                </tr>
              )})}
          </tbody>
        </table>
      </div>

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
          {!loading && data?.length > 0 && paginations?.total > paginations?.per_page && (
        <Pagination paginations={paginations} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}

      {/* pagition  */}
      {/* <div className="flex mt-10 items-center justify-center mb-10">
        <div className="flex">
          <div className="px-4 py-3 border-2 bg-[#EEE] rounded-tl-md rounded-bl-md">
            1
          </div>
          <div className="px-4 py-3 border-2">2</div>
          <div className="px-4 py-3 border-2">3</div>
          <div className="px-4 py-3 border-2">...</div>
          <div className="px-4 py-3 border-2">6</div>
          <div className="px-4 py-3 border-2 rounded-tr-md rounded-br-md">
            7
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RequestedCandidate;
