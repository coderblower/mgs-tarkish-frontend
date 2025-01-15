import { Outlet } from "react-router-dom";
import CyprusNavber from "../component/CyprusNavber";
import ProfileMenu from "../component/ProfileMenu/ProfileMenu";
import menu_icon from "../../public/images/menu_1.svg";
import { useState } from "react";

const Cypras_Panel = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const listItems = [
    {
      path: "/cyprus_admin",
      name: "Dashboard",
      disabled: false
    },
    {
      path: "/admin/partner",
      name: "Partner Registration",
      disabled: true
    },

    {
      path: "/admin/training_list",
      name: "Training center list",
      disabled: true,

    },
    {
      path: "/admin/medical_list",
      name: "Medical center list",
      disabled: true
    },
    {
      path: "/admin/Candidate_Registration_from",
      name: "Candidate Registration",
      disabled: true
    },
    {
      path: "/cyprus_admin/candidate_list",
      name: "Candidate List",
      disabled: false
    },
    {
      path: "/admin/requested_Candidate",
      name: "Requested Candidate",
      disabled: true
    },
  ];

  return (
    <div className="relative lg:flex lg:p-0 p-2">
      <div className={`w-[300px] fixed top-0 left-0 lg:block hidden `}>
        <CyprusNavber
          admin="Settings"
          listItems={listItems}
          show_report={true}
          report_path="cyprus_admin"
          navList="/cyprus_admin"
        />
      </div>

      {/* Mobile menu  */}
      <div
        className={`w-[300px] fixed top-0 z-10 ${
          menuOpen ? " left-0" : "-left-[300px]"
        } lg:hidden `}
      >
        <CyprusNavber
          admin="Settings"
          listItems={listItems}
          setMenuOpen={setMenuOpen}
          menuOpen={menuOpen}
          navList=""
        />
      </div>

      {/* Main contant */}
      <div className=" lg:ml-[300px] w-full lg:px-[80px] pb-[50px] overflow-hidden">
        <div className="flex items-center justify-between lg:justify-end lg:mt-10">
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
            <img src={menu_icon} alt="" />
          </button>
          <ProfileMenu />
        </div>
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Cypras_Panel;
