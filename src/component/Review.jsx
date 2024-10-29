import React from 'react';

const Review = ({
  payload,
  academic,
  experience,
  training,
  address
}) => {
  return (
    <div>
      <h1>Review Your Information</h1>
      
      <h2>Personal Information</h2>
      <p><strong>Name:</strong> {payload.fullName}</p>
      <p><strong>Email:</strong> {payload.email}</p>
      <p><strong>Phone:</strong> {payload.phone}</p>
      <p><strong>Gender:</strong> {payload.gender}</p>
      <p><strong>Marital Status:</strong> {payload.marital_status}</p>
      <p><strong>Religion:</strong> {payload.religion}</p>
      <p><strong>Birth Date:</strong> {payload.birth_date}</p>
      <p><strong>Father's Name:</strong> {payload.father_name}</p>
      <p><strong>Mother's Name:</strong> {payload.mother_name}</p>
      
      <h2>Address</h2>
      <p><strong>Country:</strong> {address.country}</p>
      <p><strong>City:</strong> {address.city}</p>
      <p><strong>Street Address:</strong> {address.street_address}</p>
      <p><strong>Permanent Address:</strong> {address.permanent_address}</p>
      <p><strong>Present Address:</strong> {address.present_address}</p>

      <h2>Academic Information</h2>
      <p><strong>Level of Education:</strong> {academic.level_of_education}</p>
      <p><strong>Institute Name:</strong> {academic.institute_name}</p>
      <p><strong>Result:</strong> {academic.result}</p>
      <p><strong>Degree Title:</strong> {academic.exam_degree_title}</p>
      <p><strong>Year of Passing:</strong> {academic.year_of_passing}</p>
      <p><strong>Concentration/Major:</strong> {academic.concentration_major}</p>

      <h2>Experience</h2>
      <p><strong>Company Name:</strong> {experience.company_name}</p>
      <p><strong>Business:</strong> {experience.company_business}</p>
      <p><strong>Designation:</strong> {experience.designation}</p>
      <p><strong>Department:</strong> {experience.department}</p>
      <p><strong>Employment Period:</strong> {experience.employment_period_from} to {experience.employment_period_to}</p>
      <p><strong>Location:</strong> {experience.company_location}</p>
      <p><strong>Total Years of Experience:</strong> {experience.total_year_of_experience}</p>

      <h2>Training</h2>
      <p><strong>Training Title:</strong> {training.training_title}</p>
      <p><strong>Country:</strong> {training.country}</p>
      <p><strong>Topics Covered:</strong> {training.topics_covered}</p>
      <p><strong>Year of Training:</strong> {training.training_year}</p>
      <p><strong>Institute:</strong> {training.institute}</p>
      <p><strong>Duration:</strong> {training.duration}</p>

      <h2>Additional Information</h2>
      <p><strong>Expiry Date:</strong> {payload.expiry_date}</p>
      <p><strong>Issued By:</strong> {payload.issued_by}</p>
      <p><strong>Date of Issue:</strong> {payload.dateOfIssue}</p>
      <p><strong>Visit Russia Number:</strong> {payload.visitRussiaNumber}</p>
      <p><strong>Russia Trip Date:</strong> {payload.russia_trip_date}</p>
      <p><strong>Host Organization:</strong> {payload.hostOrganization}</p>
      <p><strong>Route/Journey:</strong> {payload.route_Journey}</p>
      <p><strong>Relatives Staying:</strong> {payload.relativesStaying}</p>
      <p><strong>Refused Entry to Russia:</strong> {payload.refusedRussian ? 'Yes' : 'No'}</p>
      <p><strong>Deported from Russia:</strong> {payload.deportedRussia ? 'Yes' : 'No'}</p>
      <p><strong>Spouse's Name:</strong> {payload.spousesName}</p>
      <p><strong>Spouse's Birth Date:</strong> {payload.spouses_birth_date}</p>
      <p><strong>Medical Status:</strong> {payload.medical_status ? 'Cleared' : 'Not Cleared'}</p>
      <p><strong>Training Status:</strong> {payload.training_status ? 'Completed' : 'Not Completed'}</p>
      {/* Add any additional fields you need */}
      
      <h2>Files</h2>
      <p><strong>Passport File:</strong> {payload.passport_file}</p>
      <p><strong>Academic File:</strong> {payload.academic_file}</p>
      <p><strong>Experience File:</strong> {payload.experience_file}</p>
      <p><strong>Training File:</strong> {payload.training_file}</p>
      <p><strong>NID File:</strong> {payload.nid_file}</p>
      <p><strong>PIF File:</strong> {payload.pif_file}</p>
      <p><strong>Referred By:</strong> {payload.referred_by}</p>
    </div>
  );
};

export default Review;
