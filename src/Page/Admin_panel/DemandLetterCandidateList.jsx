import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { post } from "../../api/axios";
import Pagination from "../../component/Pagination";
import SearchInput from "../../component/SearchInput";
import TableLoading from "../../component/TableLoading";
import Modal from "../../component/Modal";

const STATIC_BEARER_TOKEN =
  "6521|clJuPOGOTSS0Np4fXr5DFCUOMeoUasjWV4LliOuOc283979f";
const PER_PAGE = 10;

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "N/A";
  }

  return String(value);
};

const formatDate = (value) => (value ? String(value).slice(0, 10) : "N/A");

const normalizeRows = (rows) => {
  if (Array.isArray(rows)) {
    return rows;
  }

  return [];
};

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

const DemandLetterCandidateList = () => {
  const { id } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [newSearchValue, setNewSearchValue] = useState("");
  const [paginations, setPaginations] = useState({
    per_page: 0,
    total: 0,
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (search && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const res = await post(
          "https://mges.tech/api/resources",
          {
            resource: "EWorkPermit",
            action: "AssignedCandidate",
            search,
            per_page: PER_PAGE,
            page: currentPage,
            demand_letter_id: String(id),
          },
          {
            headers: {
              Authorization: `Bearer ${STATIC_BEARER_TOKEN}`,
            },
          }
        );

        if (res?.success) {
          setCandidates(res?.results?.data || []);
          setPaginations({
            per_page: res?.results?.per_page || PER_PAGE,
            total: res?.results?.total || 0,
          });
        } else {
          setCandidates([]);
          setPaginations({ per_page: 0, total: 0 });
        }
      } catch (error) {
        console.log("Error fetching demand letter candidates:", error);
        setCandidates([]);
        setPaginations({ per_page: 0, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [currentPage, id, search]);

  const handleOpenModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  return (
    <div className="lg:mt-10 mt-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-gray-900">
            Demand Letter Candidates
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Demand letter ID: {id}
          </p>
        </div>

        <div className="w-full lg:w-[360px]">
          <SearchInput
            placeholder="Search candidate"
            search={search}
            setSearch={setSearch}
            newSearchValue={newSearchValue}
            setNewSearchValue={setNewSearchValue}
          />
        </div>
      </div>

      <div className="mt-6 overflow-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="table table-zebra overflow-x-auto">
          <thead className="border-b-2">
            <tr className="bg-[#f2f2f2] uppercase">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Agency</th>
              <th>Work permit</th>
              <th>Biometric</th>
              <th>Medical</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              candidates?.length > 0 &&
              candidates.map((candidate) => (
                <tr key={candidate?.id} className="whitespace-nowrap">
                  <th>{candidate?.id}</th>
                  <th>{formatValue(candidate?.name)}</th>
                  <th>{formatValue(candidate?.email)}</th>
                  <th>{formatValue(candidate?.phone_number)}</th>
                  <th>{formatValue(candidate?.agency_name)}</th>
                  <th>{formatValue(candidate?.work_permit_status)}</th>
                  <th>{formatValue(candidate?.biometric_status)}</th>
                  <th>{formatValue(candidate?.medical_status)}</th>
                  <th className="text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(candidate)}
                      className="rounded-lg bg-[#1E3767] px-5 py-2 text-white"
                    >
                      View
                    </button>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="mt-20 flex min-w-full justify-center">
          <TableLoading />
        </div>
      )}

      {!loading && candidates?.length === 0 && (
        <div className="mt-20 flex min-w-full justify-center">
          <h4 className="text-xl font-bold text-black">No Data found!</h4>
        </div>
      )}

      {!loading && candidates?.length > 0 && (
        <Pagination
          paginations={paginations}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {isModalOpen && selectedCandidate && (
        <Modal
          modals={isModalOpen}
          setModals={setIsModalOpen}
          setCandidateId={() => {}}
          setCertificateUrl={() => {}}
        >
          <div className="max-h-[80vh] space-y-6 overflow-y-auto pr-2 text-gray-900">
            <div>
              <h3 className="text-xl font-bold">Candidate Details</h3>
              <p className="mt-1 text-sm text-gray-500">
                {formatValue(selectedCandidate?.name)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailRow label="ID" value={formatValue(selectedCandidate?.id)} />
              <DetailRow label="Email" value={formatValue(selectedCandidate?.email)} />
              <DetailRow
                label="Phone"
                value={formatValue(selectedCandidate?.phone_number)}
              />
              <DetailRow
                label="Gender"
                value={formatValue(selectedCandidate?.gender)}
              />
              <DetailRow
                label="Date of birth"
                value={formatDate(selectedCandidate?.date_of_birth)}
              />
              <DetailRow
                label="Marital status"
                value={formatValue(selectedCandidate?.marital_status)}
              />
              <DetailRow
                label="Passport"
                value={formatValue(selectedCandidate?.passport_number)}
              />
              <DetailRow
                label="NID"
                value={formatValue(selectedCandidate?.nid)}
              />
              <DetailRow
                label="Agency"
                value={formatValue(selectedCandidate?.agency_name)}
              />
              <DetailRow
                label="Work permit"
                value={formatValue(selectedCandidate?.work_permit_status)}
              />
              <DetailRow
                label="Biometric"
                value={formatValue(selectedCandidate?.biometric_status)}
              />
              <DetailRow
                label="Medical"
                value={formatValue(selectedCandidate?.medical_status)}
              />
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold">Addresses</h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <DetailRow
                  label="Present address"
                  value={formatValue(selectedCandidate?.present_address)}
                />
                <DetailRow
                  label="Permanent address"
                  value={formatValue(selectedCandidate?.permanent_address)}
                />
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold">Family</h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <DetailRow
                  label="Father name"
                  value={formatValue(selectedCandidate?.father_name)}
                />
                <DetailRow
                  label="Mother name"
                  value={formatValue(selectedCandidate?.mother_name)}
                />
                <DetailRow
                  label="Spouse name"
                  value={formatValue(selectedCandidate?.spouse_name)}
                />
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold">Academic Qualifications</h4>
              <div className="space-y-3">
                {normalizeRows(selectedCandidate?.academic_qualifications).length > 0 ? (
                  normalizeRows(selectedCandidate?.academic_qualifications).map(
                    (qualification, index) => (
                      <div
                        key={`${qualification?.education_degree || "qual"}-${index}`}
                        className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-2"
                      >
                        <DetailRow
                          label="Degree"
                          value={formatValue(qualification?.education_degree)}
                        />
                        <DetailRow
                          label="Institute"
                          value={formatValue(qualification?.institute)}
                        />
                        <DetailRow
                          label="Grade"
                          value={formatValue(qualification?.grade)}
                        />
                        <DetailRow
                          label="Session"
                          value={formatValue(qualification?.session)}
                        />
                        <DetailRow
                          label="Board"
                          value={formatValue(qualification?.board)}
                        />
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-500">No academic data found.</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold">Experience</h4>
              <div className="space-y-3">
                {normalizeRows(selectedCandidate?.experience).length > 0 ? (
                  normalizeRows(selectedCandidate?.experience).map((experience, index) => (
                    <div
                      key={`${experience?.company_name || "exp"}-${index}`}
                      className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-2"
                    >
                      <DetailRow
                        label="Company"
                        value={formatValue(experience?.company_name)}
                      />
                      <DetailRow
                        label="Designation"
                        value={formatValue(experience?.designation)}
                      />
                      <DetailRow
                        label="Location"
                        value={formatValue(experience?.location)}
                      />
                      <DetailRow
                        label="From"
                        value={formatDate(experience?.from_date)}
                      />
                      <DetailRow
                        label="To"
                        value={formatDate(experience?.to_date)}
                      />
                      <DetailRow
                        label="Currently working"
                        value={experience?.currently_working ? "Yes" : "No"}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No experience data found.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailRow
                label="Skill test"
                value={formatValue(selectedCandidate?.skill_test_status)}
              />
              <DetailRow
                label="Biometric status"
                value={formatValue(selectedCandidate?.biometric_status)}
              />
              <DetailRow
                label="Premedical"
                value={formatValue(selectedCandidate?.premedical)}
              />
              <DetailRow
                label="Police verification"
                value={formatValue(selectedCandidate?.police_verification)}
              />
              <DetailRow
                label="CV file"
                value={formatValue(selectedCandidate?.cv_file)}
              />
              <DetailRow
                label="NID file"
                value={formatValue(selectedCandidate?.nid_file)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DemandLetterCandidateList;