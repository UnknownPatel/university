import React, { useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";
import BasicDetailsModal from "../Admin/Student Coordinator/modals/basicDetailsModal";
import AddressDetailsModal from "../Admin/Student Coordinator/modals/addressDetailsModal";
import { toast } from "react-toastify";
import BasicInfo from "./updateProfiles/basicInfo";
import AddressInfo from "./updateProfiles/addressInfo";
import ContactInfo from "./updateProfiles/contactInfo";
import ParentInfo from "./updateProfiles/parentInfo";
import GuardianInfo from "./updateProfiles/guardianInfo";

var acces_token;
var headers;
var subdomain;

const UpdateProfile = () => {
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();

  //
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

  const [selectedTable, setSelectedTable] = useState(1);

  const handleTableClick = (id) => {
    setSelectedTable(id);
  };

  const handleUpdateBasicDetails = () => {};
  const handleOptionChange = (event) => {
    setIsPhysicallyHandicap(event.target.value === "true");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div>
      <StudentNavbar />
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/StudentHomePage"
                className="flex items-center p-2 text-gray-900 rounded-lg   dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Home</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Pay Fees</span>
              </a>
            </li>
            <li>
              <a
                href="/feeReceipt"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Fee Receipt</span>
              </a>
            </li>
            <li>
              <a
                href="/StudentSyllabusView"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Syllabus</span>
              </a>
            </li>
            <li>
              <a
                href="/StudentCertificatePage"
                className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Certificate</span>
              </a>
            </li>
            <li>
              <a
                href="/certificateTracking"
                className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Certificate Tracking</span>
              </a>
            </li>
            <li>
              <a
                href="/UpdateProfile"
                className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Update Profile</span>
              </a>
            </li>
            <li>
              <div className="p-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                  onClick={handleLogout}
                >
                  <span className="">Logout</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 rounded-lg mt-14">
          <div className="text-center text-5xl">
            <p>Update Profile</p>
          </div>

          <div className="mt-5">
            <div className="bg-slate-100 rounded-lg shadow-md flex flex-col">
              <div className="w-screen-xl ml-5 mt-5">
                <div className="flex">
                  <div className="">
                    <ul className="w-36 p-2">
                      <li
                        onClick={() => handleTableClick(1)}
                        className={`cursor-pointer py-2 px-2 ${
                          selectedTable === 1
                            ? "bg-slate-600 rounded-lg text-white"
                            : "hover:bg-gray-300 hover:rounded-lg"
                        } transition-colors`}
                      >
                        Basic Information
                      </li>
                      <li
                        onClick={() => handleTableClick(2)}
                        className={`cursor-pointer py-2 px-2 ${
                          selectedTable === 2
                            ? "bg-slate-600 rounded-lg text-white"
                            : "hover:bg-gray-300 hover:rounded-lg"
                        } transition-colors`}
                      >
                        Address Details
                      </li>
                      <li
                        onClick={() => handleTableClick(3)}
                        className={`cursor-pointer py-2 px-2 ${
                          selectedTable === 3
                            ? "bg-slate-600 rounded-lg text-white"
                            : "hover:bg-gray-300 hover:rounded-lg"
                        } transition-colors`}
                      >
                        Contact Details
                      </li>
                      <li
                        onClick={() => handleTableClick(4)}
                        className={`cursor-pointer py-2 px-2 ${
                          selectedTable === 4
                            ? "bg-slate-600 rounded-lg text-white"
                            : "hover:bg-gray-300 hover:rounded-lg"
                        } transition-colors`}
                      >
                        Parent Details
                      </li>
                      <li
                        onClick={() => handleTableClick(5)}
                        className={`cursor-pointer py-2 px-2 ${
                          selectedTable === 5
                            ? "bg-slate-600 rounded-lg text-white"
                            : "hover:bg-gray-300 hover:rounded-lg"
                        } transition-colors`}
                      >
                        Guardian Details
                      </li>
                    </ul>
                  </div>
                  <div className="w-full px-4">
                    {selectedTable === 1 && (
                      <div
                        key={1}
                        className="p-4 border-l-2 border-gray-300 mb-4"
                      >
                        <BasicInfo />
                      </div>
                    )}
                    {selectedTable === 2 && (
                      <div
                        key={2}
                        className="p-4 border-l-2 border-gray-300 mb-4"
                      >
                        <AddressInfo />
                      </div>
                    )}
                    {selectedTable === 3 && (
                      <div
                        key={3}
                        className="p-4 border-l-2 border-gray-300 mb-4"
                      >
                        <ContactInfo />
                      </div>
                    )}
                    {selectedTable === 4 && (
                      <div
                        key={4}
                        className="p-4 border-l-2 border-gray-300 mb-4"
                      >
                        <ParentInfo />
                      </div>
                    )}
                    {selectedTable === 5 && (
                      <div
                        key={5}
                        className="p-4 border-l-2 border-gray-300 mb-4"
                      >
                        <GuardianInfo />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
