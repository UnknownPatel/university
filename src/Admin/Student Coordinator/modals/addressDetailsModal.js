import axios from "axios";

import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

var acces_token;
var headers;
var subdomain;

const AddressDetailsModal = ({
  setOpenModal,
  id,
  accesToken,
  headers,
  subdomain,
}) => {
  const [currentAddress1, setCurrentAddress1] = useState("");
  const [currentAddress2, setCurrentAddress2] = useState("");
  const [currentArea, setCurrentArea] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentPincode, setCurrentPincode] = useState("");
  const [permanentAddress1, setPermanentAddress1] = useState("");
  const [permanentAddress2, setPermanentAddress2] = useState("");
  const [permanentArea, setPermanentArea] = useState("");
  const [permanentCountry, setPermanentCountry] = useState("");
  const [permanentState, setPermanentState] = useState("");
  const [permanentCity, setPermanentCity] = useState("");
  const [permanentPincode, setPermanentPincode] = useState("");

  // useEffect(() => {
  //   acces_token = localStorage.getItem("access_token");
  //   headers = { Authorization: `Bearer ${acces_token}` };
  //   const host = window.location.host;
  //   const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
  //   if (arr.length > 0) {
  //     subdomain = arr[0];
  //   }
  // }, []);

  const handleUpdateAddressDetails = () => {
    if (subdomain !== null || subdomain !== "") {
      axios
        .put(
          `/students/${id}`,
          {
            subdomain: subdomain,
            address_detail: {
              current_address_1: currentAddress1,
              current_address_2: currentAddress2,
              current_address_area: currentArea,
              current_address_city: currentCity,
              current_address_country: currentCountry,
              current_address_pincode: currentPincode,
              current_address_state: currentState,
              permanent_address_1: permanentAddress1,
              permanent_address_2: permanentAddress2,
              permanent_address_area: permanentArea,
              permanent_address_city: permanentCity,
              permanent_address_country: permanentCountry,
              permanent_address_pincode: permanentPincode,
              permanent_address_state: permanentState,
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
                <div className="">
                  <p className="bg-slate-600 text-white py-2">
                    Current Address Details
                  </p>
                </div>
                <div className="flex mt-2 ">
                  <input
                    type="text"
                    id="Current-Address1"
                    onChange={(e) => setCurrentAddress1(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Current Address 1"
                  />
                  <input
                    type="text"
                    id="Current-Address2"
                    onChange={(e) => setCurrentAddress2(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Current Address 2"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Area"
                    onChange={(e) => setCurrentArea(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Area"
                  />
                  <input
                    type="text"
                    id="Country"
                    onChange={(e) => setCurrentCountry(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Country"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="State"
                    onChange={(e) => setCurrentState(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="State"
                  />
                  <input
                    type="text"
                    id="City"
                    onChange={(e) => setCurrentCity(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="City"
                  />
                </div>
                <div className="flex justify-center mt-2">
                  <input
                    type="text"
                    id="Pincode"
                    onChange={(e) => setCurrentPincode(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 text-gray-900 text-sm rounded-lg block w-48 pl-5 p-2.5 border-gray-600 "
                    placeholder="Pincode"
                  />
                </div>
                <div className="mt-2">
                  <p className="bg-slate-600 py-2 text-white">
                    Permanent Address Details
                  </p>
                </div>
                <div className="flex mt-2 ">
                  <input
                    type="text"
                    id="Permanent-Address1"
                    onChange={(e) => setPermanentAddress1(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Permanent Address 1"
                  />
                  <input
                    type="text"
                    id="Permanent-Address2"
                    onChange={(e) => setPermanentAddress2(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Permanent Address 2"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Area"
                    onChange={(e) => setPermanentArea(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Area"
                  />
                  <input
                    type="text"
                    id="Country"
                    onChange={(e) => setPermanentCountry(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Country"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="State"
                    onChange={(e) => setPermanentState(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="State"
                  />
                  <input
                    type="text"
                    id="City"
                    onChange={(e) => setPermanentCity(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="City"
                  />
                </div>
                <div className="flex justify-center mt-2">
                  <input
                    type="text"
                    id="Pincode"
                    onChange={(e) => setPermanentPincode(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 text-gray-900 text-sm rounded-lg block w-48 pl-5 p-2.5 border-gray-600 "
                    placeholder="Pincode"
                  />
                </div>
              </div>
              <div className="mt-2 text-center sm:ml-4 sm:text-left">
                <div className="items-center gap-2 mt-3 sm:flex">
                  <button
                    className="w-full mt-2 p-2.5 flex-1 text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                    onClick={() => handleUpdateAddressDetails()}
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

export default AddressDetailsModal;
