import React from "react";
import { useState } from "react";

const GuardianInfo = () => {
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

  const handleUpdateGuardianDetails = () => {};

  return (
    <div>
      <div className=" w-full">
        <p className="bg-slate-600 rounded-lg text-white py-2 px-5">
          Guardian Details
        </p>
        <div className="flex mt-5 ">
          <div className="flex flex-col ">
            <label htmlFor="">Guardian Full Name:</label>
            <input
              type="text"
              id="Guardian-FullName"
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Guardian Full Name"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Relation with Guardian:</label>
            <input
              type="text"
              id="Relation-with-Guardian"
              onChange={(e) => setRelation(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Relation with Guardian"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col ">
            <label htmlFor="">Guardian Mobile Number:</label>
            <input
              type="text"
              id="Guardian-Mobile-No"
              onChange={(e) => setMobileNo(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Guardian Mobile Number"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Guardian Personal Email id:</label>
            <input
              type="text"
              id="Guardian-Personal-EmailId"
              onChange={(e) => setPersonalEmailId(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Guardian Personal Email id"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col ">
            <label htmlFor="">Guardian Professional Email id:</label>
            <input
              type="text"
              id="Guardian-Professional-EmailId"
              onChange={(e) => setProfessionalEmailId(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Guardian Professional Email id"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Guardian Address 1:</label>
            <input
              type="text"
              id="Guardian Address1"
              onChange={(e) => setAddress1(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Guardian Address 1"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col ">
            <label htmlFor="">Guardian Address 2:</label>
            <input
              type="text"
              id="Guardian Address 2"
              onChange={(e) => setAddress2(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Guardian Address 2"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Area</label>
            <input
              type="text"
              id="Area"
              onChange={(e) => setArea(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Area"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col ">
            <label htmlFor="">Country: </label>
            <input
              type="text"
              id="Country"
              onChange={(e) => setcountry(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Country"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">State:</label>
            <input
              type="text"
              id="State"
              onChange={(e) => setState(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="State"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col ">
            <label htmlFor="">City:</label>
            <input
              type="text"
              id="City"
              onChange={(e) => setCity(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="City"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Pincode:</label>
            <input
              type="text"
              id="Pincode"
              onChange={(e) => setPincode(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Pincode"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="w-60 mt-5 p-2.5 text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
          onClick={() => handleUpdateGuardianDetails()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default GuardianInfo;
