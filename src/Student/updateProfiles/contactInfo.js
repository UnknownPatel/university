import React from "react";
import { useState } from "react";

const ContactInfo = () => {
  const [studentMobileNo, setStudentMobileno] = useState("");
  const [emergencyMobileNo, setEmergencyMobileNo] = useState("");
  const [residencePhoneNo, setResidencePhoneNo] = useState("");
  const [personalEmailId, setPersonalEmailId] = useState("");
  const [uniEmailId, setUniEmailId] = useState("");
  const [fatherMobileNo, setFatherMobileNo] = useState("");
  const [fatherEmailId, setFatherEmailId] = useState("");
  const [motherMobileNo, setMotherMobileNo] = useState("");
  const [motherEmailId, setMotherEmailId] = useState("");

  const handleUpdateContactDetails = () => {};

  return (
    <div>
      <div className="">
        <p className="bg-slate-600 rounded-lg text-white py-2 px-5">
          Contact Details
        </p>
        <div className="flex mt-5">
          <div className="flex flex-col">
            <label htmlFor="">Student Mobile No:</label>
            <input
              type="text"
              id="Student-Mobile-Number"
              onChange={(e) => setStudentMobileno(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Student Mobile Number"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Emergency Mobile No:</label>
            <input
              type="text"
              id="Emergency-Mobile-Number"
              onChange={(e) => setEmergencyMobileNo(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Emergency Mobile Number"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Residence Phone No:</label>
            <input
              type="text"
              id="Residence-Phone-Number"
              onChange={(e) => setResidencePhoneNo(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Residence Phone Number"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Persoanal Email Id:</label>
            <input
              type="text"
              id="Personal-EmailId"
              onChange={(e) => setPersonalEmailId(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Personal EmailId"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">University Email Id:</label>
            <input
              type="text"
              id="Uni-EmailId"
              onChange={(e) => setUniEmailId(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="University EmailId"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col">
            <label htmlFor="">Father's Mobile No:</label>
            <input
              type="text"
              id="Father-Mobile-No"
              onChange={(e) => setFatherMobileNo(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Father's Mobile Number"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Father's Email Id:</label>
            <input
              type="text"
              id="Father-Personal-EmailId"
              onChange={(e) => setFatherEmailId(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Father's Personal Email Id"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Mother's Mobile No:</label>
            <input
              type="text"
              id="Mother-Mobile-No"
              onChange={(e) => setMotherMobileNo(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Mother's Mobile Number"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Mother's Email Id:</label>
            <input
              type="text"
              id="Mother-Personal-EmailId"
              onChange={(e) => setMotherEmailId(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Mother's Personal Email Id"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="w-60 mt-5 p-2.5  text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
          onClick={() => handleUpdateContactDetails()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ContactInfo;
