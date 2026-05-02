import { useEffect, useState } from "react";
import { post } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import TableLoading from "../../component/TableLoading";
import SearchInput from "../../component/SearchInput";
import veiw_icon from "../../../public/images/veiw_ison.svg";
import Pagination from "../../component/Pagination";
import Modal from "../../component/Modal";

const STATIC_BEARER_TOKEN =
  "6521|clJuPOGOTSS0Np4fXr5DFCUOMeoUasjWV4LliOuOc283979f";
const PER_PAGE = 10;

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }
  return String(value);
};

const formatDate = (value) => (value ? value.slice(0, 10) : "N/A");

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-3">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </span>
    <span className="mt-1 text-sm font-medium text-gray-900">{value}</span>
  </div>
);

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const DemandLetterList = () => {
  const navigate = useNavigate();
  const [demandLetters, setDemandLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginations, setPaginations] = useState({
    per_page: "",
    total: "",
  });
  const [search, setSearch] = useState("");
  const [newSearchValue, setNewSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState(null);

  useEffect(() => {
    if (search && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    const fetchDemandLetters = async () => {
      setLoading(true);
      try {
        const res = await post(
          "https://mges.tech/api/resources",
          {
            resource: "SourceAdmin",
            action: "GetDemandLetter",
            search,
            per_page: PER_PAGE,
            page: currentPage,
          },
          {
            headers: {
              Authorization: `Bearer ${STATIC_BEARER_TOKEN}`,
            },
          }
        );
        if (res?.success) {
          setDemandLetters(res?.results?.data || []);
          setPaginations({
            per_page: res?.results?.per_page || PER_PAGE,
            total: res?.results?.total || 0,
          });
        }
      } catch (error) {
        console.log("Error fetching demand letters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandLetters();
  }, [currentPage, search]);
  const handleOpenModal = (demandLetter) => {
    setSelectedDemand(demandLetter);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="lg:mt-10 mt-2">
        {/* Partner Registration filter */}
        <div className="lg:flex justify-between items-center ">
          <div className="">
            <h2 className="font-bold text-[24px] ">Demand Letters</h2>
          </div>
          <div className="mt-6 lg:mt-0">
            <SearchInput
              placeholder="Search demand letters"
              search={search}
              setSearch={setSearch}
              newSearchValue={newSearchValue}
              setNewSearchValue={setNewSearchValue}
            />
          </div>
        </div>

        {/* table  */}
        <div className="overflow-auto mt-6">
          <table className="table table-zebra  overflow-x-auto">
            {/* head */}
            <thead className=" border-b-2">
              <tr className="uppercase bg-[#f2f2f2]">
                <th>SL</th>
                <th>Company</th>
                <th>Job title</th>
                <th>Agency</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                demandLetters?.length > 0 &&
                demandLetters.map((item, index) => (
                  <tr className="whitespace-nowrap" key={item?.id}>
                    <th>{index + 1}</th>
                    <th>{formatValue(item?.company?.company_name)}</th>
                    <th>{formatValue(item?.job?.title)}</th>
                    <th>{formatValue(item?.agency?.name)}</th>
                    <th>{formatValue(item?.status)}</th>
                    <th>{formatDate(item?.created_at)}</th>
                    <th className="text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(item)}
                          className="w-[30px] flex items-center justify-center"
                        >
                          <img src={veiw_icon} alt="View" className="w-5" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/Candidate_List?title=${item.job?.title}`)
                          }
                          className="px-[30px] whitespace-nowrap  py-[10px] bg-[#1E3767] rounded-[8px] text-white"
                        >
                          Candidate List
                        </button>
                      </div>
                    </th>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="flex justify-center min-w-full mt-20 ">
            <TableLoading />
          </div>
        )}
        {!loading && demandLetters?.length === 0 && (
          <div className="flex justify-center min-w-full mt-20 ">
            <h4 className="text-black font-bold text-xl">No Data found!</h4>
          </div>
        )}
      </div>
      {/* pagition  */}
      {!loading && demandLetters?.length > 0 && (
        <Pagination
          paginations={paginations}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {isModalOpen && selectedDemand && (
        <Modal
          modals={isModalOpen}
          setModals={setIsModalOpen}
          setCandidateId={() => {}}
          setCertificateUrl={() => {}}
        >
          <div className="max-h-[80vh] space-y-6 overflow-y-auto pr-2 text-gray-900">
                <div>
                  <h3 className="text-xl font-bold">Demand Letter</h3>
                  <p className="mt-1 text-sm text-gray-500">{formatValue(selectedDemand?.title || selectedDemand?.predemand_letter?.stage)}</p>
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <DetailRow label="ID" value={formatValue(selectedDemand?.id)} />
                    <DetailRow label="Status" value={formatValue(selectedDemand?.status)} />
                    <DetailRow label="Employee numbers" value={formatValue(selectedDemand?.employee_numbers)} />
                    <DetailRow label="Source country" value={formatValue(selectedDemand?.source_country_id)} />
                    <DetailRow label="Attestation status" value={formatValue(selectedDemand?.attestation_status)} />
                    <DetailRow label="Attestation date" value={formatDate(selectedDemand?.attestation_date)} />
                    <DetailRow label="Created" value={formatDate(selectedDemand?.created_at)} />
                    <DetailRow label="Updated" value={formatDate(selectedDemand?.updated_at)} />
                  </div>
                </div>

                <section>
                  <h4 className="mb-3 text-lg font-semibold">Company</h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <DetailRow label="Company name" value={formatValue(selectedDemand?.company?.company_name)} />
                    <DetailRow label="Registration" value={formatValue(selectedDemand?.company?.registration_number)} />
                    <DetailRow label="Email" value={formatValue(selectedDemand?.company?.company_email)} />
                    <DetailRow label="Phone" value={formatValue(selectedDemand?.company?.phone_number)} />
                    <DetailRow label="Business type" value={formatValue(selectedDemand?.company?.business_type)} />
                    <DetailRow label="Country" value={formatValue(selectedDemand?.company?.country_id)} />
                  </div>
                </section>

                <section>
                  <h4 className="mb-3 text-lg font-semibold">Job</h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <DetailRow label="Title" value={formatValue(selectedDemand?.job?.title)} />
                    <DetailRow label="Level" value={formatValue(selectedDemand?.job?.level)} />
                    <DetailRow label="Location" value={formatValue(selectedDemand?.job?.location)} />
                    <DetailRow label="Vacancy" value={formatValue(selectedDemand?.predemand_letter?.quota?.approved_vacancy_number)} />
                    <DetailRow label="Deadline" value={formatDate(selectedDemand?.job?.deadline)} />
                    <DetailRow label="Offered salary" value={formatValue(selectedDemand?.job?.offered_salary)} />
                  </div>
                </section>

                <section>
                  <h4 className="mb-3 text-lg font-semibold">Agency</h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <DetailRow label="Name" value={formatValue(selectedDemand?.agency?.name)} />
                    <DetailRow label="Email" value={formatValue(selectedDemand?.agency?.email)} />
                    <DetailRow label="Phone" value={formatValue(selectedDemand?.agency?.phone)} />
                    <DetailRow label="Status" value={formatValue(selectedDemand?.agency?.status)} />
                  </div>
                </section>
              </div>
        </Modal>
      )}
    </div>
  );
};

export default DemandLetterList;
