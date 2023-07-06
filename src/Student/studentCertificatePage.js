import React from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";

const StudentCertificatePage = () => {
  const navigate = useNavigate();

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
                className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                href="/StudentSyllabusView"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Download Receipt</span>
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
                className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Certificate</span>
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

      <div className="pt-4 sm:ml-64">
        <div className="p-4 rounded-lg mt-14">
          <div className="text-center text-4xl">
            <p>Request For Certificate</p>
          </div>
          <div className="mt-5">
            <select className=" form-select rounded justify-center text-sm md:text-base lg:text-base ml-3 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto">
              <option value="">--- Select Certificate Type ---</option>
              <option value="">Type 1</option>
              <option value="">Type 2</option>
            </select>
            <select className=" form-select rounded justify-center text-sm md:text-base lg:text-base ml-3 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto">
              <option value="">--- Select No. of copies ---</option>
              <option value="">1</option>
              <option value="">2</option>
            </select>
          </div>
          <div className="mt-5">
            <label htmlFor="">Reason:-</label>
            <input
              type="text"
              name="reason"
              id="reason"
              placeholder="Reason for Certificate"
              className="h-10 border-0 border-b-2 border-b-gray-700 mt-1 mr-10 rounded px-4 bg-gray-50"
            />
            fees:-{}
          </div>
          <div className="mt-5">
            <button className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded">
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificatePage;
