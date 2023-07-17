import React, { useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";

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

          <div className="flex">
            <button
              className={`${
                activeTab === 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-t`}
              onClick={() => handleTabClick(1)}
            >
              Tab 1
            </button>
            <button
              className={`${
                activeTab === 2
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } px-4 py-2`}
              onClick={() => handleTabClick(2)}
            >
              Tab 2
            </button>
            <button
              className={`${
                activeTab === 3
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-t`}
              onClick={() => handleTabClick(3)}
            >
              Tab 3
            </button>
          </div>
          <div className="bg-gray-200 p-4">
            {activeTab === 1 && <div>Content for Tab 1</div>}
            {activeTab === 2 && <div>Content for Tab 2</div>}
            {activeTab === 3 && <div>Content for Tab 3</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
