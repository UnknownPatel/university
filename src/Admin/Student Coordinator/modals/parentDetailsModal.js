import axios from "axios";

import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

var acces_token;
var headers;
var subdomain;

const ParentDetailsModal = ({
  setOpenModal,
  id,
  accesToken,
  headers,
  subdomain,
}) => {
  const [fatherQualification, setFatherQualification] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [fatherCompanyName, setFatherCompanyName] = useState("");
  const [fatherDesignation, setFatherDesignation] = useState("");
  const [fatherOfficeAddress, setFatherOfficeAddress] = useState("");
  const [fatherAnnualIncome, setFatherAnnualIncome] = useState("");
  const [fatherProfessionalEmail, setFatherProfessionalEmail] = useState("");
  const [motherQualification, setMotherQualification] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [motherCompanyName, setMotherCompanyName] = useState("");
  const [motherDesignation, setMotherDesignation] = useState("");
  const [motherOfficeAddress, setMotherOfficeAddress] = useState("");
  const [motherAnnualIncome, setMotherAnnualIncome] = useState("");
  const [motherProfessionalEmail, setMotherProfessionalEmail] = useState("");
  const [dateOfMarriage, setDateOfMarriage] = useState("");

  // useEffect(() => {
  //   acces_token = localStorage.getItem("access_token");
  //   headers = { Authorization: `Bearer ${acces_token}` };
  //   const host = window.location.host;
  //   const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
  //   if (arr.length > 0) {
  //     subdomain = arr[0];
  //   }
  // }, []);

  const handleUpdateParentDetails = () => {
    if (subdomain !== null || subdomain !== "") {
      axios
        .put(
          `/students/${id}`,
          {
            subdomain: subdomain,
            parent_detail: {
              qualification_of_father: fatherQualification,
              occupation_of_father: fatherOccupation,
              father_company_name: fatherCompanyName,
              father_designation: fatherDesignation,
              father_office_address: fatherOfficeAddress,
              father_annual_income: fatherAnnualIncome,
              father_professional_email: fatherProfessionalEmail,
              qualification_of_mother: motherQualification,
              occupation_of_mother: motherOccupation,
              mother_company_name: motherCompanyName,
              mother_designation: motherDesignation,
              mother_office_address: motherOfficeAddress,
              mother_annual_income: motherAnnualIncome,
              mother_professional_email: motherProfessionalEmail,
              date_of_marriage: dateOfMarriage,
            },
          },
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.status === "ok") {
            setOpenModal(false);
            if (res.data.data.student.length !== 0) {
              console.log("Updated");
              toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div>
      <div className="ml-64 fixed inset-0 z-10 overflow-y-auto">
        <div
          className="fixed inset-0 w-full h-full bg-black opacity-20"
          onClick={() => setOpenModal(false)}
        ></div>
        <div className="flex items-center min-h-screen px-4 py-8 ">
          <div className="relative w-full p-4 mx-auto bg-white  rounded-md shadow-lg max-w-max">
            <div className="mt-3 flex flex-col sm:flex">
              <div className="overflow-y-scroll p-4 h-[50vh] max-w-max over">
                <div className="flex mt-2 ">
                  <input
                    type="text"
                    id="Qualification-of-Father"
                    onChange={(e) => setFatherQualification(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Qualification of Father"
                  />
                  <input
                    type="text"
                    id="Occupation-of-Father"
                    onChange={(e) => setFatherOccupation(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Occupation of Father"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Father-Company-Name"
                    onChange={(e) => setFatherCompanyName(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Father Company Name"
                  />
                  <input
                    type="text"
                    id="Father-Designation"
                    onChange={(e) => setFatherDesignation(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Father Designation"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Father-Office-Address"
                    onChange={(e) => setFatherOfficeAddress(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Father Office Address"
                  />
                  <input
                    type="text"
                    id="Father-Annual-Income"
                    onChange={(e) => setFatherAnnualIncome(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Father Annual Income"
                  />
                </div>
                <div className="flex justify-center mt-2">
                  <input
                    type="text"
                    id="Father Professional Email Id"
                    onChange={(e) => setFatherProfessionalEmail(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 text-gray-900 text-sm rounded-lg block w-52 pl-5 p-2.5 border-gray-600 "
                    placeholder="Father Professional Email Id"
                  />
                </div>
                <div className="flex mt-2 ">
                  <input
                    type="text"
                    id="Qualification-of-Mother"
                    onChange={(e) => setMotherQualification(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Qualification of Mother"
                  />
                  <input
                    type="text"
                    id="Occupation-of-Mother"
                    onChange={(e) => setMotherOccupation(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Occupation of Mother"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Mother-Company-Name"
                    onChange={(e) => setMotherCompanyName(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Mother Company Name"
                  />
                  <input
                    type="text"
                    id="Mother-Designation"
                    onChange={(e) => setMotherDesignation(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Mother Designation"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Mother-Office-Address"
                    onChange={(e) => setMotherOfficeAddress(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Mother Office Address"
                  />
                  <input
                    type="text"
                    id="Mother-Annual-Income"
                    onChange={(e) => setMotherAnnualIncome(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Mother Annual Income"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Mother-Professional-EmailId"
                    onChange={(e) => setMotherProfessionalEmail(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Mother Professional EmailId"
                  />
                  <input
                    type="text"
                    id="Date-of-Marriage"
                    onChange={(e) => setDateOfMarriage(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Date of Marriage"
                  />
                </div>
              </div>
              <div className="mt-2 text-center sm:ml-4 sm:text-left">
                <div className="items-center gap-2 mt-3 sm:flex">
                  <button
                    className="w-full mt-2 p-2.5 flex-1 text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                    onClick={() => handleUpdateParentDetails()}
                  >
                    Submit
                  </button>
                  <button
                    className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 hover:bg-red-600 hover:text-slate-50 ring-indigo-600 focus:ring-2"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDetailsModal;
