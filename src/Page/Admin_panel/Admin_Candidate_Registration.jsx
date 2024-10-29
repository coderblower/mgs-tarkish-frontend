import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { post } from "../../api/axios";
import Registration_2 from "../../component/Registration/Registration_2";
import Registration_3 from "../../component/Registration/Registration_3";
import Registration_4 from "../../component/Registration/Registration_4";
import Registration_5 from "../../component/Registration/Registration_5";
import Registration_6 from "../../component/Registration/Registration_6";
import Registration_7 from "../../component/Registration/Success";
import Registration from "../../component/Registration/Registration";
import Success from "../../component/Registration/Success";
import PersonalInformation from "../../component/Registration/PersonalInformation";

const Admin_Candidate_Registration = () => {
  const [religion, setReligion] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [dateOfIssue, setDateOfIssue] = useState("");
  const [visitRussiaNumber, setVisitRussiaNumber] = useState("");
  const [russia_trip_date, setRussia_trip_date] = useState("");
  const [hostOrganization, setHostOrganization] = useState("");
  const [route_Journey, setRoute_Journey] = useState("");
  const [relativesStaying, setRelativesStaying] = useState("");
  const [refusedRussian, setRefusedRussian] = useState("");
  const [deportedRussia, setDeportedRussia] = useState("");
  const [spousesName, setSpousesName] = useState("");
  const [spouses_birth_date, setSpouses_birth_date] = useState("");

  const [fathersName, setFathersName] = useState("");
  const [marital_status, setMarital_status] = useState("");
  const [gender, setGender] = useState("");
  const [nid, setNid] = useState("");
  const [country, setCountry] = useState("");
  const [passport, setPassport] = useState("");
  const [mothersName, setMothersName] = useState("");
  const [birth_date, setBirth_date] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expireDate, setExpireDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [medical, setMedical] = useState("");
  const [medicalList, setMedicalList] = useState([]);
  const [designation_id, setDesignation_id] = useState("");
  const [passport_file, setPassport_file] = useState(null);
  const [academic_file, setAcademic_file] = useState(null);
  const [experience_file, setExperience_file] = useState(null);
  const [training_file, setTraining_file] = useState(null);
  const [nid_file, setNid_file] = useState(null);
  const [pif_file, setPif_file] = useState(null);
  const [referred_by, setreferenceBy] = useState("");

  

  const [academic, setAcademic] = useState({
    level_of_education: "",
    institute_name: "",
    result: "",
    exam_degree_title: "",
    year_of_passing: "",
    concentration_major: "",
  });
  const [experience, setExperience] = useState({
    company_name: "",
    company_business: "",
    designation: "",
    department: "",
    employment_period_from: "",
    employment_period_to: "",
    company_location: "",
    total_year_of_experience: "",
  });
  const [training, setTraining] = useState({
    training_title: "",
    country: "",
    topics_covered: "",
    training_year: "",
    institute: "",
    duration: "",
  });
  const [address, setAddress] = useState({
    country: "",
    city: "",
    post_code: "",
    post_office: "",
    street_address: "",
    address: "",
    permanent_address: "",
    present_address: "",
  });

  const formArray = [1, 2, 3, 4, 5, 6];

  const [formArray_new, setFormArray_new] = useState([
    { id: 1, title: "Personal Information", show:false },
    { id: 2, title: "Address", show:false },
    { id: 3, title: "Education", show: false },
    { id: 4, title: "Job Experience", show: false },
    { id: 5, title: "Training & skills", show: false },
    { id: 6, title: "Upload photo", show: false },
  ]);

  const [formNo, setFormNo] = useState(formArray[0]);
  const [page, setPage] = useState("Registration");
  // const [fullName, setFullName] = useState(firstName + "" + lastName);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVisitOpen, setIsVisitOpen] = useState();
  const [relativeStaying, setRelativeStaying] = useState();

  const handleSubmit = async () => {
    const payload = {
      name: firstName + " " + lastName,
      fullName: firstName + " " + lastName,
      firstName,
      lastName,
      expiry_date: expireDate,
      email,
      issued_by:
        country === "1" &&
        "Department of Immigration & Passports of the Ministry of Home Affairs",
      dateOfIssue,
      visitRussiaNumber,
      russia_trip_date,
      hostOrganization,
      route_Journey,
      relativesStaying,
      refusedRussian,
      deportedRussia,
      spousesName,
      spouses_birth_date,
      phone,
      password,
      gender: gender,
      marital_status: marital_status,
      religion: religion,
      nid,
      passport,
      father_name: fathersName,
      mother_name: mothersName,
      birth_date,
      country,
      is_active: 1,
      address,
      city: "Dhaka",
      academic,
      experience,
      training,
      photo,
      training_status: true,
      medical_status: true,
      medical_center_id: medical,
      designation_id,
      passport_file,
      academic_file,
      experience_file,
      training_file,
      nid_file,
      pif_file,
      referred_by,
    };
    console.log("========>160", payload);
    setLoading(true);

    try {
      const res = await post("api/user/create", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.message?.phone) {
        toast.error(res?.message?.phone[0]);
      }
      if (res?.message?.email) {
        toast.error(res?.message?.email[0]);
      }
      if (res?.message?.password) {
        toast.error(res?.message?.password[0]);
      }
      if (res?.message?.name) {
        toast.error(res?.message?.name[0]);
      }

      if (res?.success) {
        setPage("success");
        toast.success(res.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Failed to post/======>182", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedical();
  }, []);

  const fetchMedical = async () => {
    try {
      const res = await post(`api/user/group_by`, {
        role_id: 3,
      });
      if (res.success) {
        setMedicalList(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const next = () => {
    if (formNo === 1) {
      setFormNo(formNo + 1);
    } else if (formNo === 2) {
      setFormNo(formNo + 1);
    } else if (formNo === 3) {
      setFormNo(formNo + 1);
    } else if (formNo === 4) {
      setFormNo(formNo + 1);
    } else if (formNo === 5) {
      setFormNo(formNo + 1);
    } else if (formNo === 6) {
      setFormNo(formNo + 1);
    } else {
      toast.error("Please fillup all input field");
    }
  };
  const pre = () => {
    setFormNo(formNo - 1);
  };

  // console.log(country);

  return (
    <div className="mt-[38px]">
      <div>
        {page === "Registration" || page === "success" ? null : (
          <div>
            <div className="whitespace-nowrap lg:px-10 ">
              <div className="flex justify-center items-center mb-10">
                {formArray_new.map((v, i) => (
                  <>
                    <div
                      key={i} onClick={() => {
                        
                       if(v.show){
                        setPage(v.title);
                        setFormNo(i + 1);
                       }
        }}
                      className={`${v.show?'cursor-pointer':''} w-[35px] my-3 text-black rounded-full relative text-sm ${
                        i <= formNo - 1 ? "bg-[#1E3767]" : "bg-[#D9D9D9]"
                      } h-[35px] flex justify-center items-center`}
                    >
                      <span
                        className={`absolute -top-10 text font-[500] hidden lg:block ${
                          i <= formNo - 1 ? "text-black" : "text-black/70"
                        }`}
                      >
                        {v.title}
                      </span>
                      <span  className="text-white "> {v.id}</span>
                    </div>

                    {i !== formArray_new.length - 1 && (
                      <div
                        className={`flex-1 h-[4px] ${
                          i + 1 <= formNo - 1 ? "bg-[#1E3767]" : "bg-[#D9D9D9]"
                        }`}
                      ></div>
                    )}
                  </>
                ))}
              </div>
            </div>

            <h3 className="text-[24px] font-[500]  mb-[27px]">
              Please Fill up your information
            </h3>
          </div>
        )}
        {/* Registion from */}

        {page === "Registration" ? (
          <Registration
            setPage={setPage}
            setEmail={setEmail}
            setPhone={setPhone}
            setPassword={setPassword}
            // setFullName={setFullName}
            setPhoneNumber={setPhoneNumber}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            formArray_new = {formArray}
            page = {page}
            
          />
        ) : page === "Personal Information" ? (
          <PersonalInformation
            setPage={setPage}
            next={next}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            // fullName={fullName}
            // setFullName={setFullName}
            firstName={firstName}
            setFirstName={setFirstName}
            
            lastName={lastName}
            setLastName={setLastName}
            dateOfIssue={dateOfIssue}
            setDateOfIssue={setDateOfIssue}
            visitRussiaNumber={visitRussiaNumber}
            setVisitRussiaNumber={setVisitRussiaNumber}
            russia_trip_date={russia_trip_date}
            setRussia_trip_date={setRussia_trip_date}
            hostOrganization={hostOrganization}
            setHostOrganization={setHostOrganization}
            route_Journey={route_Journey}
            setRoute_Journey={setRoute_Journey}
            relativesStaying={relativesStaying}
            setRelativesStaying={setRelativesStaying}
            refusedRussian={refusedRussian}
            setRefusedRussian={setRefusedRussian}
            deportedRussia={deportedRussia}
            setDeportedRussia={setDeportedRussia}
            religion={religion}
            setReligion={setReligion}
            fathersName={fathersName}
            setFathersName={setFathersName}
            marital_status={marital_status}
            setMarital_status={setMarital_status}
            spousesName={spousesName}
            setSpousesName={setSpousesName}
            spouses_birth_date={spouses_birth_date}
            setSpouses_birth_date={setSpouses_birth_date}
            gender={gender}
            setGender={setGender}
            nid={nid}
            setNid={setNid}
            country={country}
            setCountry={setCountry}
            passport={passport}
            setPassport={setPassport}
            mothersName={mothersName}
            setMothersName={setMothersName}
            birth_date={birth_date}
            setBirth_date={setBirth_date}
            medical={medical}
            setMedical={setMedical}
            designation_id={designation_id}
            setDesignation_id={setDesignation_id}
            passport_file={passport_file}
            setPassport_file={setPassport_file}
            expireDate={expireDate}
            setExpireDate={setExpireDate}
            nid_file={nid_file}
            setNid_file={setNid_file}
            pif_file={pif_file}
            setPif_file={setPif_file}
            referred_by={referred_by}
            setreferenceBy={setreferenceBy}
            isVisitOpen={isVisitOpen}
            setIsVisitOpen={setIsVisitOpen}
            relativeStaying={relativeStaying}
            setRelativeStaying={setRelativeStaying}
            page = {page}
            setFormArray_new = {setFormArray_new}
            formArray_new = {formArray_new}
          />
        ) : page === "Address" ? (
          <Registration_2
            next={next}
            pre={pre}
            setPage={setPage}
            country={country}
            address={address}
            setAddress={setAddress}
            setFormArray_new= {setFormArray_new}
            page = {page}
            formArray_new = {formArray_new}
          />
        ) : page === "Education" ? (
          <Registration_3
            setPage={setPage}
            next={next}
            pre={pre}
            academic={academic}

            setAcademic={setAcademic}
            academic_file={academic_file}
            setAcademic_file={setAcademic_file}
            country = {country}
            setFormArray_new = {setFormArray_new}
            page = {page}
            formArray_new = {formArray_new}
            
          />
        ) : page === "Job Experience" ? (
          <Registration_4
            setPage={setPage}
            next={next}
            pre={pre}
            experience={experience}
            setExperience={setExperience}
            experience_file={experience_file}
            setExperience_file={setExperience_file}
            setFormArray_new  = {setFormArray_new}
            page = {page}
            formArray_new = {formArray_new}
          />
        ) : page === "Training & skills" ? (
          <Registration_5
            setPage={setPage}
            next={next}
            pre={pre}
            training={training}
            setTraining={setTraining}
            training_file={training_file}
            setTraining_file={setTraining_file}
            setFormArray_new = {setFormArray_new}
            page = {page}
            formArray_new = {formArray_new}
          />
        ) : page === "Upload photo" ? (
          <Registration_6
            setPage={setPage}
            next={next}
            pre={pre}
            photo={photo}
            setPhoto={setPhoto}
            handleSubmit={handleSubmit}
            loading={loading}
            page = {page}
            formArray_new  = {formArray_new}
          />
        ) : page === "logout" ? (
          <Registration_7 setPage={setPage} />
        ) : page === "success" ? (
          <Success navList="/admin" />
        ) : null}
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Admin_Candidate_Registration;
