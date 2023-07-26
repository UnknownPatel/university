import axios from "axios";

import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

var acces_token;
var headers;
var subdomain;

const BasicDetailsModal = ({
  setOpenModal,
  id,
  accesToken,
  headers,
  subdomain,
}) => {
  const [fatherFullName, setFatherFullName] = useState("");
  const [motherFullName, setMotherFullName] = useState("");
  const [dob, setDob] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [nationality, setNationality] = useState("");
  const [motherTongue, setMotherTongue] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [handicap, setHandicap] = useState("");

  const [isPhysicallyHandicap, setIsPhysicallyHandicap] = useState(false);

  const handleOptionChange = (event) => {
    setIsPhysicallyHandicap(event.target.value === "true");
  };

  // useEffect(() => {
  //   acces_token = localStorage.getItem("access_token");
  //   headers = { Authorization: `Bearer ${acces_token}` };
  //   const host = window.location.host;
  //   const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
  //   if (arr.length > 0) {
  //     subdomain = arr[0];
  //   }
  // }, []);

  const handleUpdateBasicDetails = () => {
    if (subdomain !== null || subdomain !== "") {
      axios
        .put(
          `/students/${id}`,
          {
            subdomain: subdomain,
            student: {
              father_name: fatherFullName,
              mother_name: motherFullName,
              date_of_birth: dob,
              birth_place: birthPlace,
              religion: religion,
              caste: caste,
              nationality: nationality,
              mother_tongue: motherTongue,
              marrital_status: maritalStatus,
              blood_group: bloodGroup,
              physically_handicapped: isPhysicallyHandicap,
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
        {/* <div
          className="fixed inset-0 w-full h-full bg-black opacity-20"
          onClick={() => setOpenModal(false)}
        ></div> */}
        <div className="flex items-center min-h-screen px-4 py-8">
          <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
            <div className="mt-3 flex flex-col sm:flex">
              <div className="">
                <div className="flex mt-2 ">
                  <input
                    type="text"
                    id="Father-Full Name"
                    onChange={(e) => setFatherFullName(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Father's Full Name"
                  />
                  <input
                    type="text"
                    id="Mother-Full Name"
                    onChange={(e) => setMotherFullName(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Mother's Full Name"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="DOB"
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Date of Birth"
                  />
                  <input
                    type="text"
                    id="BirthPlace"
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Birth Place"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Religion"
                    onChange={(e) => setReligion(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Religion"
                  />
                  <input
                    type="text"
                    id="Caste"
                    onChange={(e) => setCaste(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Caste"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Nationality"
                    onChange={(e) => setNationality(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Nationality"
                  />
                  <input
                    type="text"
                    id="Mother Tongue"
                    onChange={(e) => setMotherTongue(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Mother Tongue"
                  />
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    id="Marital Status"
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-5 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Marital Status"
                  />
                  <input
                    type="text"
                    id="Blood Group"
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 ml-14 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                    placeholder="Blood Group"
                  />
                </div>
                <div className="flex justify-center mt-2">
                  {/* <input
                    type="text"
                    id="handicap"
                    onChange={(e) => setHandicap(e.target.value)}
                    className="bg-gray-50 border-0 border-b-2 text-gray-900 text-sm rounded-lg block w-48 pl-5 p-2.5 border-gray-600 "
                    placeholder="Any physically Handicap ?"
                  /> */}
                  <label htmlFor="physicallyHandicap" className="text-lg mr-10">
                    Physically Handicap:
                  </label>
                  <div className="mt-1">
                    <label className="mr-5">
                      <input
                        type="radio"
                        id="physicallyHandicap"
                        name="options"
                        value="true"
                        checked={isPhysicallyHandicap}
                        onChange={handleOptionChange}
                      />
                      Yes
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="options"
                        value="false"
                        checked={!isPhysicallyHandicap}
                        onChange={handleOptionChange}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center sm:ml-4 sm:text-left">
                <div className="items-center gap-2 mt-3 sm:flex">
                  <button
                    className="w-full mt-2 p-2.5 flex-1 text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                    onClick={() => handleUpdateBasicDetails()}
                  >
                    Submit
                  </button>
                  {/* <button
                    className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 hover:bg-red-600 hover:text-slate-50 ring-indigo-600 focus:ring-2"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsModal;
