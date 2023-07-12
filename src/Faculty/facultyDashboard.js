import React from "react";
import FacultyNavBar from "./facultyNavBar";
import { useNavigate } from "react-router";

var acces_token = localStorage.getItem("access_token");
var headers = { Authorization: `Bearer ${acces_token}` };
var roles = localStorage.getItem("roles");

const FacultyDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div>
      <FacultyNavBar />
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/facultyDashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="flex-1 ml-3 whitespace-nowrap">Home</span>
              </a>
            </li>
            {roles.includes("Examination Controller") ? (
              <li>
                <a
                  href="/examinationDetails"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    ExamController Dashboard
                  </span>
                </a>
              </li>
            ) : null}
            {roles.includes("Academic Head") ? (
              <li>
                <a
                  href="/academic_UploadSyllabus"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Academic Head
                  </span>
                </a>
              </li>
            ) : null}
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
            <p>Welcome</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
