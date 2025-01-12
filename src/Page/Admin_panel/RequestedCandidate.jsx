import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { post } from "../../api/axios";
import TableLoading from "../../component/TableLoading";
import Pagination from "../../component/Pagination";
import exportImg from "../../../public/images/export.svg";

import removeUser from "../../../public/images/user_cancel.svg";






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


  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await post(`/api/candidate/delete_user/${id}`);
      console.log(res);
      if (res) {
        handleGetAllCandidate();
      }
    } catch (error) {
      setLoading(false);
      console.log("Error creating app:", error);
    } finally {
      setLoading(false);
    }
  }

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



  const handleCSVData = async () => {

    console.log( country, agent )
    setLoading(true);
    try {
    let res =   await post(`/api/candidate/all`, {
        pg: "",
        approval_status: "pending",
        country: parseInt(country) || "",
        agent,
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
             <img src={exportImg} className="w-[20px]" alt="" />
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
                  <td className="text-center flex justify-center gap-2">
                    <Link to={`/admin/document_view/${item?.id}`}>
                      <button
                        className="py-2 px-1  text-white font-bold rounded-md transition-transform active:scale-95"
                      >
                        <img src={exportImg} alt="" className="w-[20px]" />
                      </button>
                    </Link>
                    {/* <button
                        onClick={()=>handleDelete(item?.id)}
                        className="py-2 px-1  text-white font-bold rounded-md transition-transform active:scale-95">
                      
                        <img src={removeUser} alt="" className="w-[20px]" />
                      </button> */}
                   
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
