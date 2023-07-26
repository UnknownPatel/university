import React from "react";
import { useState } from "react";

const ParentInfo = () => {
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

  const handleUpdateParentDetails = () => {};

  return (
    <div>
      <div className=" w-full">
        <p className="bg-slate-600 rounded-lg text-white py-2 px-5">
          Parent Details
        </p>
        <div className="flex mt-5 ">
          <div className="flex flex-col">
            <label htmlFor="">Qualification of Father:</label>
            <input
              type="text"
              id="Qualification-of-Father"
              onChange={(e) => setFatherQualification(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Qualification of Father"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Occupation of Father:</label>
            <input
              type="text"
              id="Occupation-of-Father"
              onChange={(e) => setFatherOccupation(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Occupation of Father"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col">
            <label htmlFor="">Father Company Name:</label>
            <input
              type="text"
              id="Father-Company-Name"
              onChange={(e) => setFatherCompanyName(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Father Company Name"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Father Designation</label>
            <input
              type="text"
              id="Father-Designation"
              onChange={(e) => setFatherDesignation(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Father Designation"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col">
            <label htmlFor="">Father Office Address:</label>
            <input
              type="text"
              id="Father-Office-Address"
              onChange={(e) => setFatherOfficeAddress(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Father Office Address"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Father Annual Income:</label>
            <input
              type="text"
              id="Father-Annual-Income"
              onChange={(e) => setFatherAnnualIncome(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Father Annual Income"
            />
          </div>
        </div>
        <div className="flex  mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Father Professional Email Id:</label>
            <input
              type="text"
              id="Father Professional Email Id"
              onChange={(e) => setFatherProfessionalEmail(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Father Professional Email Id"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col">
            <label htmlFor="">Qualification of Mother:</label>
            <input
              type="text"
              id="Qualification-of-Mother"
              onChange={(e) => setMotherQualification(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Qualification of Mother"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Occupation of Mother:</label>
            <input
              type="text"
              id="Occupation-of-Mother"
              onChange={(e) => setMotherOccupation(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Occupation of Mother"
            />
          </div>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-col">
            <label htmlFor="">Mother Company Name:</label>
            <input
              type="text"
              id="Mother-Company-Name"
              onChange={(e) => setMotherCompanyName(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Mother Company Name"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Mother Designation:</label>
            <input
              type="text"
              id="Mother-Designation"
              onChange={(e) => setMotherDesignation(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Mother Designation"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Mother Office Address:</label>
            <input
              type="text"
              id="Mother-Office-Address"
              onChange={(e) => setMotherOfficeAddress(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Mother Office Address"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Mother Annual Income:</label>
            <input
              type="text"
              id="Mother-Annual-Income"
              onChange={(e) => setMotherAnnualIncome(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Mother Annual Income"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <label htmlFor="">Mother Professional EmailId:</label>
            <input
              type="text"
              id="Mother-Professional-EmailId"
              onChange={(e) => setMotherProfessionalEmail(e.target.value)}
              className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Mother Professional EmailId"
            />
          </div>
          <div className="flex flex-col ml-16">
            <label htmlFor="">Date of Marriage:</label>
            <input
              type="text"
              id="Date-of-Marriage"
              onChange={(e) => setDateOfMarriage(e.target.value)}
              className="bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-80 pl-5 p-2.5 border-gray-600 "
              placeholder="Date of Marriage"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="w-60 mt-5 p-2.5 text-white bg-slate-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
          onClick={() => handleUpdateParentDetails()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ParentInfo;
