import React, { useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";
import profile from "../Images/icons8-users-64.png";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
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
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
        <div className="p-4 rounded-lg mt-10">
          <div className="text-center text-4xl">
            <p>Student Profile</p>
          </div>

          <div className="mt-5 text-3xl bg-slate-500 text-white py-2">
            <p className="ml-5">Hi, Student Name</p>
          </div>

          <div className="h-36  ">
            <div className="flex flex-row">
              <img
                className="w-36 h-30 flex justify-center rounded-sm"
                src={profile}
                alt="Image 1"
              />
              <div className="ml-10 mt-5">Name:</div>
              <div className="ml-48 mt-5">Enrollment No:</div>
            </div>
          </div>

          <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full p-4">
            <div className="bg-slate-100 rounded-lg shadow-md w-full h-full flex flex-col">
              <div className="flex">
                <button
                  className={`${
                    activeTab === 1
                      ? " text-white bg-slate-600 "
                      : "border-2 border-b-slate-500 text-slate-500"
                  } px-4 py-2`}
                  onClick={() => handleTabClick(1)}
                >
                  Basic Information
                </button>
                <button
                  className={`${
                    activeTab === 2
                      ? " text-white bg-slate-600"
                      : "border-2 border-b-slate-500 text-slate-500"
                  } px-4 py-2`}
                  onClick={() => handleTabClick(2)}
                >
                  Address Details
                </button>
                <button
                  className={`${
                    activeTab === 3
                      ? " text-white bg-slate-600"
                      : "border-2 border-b-slate-500 text-slate-500"
                  } px-4 py-2`}
                  onClick={() => handleTabClick(3)}
                >
                  Parent Details
                </button>
              </div>
              <div className=" p-4">
                {activeTab === 1 && (
                  <div>
                    <ul className="text-xl justify-between">
                      <li>First Name</li>
                      <li>Middle Name</li>
                      <li>Last Name</li>
                      <li>Student Full Name</li>
                      <li>Gender</li>
                      <li>Father's Full Name</li>
                      <li>Mother's Full Name</li>
                    </ul>
                    <div className="mt-2">
                      <p className="bg-slate-600 py-2 p-5 text-white">
                        Personal Information
                      </p>
                    </div>
                    <ul className="text-xl mt-5">
                      <li>Date of Birth</li>
                      <li>Birth Place</li>
                      <li>Religion</li>
                      <li>Caste</li>
                      <li>Nationality</li>
                      <li>Mother Tongue</li>
                      <li>Marital Status</li>
                      <li>Blood Group</li>
                      <li>Are you physically Handicap?</li>
                    </ul>
                    <div className="mt-2">
                      <p className="bg-slate-600 py-2 p-5 text-white">
                        Contact Details
                      </p>
                    </div>
                    <ul className="text-xl justify-between mt-5">
                      <li>Mobile Number (Student)</li>
                      <li>Emergency Mobile Number</li>
                      <li>Residence Phone Number</li>
                      <li>Personal Email Address (Student)</li>
                      <li>Uni. Email Address (Student)</li>
                      <li>Father's Mobile Number</li>
                      <li>Father's Personal Email Id</li>
                      <li>Mother's Mobile Number</li>
                      <li>Mother's Personal Email Id</li>
                    </ul>
                  </div>
                )}
                {activeTab === 2 && (
                  <div>
                    <div className="mt-2">
                      <p className="bg-slate-600 py-2 p-5 text-white">
                        Current Address Details
                      </p>
                    </div>
                    <ul className="text-xl mt-5">
                      <li>Current Address 1</li>
                      <li>Current Address 2</li>
                      <li>Area</li>
                      <li>Country</li>
                      <li>State</li>
                      <li>City</li>
                      <li>Pincode</li>
                    </ul>
                    <div className="mt-2">
                      <p className="bg-slate-600 py-2 p-5 text-white">
                        Permanent Address Details
                      </p>
                    </div>
                    <ul className="text-xl justify-between mt-5">
                      <li>Permanent Address 1</li>
                      <li>Permanent Address 2</li>
                      <li>Area</li>
                      <li>Country</li>
                      <li>State</li>
                      <li>City</li>
                      <li>Pincode</li>
                    </ul>
                  </div>
                )}
                {activeTab === 3 && (
                  <div>
                    <div className="mt-2">
                      <p className="bg-slate-600 py-2 p-5 text-white">
                        Parent Details
                      </p>
                    </div>
                    <ul className="text-xl mt-5">
                      <li>Qualification of Father</li>
                      <li>Occupation of Father</li>
                      <li>Father Company Name</li>
                      <li>Father Designation</li>
                      <li>Father Office Address</li>
                      <li>Father Annual Income</li>
                      <li>Father Professional Email Id</li>
                      <hr className="border-b-1 border-slate-400 mt-2 mb-2" />
                      <li>Qualification of Mother</li>
                      <li>Occupation of Mother</li>
                      <li>Mother Company Name</li>
                      <li>Mother Designation</li>
                      <li>Mother Office Address</li>
                      <li>Mother Annual Income</li>
                      <li>Mother Professional Email Id</li>
                      <li>Date of Marriage</li>
                    </ul>
                    <div className="mt-2">
                      <p className="bg-slate-600 py-2 p-5 text-white">
                        Guardian Details
                      </p>
                    </div>
                    <ul className="text-xl mt-5">
                      <li>Guardian Full Name</li>
                      <li>Relation with Guardian</li>
                      <li>Guardian Mobile Number</li>
                      <li>Guardian Personal Email id</li>
                      <li>Guardian Professional Email id</li>
                      <li>Guardian Address 1</li>
                      <li>Guardian Address 2</li>
                      <li>Area</li>
                      <li>Country</li>
                      <li>State</li>
                      <li>City</li>
                      <li>Pincode</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
