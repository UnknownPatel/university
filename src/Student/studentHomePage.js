import React from "react";
import StudentNavbar from "./StudentNavbar";
import { useNavigate } from "react-router-dom";

const StudentHomePage = () => {
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
                className="flex items-center p-2 text-gray-900 bg-slate-600 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <p>Welcome</p>
          </div>

          <div class="flex flex-wrap">
            <div class="w-full  sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 p-4">
              <div class="bg-slate-100 rounded-lg shadow-md h-full flex flex-col">
                <img
                  class="w-full h-48 object-cover object-center"
                  src="image1.jpg"
                  alt="Image 1"
                />
                <div class="p-4 flex-grow">
                  <h2 class="text-lg font-semibold mb-2">Student Name</h2>
                  <p class="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <a href="#" class="text-blue-500 font-semibold mt-2">
                    More Details
                  </a>
                </div>
              </div>
            </div>

            <div class="w-full sm:w-full md:w-full lg:w-3/4 xl:w-3/4 p-4">
              <div class="bg-slate-100 rounded-lg shadow-md h-full flex flex-col"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;
