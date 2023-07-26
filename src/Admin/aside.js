import { logDOM } from "@testing-library/react";
import React from "react";
import { useNavigate } from "react-router-dom";


const Aside = () => {
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
    <div>
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <a
              href="/examinationDetails"
              className={`${className("examinationDetails")}`}
            >
              <span className="ml-3">Examination Details</span>
            </a>
          </li>
          <li>
            <a
              href="/examTimetable"
              className={`${className("examTimeTable")}`}
            >
              <span className="ml-3">Time Table</span>
            </a>
          </li>

          <li>
            <a
              href="/examBlockDetails"
              className={`${className("examBlockDetails")}`}
            >
              <span className="ml-3">Enter Block Details</span>
            </a>
          </li>
          <li>
            <a
              href="/examAssignSupervision"
              className={`${className("examAssignSupervision")}`}
            >
              <span className="flex-1 ml-3 whitespace-nowrap">
                Assign Supervision
              </span>
            </a>
          </li>
          <li>
            <a
              href="/assignMarksEntry"
              className={`${className("assignMarksEntry")}`}
            >
              <span className="flex-1 ml-3 whitespace-nowrap">
                Assign Marks Entry
              </span>
            </a>
          </li>
          <li>
            <a
              href="/unlock_Marks"
              className={`${className("unlock_Marks")}`}
            >
              <span className="ml-3">Unlock Marks</span>
            </a>
          </li>
          <li>
            <a
              href="/examViewTimeTable"
              className={`${className("examView")}`}
            >
              <span className="flex-1 ml-3 whitespace-nowrap">Report</span>
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
    </div>
  );
};

export default Aside;
