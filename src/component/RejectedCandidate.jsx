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
      <table className="table table-zebra overflow-x-auto w-full">
  {/* Table Head */}
  <thead className="border-b-2">
    <tr className="uppercase bg-[#f2f2f2] whitespace-nowrap border-2 border-gray-300">
      <th className="border-r-[1px] border-gray-300 px-4 py-2">ID</th>
      <th className="border-r-[1px] border-gray-300 text-center px-4 py-2">Name</th>
      <th className="border-r-[1px] border-gray-300 text-center px-4 py-2" colSpan="2">Passport</th>
      <th className="border-r-[1px] border-gray-300 text-center px-4 py-2" colSpan="2">Reason</th>
    </tr>
  </thead>
  {/* Table Body */}
  <tbody>
    {!loading && data?.length > 0 ? (
      data.map((item, index) => {
        const candidate = item?.data?.data;

        return (
          <tr key={index} className="border-2 border-gray-300 whitespace-nowrap">
            <td className="px-4 py-2">{item?.id}</td>
            <td className="text-center px-4 py-2">{candidate?.name}</td>
            <td className="text-center px-4 py-2" colSpan="2">{candidate?.candidate?.passport}</td>
            <td className="text-center px-4 py-2" colSpan="2">{item?.data?.note}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="6" className="text-center px-4 py-2">
          {loading ? "Loading..." : "No data available"}
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default RejectedCandidate;
