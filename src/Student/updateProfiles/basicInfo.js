import React, { useState } from "react";

const BasicInfo = () => {
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

  const handleUpdateBasicDetails = () => {};
  return (
    <div>
      <div className="">
        <p className="bg-slate-600 rounded-lg text-white py-2 px-5">
          Basic Details
        </p>
        <div className="flex mt-5">
          <div className="flex flex-col ml-3">
            <label htmlFor="">Father's Name:</label>
            <input
              type="text"
              id="Father-Full Name"
              onChange={(e) => setFatherFullName(e.target.value)}
              className="bg-gray-50 w-80 border text-gray-900 text-sm rounded-lg block pl-5 p-2.5 border-gray-600 "
              placeholder="Father's Name"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Mother's Name:</label>
            <input
              type="text"
              id="Mother-Full Name"
              onChange={(e) => setMotherFullName(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Mother's Full Name"
            />
          </div>
        </div>
        <div className="flex mt-2 ml-3">
          <div className="flex flex-col">
            <label htmlFor="">Date Of Birth:</label>
            <input
              type="date"
              id="DOB"
              onChange={(e) => setDob(e.target.value)}
              className="bg-gray-50 w-80 border text-gray-900 text-sm rounded-lg block pl-5 p-2.5 border-gray-600 "
              placeholder="Date of Birth"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Birth Place:</label>
            <input
              type="text"
              id="BirthPlace"
              onChange={(e) => setBirthPlace(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Birth Place"
            />
          </div>
        </div>
        <div className="flex mt-2 ml-3">
          <div className="flex flex-col">
            <label htmlFor="">Religion:</label>
            <input
              type="text"
              id="Religion"
              onChange={(e) => setReligion(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Religion"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Caste:</label>
            <input
              type="text"
              id="Caste"
              onChange={(e) => setCaste(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Caste"
            />
          </div>
        </div>
        <div className="flex mt-2 ml-3">
          <div className="flex flex-col">
            <label htmlFor="">Nationality:</label>
            <input
              type="text"
              id="Nationality"
              onChange={(e) => setNationality(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Nationality"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Mother Tongue:</label>
            <input
              type="text"
              id="Mother Tongue"
              onChange={(e) => setMotherTongue(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Mother Tongue"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col ml-3">
            <label htmlFor="">Marital Status:</label>
            <input
              type="text"
              id="Marital Status"
              onChange={(e) => setMaritalStatus(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Marital Status"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Blood Group:</label>
            <input
              type="text"
              id="Blood Group"
              onChange={(e) => setBloodGroup(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Blood Group"
            />
          </div>
        </div>
        <div className="flex justify-center mt-2">
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
      <div className="flex justify-center">
        <button
          className="w-60  mt-2 p-2.5 text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
          onClick={() => handleUpdateBasicDetails()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default BasicInfo;
