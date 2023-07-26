import React from "react";
import { useState } from "react";

const AddressInfo = () => {
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

  const handleUpdateAddressDetails = () => {};

  return (
    <div>
      <div className="w-full">
        <div className="">
          <p className="bg-slate-600 rounded-lg text-white py-2 px-5">
            Current Address Details
          </p>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Current Address 1 :</label>
            <input
              type="text"
              id="Current-Address1"
              onChange={(e) => setCurrentAddress1(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Current Address 1"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Current Address 2:</label>
            <input
              type="text"
              id="Current-Address2"
              onChange={(e) => setCurrentAddress2(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Current Address 2"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Area:</label>
            <input
              type="text"
              id="Area"
              onChange={(e) => setCurrentArea(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Area"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Country:</label>
            <input
              type="text"
              id="Country"
              onChange={(e) => setCurrentCountry(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Country"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col">
            <label htmlFor="">State:</label>
            <input
              type="text"
              id="State"
              onChange={(e) => setCurrentState(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="State"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">City:</label>
            <input
              type="text"
              id="City"
              onChange={(e) => setCurrentCity(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="City"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Pincode:</label>
            <input
              type="text"
              id="Pincode"
              onChange={(e) => setCurrentPincode(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Pincode"
            />
          </div>
        </div>
        <div className="mt-3">
          <p className="bg-slate-600 py-2 rounded-lg px-5 text-white">
            Permanent Address Details
          </p>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Permanent Address 1:</label>
            <input
              type="text"
              id="Permanent-Address1"
              onChange={(e) => setPermanentAddress1(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Permanent Address 1"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Permanent Address 2: </label>
            <input
              type="text"
              id="Permanent-Address2"
              onChange={(e) => setPermanentAddress2(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Permanent Address 2"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Area:</label>
            <input
              type="text"
              id="Area"
              onChange={(e) => setPermanentArea(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Area"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Country:</label>
            <input
              type="text"
              id="Country"
              onChange={(e) => setPermanentCountry(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Country"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">State:</label>
            <input
              type="text"
              id="State"
              onChange={(e) => setPermanentState(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="State"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="City">City:</label>
            <input
              type="text"
              id="City"
              onChange={(e) => setPermanentCity(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="City"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Pincode:</label>
            <input
              type="text"
              id="Pincode"
              onChange={(e) => setPermanentPincode(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Pincode"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="w-60 mt-2 p-2.5 text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
          onClick={() => handleUpdateAddressDetails()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddressInfo;
