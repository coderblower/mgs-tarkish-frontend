import { useState } from "react";
import { post } from "../api/axios";
const API_URL = import.meta.env.VITE_BASE_URL;
import { Link } from "react-router-dom";
import pdf_icon from "../../public/images/pdfImg.svg";
import docx_icon from "../../public/images/docx_icon.svg";
import visite_icon from "../../public/images/visiteArrow.svg";
import delete_icon from "../../public/images/delete_icon.svg";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
 // Import your delete icon
import "./DocumentCard.css";

const DocumentCard = ({ file, userId, setRefresh}) => {
  const { id, title, url, error, toDelete } = file;
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Function to handle file deletion
  const handleDelete = async () => {
    setLoading(true);
    setDeleteError(""); // Reset any previous errors

    try {
      const response = await post(`/api/candidate/delete_file/${userId}`, 
    {
       file: toDelete 
    });
      console.log(response);
      setRefresh(toDelete);
      // Handle the response data as needed
      // Optionally, you can also trigger a state update to reflect the deletion in the UI
    } catch (error) {
      console.error("Error deleting file:", error);
      setDeleteError("Failed to delete file."); // Set error message if the request fails
    } finally {
      setLoading(false);
    }
  };

  const handleImgTypeCheck = (file) => {
    if (!file) {
      return;
    }
    const extension = file.split(".").pop().toLowerCase();
    return extension;
  };

  const type = handleImgTypeCheck(url);

  const chaeckIfImages = (type) => {
    let acceptedFormats = ['jpe', 'jpeg', 'jpg', 'pjpg', 'jfif', 'jfif-tbnl', 'jif', 'png'];
    return acceptedFormats.includes(type);
  };

  const checkIfPdf = (type) => {
    let acceptedFormats = ['pdf'];
    return acceptedFormats.includes(type);
  };

  return (
    <div className="documentCard_container border h-[400px] rounded-md relative overflow-hidden transition-all shadow-md">
      {/* Delete Icon */}
      <div className="absolute top-2 right-2 z-10"> {/* Add z-index to ensure it’s on top */}
  <img
    src={delete_icon}
    alt="Delete"
    className="w-[24px] h-[24px] cursor-pointer"
    onClick={handleDelete} // Call the delete handler on click
    style={{ pointerEvents: 'auto' }} // Ensure pointer events are enabled
  />
</div>


      {/* Image div */}
      <div className="image_div w-full h-full">
        {url ? (
          checkIfPdf(type) || !chaeckIfImages(type) ? (
            <img className="h-[200px] w-full mt-[40px]" src={checkIfPdf(type) ? pdf_icon : docx_icon} />
          ) : (
            <img className="h-full w-full rounded-md" src={`${API_URL}/${url}`} />
          )
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <h2 className="text-red-500 text-[20px]">{error}</h2>
          </div>
        )}
      </div>

      {/* Card title div */}
      <div className="bg-[#1e3767] absolute top-[15px] left-0 rounded-r-full py-[8px] px-[13px]">
        <h2 className="text-[18px] font-[500] text-white">{title}</h2>
      </div>

      {/* Details button div */}
      {url && (
        <div className="details_btn absolute -bottom-[400px] h-[330px] bg-[#1e3767] w-full text-white flex justify-center rounded-full">
          <Link to={`${API_URL}/${url}`} target="_blank">
            <div className="h-[50px] flex items-center gap-2 mt-[30px]">
              <h2 className="text-[18px] font-[500]">{title}</h2>
              <img
                className="w-[20px] -rotate-[50deg] -mt-[6px]"
                src={visite_icon}
                alt=""
              />
            </div>
          </Link>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">Loading...</div>}
      {/* Error Message */}
      {deleteError && <div className="absolute bottom-2 left-2 text-red-500">{deleteError}</div>}
    </div>
  );
};

export default DocumentCard;
