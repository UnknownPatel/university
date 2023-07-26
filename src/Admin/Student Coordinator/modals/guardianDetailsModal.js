import axios from "axios";

import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

var acces_token;
var headers;
var subdomain;

const GuardianDetailsModal = ({
  setOpenModal,
  id,
  accesToken,
  headers,
  subdomain,
}) => {
  const [fullName, setFullName] = useState("");
  const [relation, setRelation] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [personalEmailId, setPersonalEmailId] = useState("");
  const [professionalEmailId, setProfessionalEmailId] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [area, setArea] = useState("");
  const [country, setcountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // useEffect(() => {
  //   acces_token = localStorage.getItem("access_token");
  //   headers = { Authorization: `Bearer ${acces_token}` };
  //   const host = window.location.host;
  //   const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
  //   if (arr.length > 0) {
  //     subdomain = arr[0];
  //   }
  // }, []);

  const handleUpdateGuardianDetails = () => {
    if (subdomain !== null || subdomain !== "") {
      axios
        .put(
          `/students/${id}`,
          {
            subdomain: subdomain,
            guardian_detail: {
              name: fullName,
              relation: relation,
              mobile_number: mobileNo,
              personal_email: personalEmailId,
              professional_email: professionalEmailId,
              address_1: address1,
              address_2: address2,
              area: area,
              country: country,
              state: state,
              city: city,
              pincode: pincode,
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
              <div className=" h-[50vh] max-w-max over">
                <div className="flex mt-2 ">
                  <input
                    type="text"
                    id="Guardian-FullName"
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Guardian Full Name"
                  />
                  <input
                    type="text"
                    id="Relation-with-Guardian"
                    onChange={(e) => setRelation(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Relation with Guardian"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Guardian-Mobile-No"
                    onChange={(e) => setMobileNo(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Guardian Mobile Number"
                  />
                  <input
                    type="text"
                    id="Guardian-Personal-EmailId"
                    onChange={(e) => setPersonalEmailId(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Guardian Personal Email id"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Guardian-Professional-EmailId"
                    onChange={(e) => setProfessionalEmailId(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Guardian Professional Email id"
                  />
                  <input
                    type="text"
                    id="Guardian Address1"
                    onChange={(e) => setAddress1(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Guardian Address 1"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Guardian Address 2"
                    onChange={(e) => setAddress2(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Guardian Address 2"
                  />
                  <input
                    type="text"
                    id="Area"
                    onChange={(e) => setArea(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Area"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Country"
                    onChange={(e) => setcountry(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Country"
                  />
                  <input
                    type="text"
                    id="State"
                    onChange={(e) => setState(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="State"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="City"
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="City"
                  />
                  <input
                    type="text"
                    id="Pincode"
                    onChange={(e) => setPincode(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Pincode"
                  />
                </div>
              </div>
              <div className="mt-2 text-center sm:ml-4 sm:text-left">
                <div className="items-center gap-2 mt-3 sm:flex">
                  <button
                    className="w-full mt-2 p-2.5 flex-1 text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                    onClick={() => handleUpdateGuardianDetails()}
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

export default GuardianDetailsModal;
