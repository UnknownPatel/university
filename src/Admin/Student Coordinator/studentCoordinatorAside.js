import React from 'react'
import { useNavigate } from 'react-router-dom';

const StudentCoordinatorAside = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const className = (href) => {
    if(window.location.href.includes(href)){
      return "flex items-center p-2 bg-slate-600 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
    } else {
      return "flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
    }
  }

  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/studentDetails"
                className={`${className('studentDetails')}`}
              >
                <span className="ml-3">Students Details</span>
              </a>
            </li>
            <li>
              <a
                href="/feeDetails"
                className={`${className('feeDetails')}`}
              >
                <span className="ml-3">Fee Details</span>
              </a>
            </li>
            <li>
              <a
                href="/createCertificate"
                className={`${className('createCertificate')}`}
              >
                <span className="ml-3">Create Certificate</span>
              </a>
            </li>
            <li>
              <a
                href="/certificateRequest"
                className={`${className('certificateRequest')}`}
              >
                <span className="ml-3">Certificate Request</span>
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
    </>
  )
}

export default StudentCoordinatorAside
