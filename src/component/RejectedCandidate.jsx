import React, { useEffect, useState } from "react";
import { post } from "../api/axios";
import Loading from "./Loading";

const RejectedCandidate = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgent();
  }, []);

  const fetchAgent = async () => {
    setLoading(true);
    try {
      const response = await post("api/notification/get_notification");
      console.log(response);
      setData(response?.notifications);
      console.log(response?.notifications, data);
    } catch (error) {
      console.log("Error creating app:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(data);

  let num = 12.3456;
  return (
    <div className="lg:mt-10 mt-2">
      <h2 className="font-bold text-[24px] ">Rejected Candidate </h2>
      <div className="overflow-auto mt-6">
        <table className="table table-zebra  overflow-x-auto">
          {/* head */}
          <thead className=" border-b-2">
            <tr className="uppercase bg-[#f2f2f2] whitespace-nowrap border-2 border-gray-300">
              <th className="border-r-[1px] border-gray-300">ID</th>
              <th className="border-r-[1px] border-gray-300 text-center">
                Name
              </th>
             
              <th
                className="border-r-[1px] border-gray-300 text-center"
                colspan="2" >
                  Passport 
                </th>

                <th
                className="border-r-[1px] border-gray-300 text-center"
                colspan="2" >
                  Reason 
                </th>

            </tr>
          </thead>
          <tbody>
            {!loading &&
              data?.length > 0 &&
              data?.map((item) => {
                let candidate = item?.data?.data; 
                console.log(candidate?.candidate?.passport);
                
                return (
                  <tr className="border-2 border-gray-300 whitespace-nowrap">
                    <td>
                      {item?.id}
                    </td>
                    <td className="text-center">
                      {candidate?.name}
                    </td>
                    <td className="text-center">
                      {candidate?.candidate?.passport}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectedCandidate;
