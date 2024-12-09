import right_arow from "../../../public/images/right_arow.svg";
import { useEffect, useState } from "react";
import FileUplod from "../FileUplod";

const Registration_3 = ({
  setPage,
  next,
  academic,
  setAcademic,
  pre,
  academic_file,
  setAcademic_file,
  country,
  page,
  setFormArray_new
}) => {


  console.log(country, academic); 


  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState({});
  

  useEffect(()=>{
    (country = 3 && ['HSC', 'SSC', 'BBA', 'MBA', 'DIPLOMA'].some((x)=>{
      console.log(x, academic?.level_of_education, (academic?.level_of_education || '').toUpperCase());
       if( (academic?.level_of_education || '').toUpperCase() == x ){
          console.log('passed');
        setAcademic({
          ...academic,
          level_of_education: x,
        })
        return true;
      }
    })) || setAcademic({
      ...academic,
      level_of_education: null,
    })
  },[])

  const updatePageAccordingClick = (page, setFormArray_new) => {
    setFormArray_new(previousData =>
      previousData.map(item =>
        item.title === page ? { ...item, show: true } : item
      )
    );
  };
  
  const handleNextPage = () => {
    const newFormError = {};
    // Validation for required fields
    
    if ( (country == 3) && !academic?.level_of_education) {
      console.log(newFormError)
      newFormError.level_of_education = "Minimum SSC  is required";
      console.log(newFormError)
    }
    
    if ( (country == 3) && !academic_file) {
      console.log('fired ')
      newFormError.academic_file = "Please Provide Education Certificate  ";
      
    }

    setFormError(newFormError);
    console.log(formError, newFormError, academic_file, country);
    // Proceed only if there are no errors
    if (Object.keys(newFormError).length === 0) {
      setUploadError("");
      setPage("Job Experience");
      next();
      updatePageAccordingClick("Job Experience", setFormArray_new);
    }
  };

  return (
    <div className="lg:mb-10">
      <div className="bg-[#D9D9D9] rounded-md lg:px-[100px] px-[10px] lg:py-[75px] py-[40px]">
        <h3 className="text-[20px] font-bold mb-5">Academic-1</h3>
        <form>
          <div className="lg:flex gap-5">
            <div className="lg:w-1/2">
              <label>
                <p className="text-[17px] font-[500] mb-2">Level of Education</p>
                {(country == 3) && (
                  <select
                    className="px-2 p-[8px] w-full mb-5 rounded-md outline-none"
                    onChange={(e) =>
                      setAcademic({
                        ...academic,
                        level_of_education: e.target.value,
                      })
                    }
                    value={academic?.level_of_education}
                  >
                    <option value="">Select Education Level</option>
                    <option value="SSC">SSC</option>
                    <option value="HSC">HSC</option>
                    <option value="BBA">BA/ BBA/ BSc/ BEng</option>
                    <option value="MBA">MA/ MSc/ MBA</option>
                    <option value="DIPLOMA">DIPLOMA </option>
                    {/* Add more options as needed */}
                  </select>
                ) || (
                  <input
                    className="px-2 p-[8px] w-full mb-5 rounded-md outline-none"
                    type="text"
                    name="name"
                    onChange={(e) =>
                      setAcademic({
                        ...academic,
                        level_of_education: e.target.value,
                      })
                    }
                    value={academic?.level_of_education}
                  />
                )}
                {formError.level_of_education && (
                  <p className="text-red-500 text-sm">{formError.level_of_education}</p>
                )}
              </label>
              {/* Institute Name */}
              <label>
                <p className="text-[17px] font-[500] mb-2">Institute Name</p>
                <input
                  className="px-2 p-[8px] w-full mb-5 rounded-md outline-none"
                  type="text"
                  name="institute_name"
                  onChange={(e) =>
                    setAcademic({
                      ...academic,
                      institute_name: e.target.value,
                    })
                  }
                  value={academic?.institute_name}
                />
                {formError.institute_name && (
                  <p className="text-red-500 text-sm">{formError.institute_name}</p>
                )}
              </label>
              {/* Result */}
              <label>
                <p className="text-[17px] font-[500] mb-2">Result</p>
                <input
                  className="px-2 p-[8px] w-full mb-5 rounded-md outline-none"
                  type="text"
                  name="result"
                  onChange={(e) =>
                    setAcademic({
                      ...academic,
                      result: e.target.value,
                    })
                  }
                  value={academic?.result}
                />
                {formError.result && (
                  <p className="text-red-500 text-sm">{formError.result}</p>
                )}
              </label>
            </div>
            <div className="lg:w-1/2">
              {/* Exam Degree Title */}
              <label>
                <p className="text-[17px] font-[500] mb-2">Exam/Degree Title</p>
                <input
                  className="px-2 p-[8px] w-full mb-5 rounded-md outline-none"
                  type="text"
                  name="exam_degree_title"
                  onChange={(e) =>
                    setAcademic({
                      ...academic,
                      exam_degree_title: e.target.value,
                    })
                  }
                  value={academic?.exam_degree_title}
                />
                {formError.exam_degree_title && (
                  <p className="text-red-500 text-sm">{formError.exam_degree_title}</p>
                )}
              </label>
              {/* Major/Group */}
              <label>
                <p className="text-[17px] font-[500] mb-2">Concentration/Major/Group</p>
                <input
                  className="px-2 p-[8px] w-full mb-5 rounded-md outline-none"
                  type="text"
                  name="concentration_major"
                  onChange={(e) =>
                    setAcademic({
                      ...academic,
                      concentration_major: e.target.value,
                    })
                  }
                  value={academic?.concentration_major}
                />
                {formError.concentration_major && (
                  <p className="text-red-500 text-sm">{formError.concentration_major}</p>
                )}
              </label>
              {/* Year of Passing */}
              <label>
                <p className="text-[17px] font-[500] mb-2">Year of Passing</p>
                <input
                  className="px-2 p-[8px] w-full mb-5 rounded-md outline-none"
                  type="text"
                  name="year_of_passing"
                  onChange={(e) =>
                    setAcademic({
                      ...academic,
                      year_of_passing: e.target.value,
                    })
                  }
                  value={academic?.year_of_passing}
                />
                {formError.year_of_passing && (
                  <p className="text-red-500 text-sm">{formError.year_of_passing}</p>
                )}
              </label>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-4 w-full rounded-[8px] outline-none border-2 bg-white mt-4">
          <div className="w-[90px] bg-[#1e3767] rounded-l-[8px]">
            <FileUplod setFile={setAcademic_file} />
          </div>
          <h2>
            {(academic_file && academic_file?.name) ||
              academic_file?.slice(27, academic_file?.length)}
          </h2>
        </div>
        {uploadError && (
          <p className="text-red-500 text-sm mt-1">{uploadError}</p>
        )}
        {formError.academic_file && (
                  <p className="text-red-500 text-sm">{formError.academic_file }</p>
                )}
      </div>

      <div className="flex gap-4 items-center justify-end">
        <button
          onClick={() => {
            setPage("Job Experience");
            next();
            updatePageAccordingClick("Job Experience", setFormArray_new);
          }}
          className="py-[12px] lg:px-[40px] px-[30px] transition-transform active:scale-95 bg-[#1E3767] text-white font-bold rounded-md mt-5 flex gap-2"
          type="button"
        >
          Skip
        </button>
        <button
          onClick={() => {
            setPage("Address");
            pre();
          }}
          className="py-[12px] lg:px-[40px] px-[30px] transition-transform active:scale-95 bg-[#1E3767] text-white font-bold rounded-md mt-5 flex gap-2"
          type="button"
        >
          <img src={right_arow} className="rotate-180" /> Back
        </button>

        <button
          onClick={handleNextPage}
          className="py-[12px] lg:px-[40px] px-[30px] transition-transform active:scale-95 bg-[#1E3767] text-white font-bold rounded-md mt-5 flex gap-2"
          type="button"
        >
          Next <img src={right_arow} />
        </button>
      </div>
    </div>
  );
};

export default Registration_3;
