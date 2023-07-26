import axios from "axios";

import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

var acces_token;
var headers;
var subdomain;

const ContactDetailsModel = ({
  setOpenModal,
  id,
  accesToken,
  headers,
  subdomain,
}) => {
  const [studentMobileNo, setStudentMobileno] = useState("");
  const [emergencyMobileNo, setEmergencyMobileNo] = useState("");
  const [residencePhoneNo, setResidencePhoneNo] = useState("");
  const [personalEmailId, setPersonalEmailId] = useState("");
  const [uniEmailId, setUniEmailId] = useState("");
  const [fatherMobileNo, setFatherMobileNo] = useState("");
  const [fatherEmailId, setFatherEmailId] = useState("");
  const [motherMobileNo, setMotherMobileNo] = useState("");
  const [motherEmailId, setMotherEmailId] = useState("");

  // useEffect(() => {
  //   acces_token = localStorage.getItem("access_token");
  //   headers = { Authorization: `Bearer ${acces_token}` };
  //   const host = window.location.host;
  //   const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
  //   if (arr.length > 0) {
  //     subdomain = arr[0];
  //   }
  // }, []);

  const handleUpdateContactDetails = () => {
    if (subdomain !== null || subdomain !== "") {
      axios
        .put(
          `/students/${id}`,
          {
            subdomain: subdomain,
            contact_detail: {
              mobile_number: studentMobileNo,
              emergency_mobile_number: emergencyMobileNo,
              residence_phone_number: residencePhoneNo,
              personal_email_address: personalEmailId,
              university_email_address: uniEmailId,
              fathers_mobile_number: fatherMobileNo,
              fathers_personal_email: fatherEmailId,
              mothers_mobile_number: motherMobileNo,
              mothers_personal_email: motherEmailId,
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
    <>
      <div className="ml-64 fixed inset-0 z-10 overflow-y-auto">
        <div
          className="fixed inset-0 w-full h-full bg-black opacity-20"
          onClick={() => setOpenModal(false)}
        ></div>
        <div className="flex items-center min-h-screen px-4 py-8">
          <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
            <div className="mt-3 flex flex-col sm:flex">
              <div className="">
                <div className="flex justify-center">
                  <input
                    type="text"
                    id="Student-Mobile-Number"
                    onChange={(e) => setStudentMobileno(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Student Mobile Number"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Emergency-Mobile-Number"
                    onChange={(e) => setEmergencyMobileNo(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Emergency Mobile Number"
                  />
                  <input
                    type="text"
                    id="Residence-Phone-Number"
                    onChange={(e) => setResidencePhoneNo(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Residence Phone Number"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Personal-EmailId"
                    onChange={(e) => setPersonalEmailId(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Personal EmailId"
                  />
                  <input
                    type="text"
                    id="Uni-EmailId"
                    onChange={(e) => setUniEmailId(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="University EmailId"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Father-Mobile-No"
                    onChange={(e) => setFatherMobileNo(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Father's Mobile Number"
                  />
                  <input
                    type="text"
                    id="Father-Personal-EmailId"
                    onChange={(e) => setFatherEmailId(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Father's Personal Email Id"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Mother-Mobile-No"
                    onChange={(e) => setMotherMobileNo(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Mother's Mobile Number"
                  />
                  <input
                    type="text"
                    id="Mother-Personal-EmailId"
                    onChange={(e) => setMotherEmailId(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Mother's Personal Email Id"
                  />
                </div>
              </div>
              <div className="mt-2 text-center sm:ml-4 sm:text-left">
                <div className="items-center gap-2 mt-3 sm:flex">
                  <button
                    className="w-full mt-2 p-2.5 flex-1 text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                    onClick={() => handleUpdateContactDetails()}
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
    </>
  );
};

export default ContactDetailsModel;
