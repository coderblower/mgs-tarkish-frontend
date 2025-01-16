import download_img from "../../../public/images/download.svg";
import user_icon from "../../../public/images/bottom_arrow.svg";
import cheart_img from "../../assets/chart.png";
import pan_img from "../../../public/images/pan.svg";
import check_img from "../../../public/images/check.svg";
import success3_img from "../../../public/images/success_3.svg";
import user_img from "../../../public/images/Avater.png";
import { useEffect, useState } from "react";
import { post } from "../../api/axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BASE_URL;

const Cyprus_Dashboard = () => {
  // get count data
  const navigate = useNavigate();
  const [count, setCount] = useState([]);

  useEffect(() => {
    post(`/api/user/count`)
      .then((res) => setCount(res.data))
      .catch((err) => console.log(err));
  }, []);
  // console.log(count?.registered);

  // Get  Registered Candidates data
  const [data, setData] = useState([]);
  const { training, medical, candidate, agent } = data;
  const id = "four";
  useEffect(() => {
    post(`/api/user/group_by`, { role_id: id })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  console.log(30, candidate?.data);

  return (
    <div>
      <div className="flex items-center justify-between mt-[32px]  mb-[16px]">
        <h2 className="text-[24px] font-[500] text-[#4D4D4D]">Dashboard</h2>
        <button className=" py-[12px] px-[36px] bg-[#1E3767] text-white  rounded-md ">
          <div className="flex gap-4">
            <img src={download_img} alt="" />
            <h3 className="font-[600]">Download PDF</h3>
          </div>
        </button>
      </div>
      {/* Dashboard main contant */}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        <div
          className="py-[34px] px-[34px]  rounded-[12px] bg-[#EEE] cursor-pointer"
          onClick={() => navigate("/cyprus_admin/candidate_list")}
        >
          <p className="font-[500]">Registered Candidates</p>
          <div className="flex items-center justify-between mt-[22px]">
            <h2 className="text-[48px] text-[#1E3767] font-[600] ">
              {count?.candidate}
            </h2>
            <img src={user_icon} alt="" />
          </div>
        </div>

        <div className=" py-[34px] px-[34px] lg:mt-0 mt-[28px] rounded-[12px] bg-[#EEE]">
          <p className="font-[500]">Agent</p>
          <div className="flex items-center justify-between mt-[22px]">
            <h2 className="text-[48px] text-[#1E3767] font-[600] ">
              {count?.agent}
            </h2>
            <img src={pan_img} alt="" />
          </div>
        </div>

        <div className=" py-[34px] px-[34px] rounded-[12px] bg-[#EEE]">
          <p className="font-[500]">Medical Center</p>
          <div className="flex items-center justify-between mt-[22px]">
            <h2 className="text-[48px] text-[#1E3767] font-[600] ">
              {count?.medical}
            </h2>
            <img src={check_img} alt="" />
          </div>
        </div>
        <div className=" py-[34px] px-[34px] lg:mt-0 mt-[28px] rounded-[12px] bg-[#EEE]">
          <p className="font-[500]">Training Center</p>
          <div className="flex items-center justify-between mt-[22px]  ">
            <h2 className="text-[48px] text-[#1E3767] font-[600] ">
              {count?.training}
            </h2>
            <img src={success3_img} alt="" />
          </div>
        </div>
        <div className=" py-[34px] px-[34px] lg:mt-0 mt-[28px] rounded-[12px] bg-[#EEE]">
          <p className="font-[500]">All Document Uploaded</p>
          <div className="flex items-center justify-between mt-[22px]  ">
            <h2 className="text-[48px] text-[#1E3767] font-[600] ">
              {count?.childWithMinFile}
            </h2>
            <img src={success3_img} alt="" />
          </div>
        </div>
      </div>

      <div className="lg:flex gap-[28px] ">
        <div className="lg:w-2/3">
          <div className=" lg:flex  gap-[28px]">
            <div
              className="lg:w-1/2 py-[34px] px-[34px]  rounded-[12px] bg-[#EEE] cursor-pointer"
              onClick={() => navigate("/admin/Candidate_List")}
            >
              <p className="font-[500]">Registered Candidates</p>
              <div className="flex items-center justify-between mt-[22px]">
                <h2 className="text-[48px] text-[#1E3767] font-[600] ">
                  {count?.candidate}
                </h2>
                <img src={user_icon} alt="" />
              </div>
            </div>
            <div className="lg:w-1/2 py-[34px] px-[34px] lg:mt-0 mt-[28px] rounded-[12px] bg-[#EEE]">
              <p className="font-[500]">Agent</p>
              <div className="flex items-center justify-between mt-[22px]">
                <h2 className="text-[48px] text-[#1E3767] font-[600] ">
                  {count?.agent}
                </h2>
                <img src={pan_img} alt="" />
              </div>
            </div>
          </div>
          <div className=" lg:flex  gap-[28px] mt-[28px]">
            <div className="lg:w-1/2 py-[34px] px-[34px] rounded-[12px] bg-[#EEE]">
              <p className="font-[500]">Medical Center</p>
              <div className="flex items-center justify-between mt-[22px]">
                <h2 className="text-[48px] text-[#1E3767] font-[600] ">
                  {count?.medical}
                </h2>
                <img src={check_img} alt="" />
              </div>
            </div>
            <div className="lg:w-1/2 py-[34px] px-[34px] lg:mt-0 mt-[28px] rounded-[12px] bg-[#EEE]">
              <p className="font-[500]">Training Center</p>
              <div className="flex items-center justify-between mt-[22px]  ">
                <h2 className="text-[48px] text-[#1E3767] font-[600] ">
                  {count?.training}
                </h2>
                <img src={success3_img} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 w-full flex justify-center items-center rounded-xl lg:mt-0 mt-[28px] bg-[#EEE]">
          <div>
            <h1 className="text-center text-[22px] font-[600] text-[#4D4D4D] mb-4">
              Completion Rate
            </h1>
            <img className=" w-[220px] rounded-xl" src={cheart_img} alt="" />
          </div>
        </div>
      </div>

      {/* All Candidates  */}
     
    </div>
  );
};

export default Cyprus_Dashboard;
