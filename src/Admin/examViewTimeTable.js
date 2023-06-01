import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import { FcCheckmark } from "react-icons/fc";
import { FcDownload } from "react-icons/fc";
import { FcPrint } from "react-icons/fc";

import { useReactToPrint } from "react-to-print";
import { saveAs } from "file-saver";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import html2pdf from "html2pdf.js";


var access_token;
var subdomain;
var year;
var headers;

const ExamViewTimeTable = () => {
  const componentRef = useRef();
  const tableRef = useRef(null);
  const [uniName, setUniName] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [branchesName, setBranchesName] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [semesterName, setSemesterName] = useState("");
  const [selectedYear, setSelectedYear] = useState();
  const [examinationName, setExaminationName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [displayTimeTable, setDisplayTimeTable] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [storeDates, setStoreDates] = useState([]);
  const [removeOverFlow, setRemoveOverflow] = useState(false);
  var divStyle = {
    height: "400px",
    overflowY: "auto",
  };

  useEffect(() => {
    access_token = localStorage.getItem("access_token");
    year = new Date().getFullYear();
    setAcademicYears(
      Array.from(
        new Array(20),
        (val, index) => year - (index + 1) + " - " + (year - index)
      )
    );
    headers = { Authorization: `Bearer ${access_token}` };

    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/universities/${subdomain}/get_authorization_details`
        )
        .then((response) => {
          //   console.log(response.data.university.name);
          setUniName(response.data.university.name);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(headers);
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/courses?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setCourses(response.data.data.courses);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleExaminationChange = (examination) => {
    setExaminationName(examination);
  };

  const handleYearChange = (date) => {
    if (date !== "Select Year") {
      setSelectedYear(date);
    } else {
      setSelectedYear("");
    }
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
    var selectedFilter = {};
    setStoreDates([]);
    if (examinationName !== "Select Examination") {
      selectedFilter["name"] = examinationName;
    }

    if (selectedYear !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear;
    }

    if (e.target.value !== "Select Course") {
      selectedFilter["course_id"] = e.target.value;
    }

    console.log(selectedFilter);
    setCourseId(e.target.value);
    var course_id = e.target.value;
    access_token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${access_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/branches?subdomain=${subdomain}&course_id=${course_id}`,
          { headers }
        )
        .then((response) => {
          setBranches(response.data.data.branches);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates`,
          {
            headers,
            params: {
              time_table: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Examination dates are as below") {
            if (response.data.data.dates.length !== 0) {
              setStoreDates(response.data.data.dates);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    var selectedFilter = {};
    setStoreDates([]);

    if (examinationName !== "Select Examination") {
      selectedFilter["name"] = examinationName;
    }

    if (selectedYear !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear;
    }

    if (courseId !== "Select Course") {
      selectedFilter["course_id"] = courseId;
    }

    if (e.target.value !== "Select Branch") {
      selectedFilter["branch_id"] = e.target.value;
    }

    console.log(selectedFilter);
    var selectedIndex = e.target.options.selectedIndex;
    setBranchesName(e.target.options[selectedIndex].getAttribute("data-name"));
    var branch_id = e.target.value;
    if (branch_id === "Select Branch") {
      setBranchId("");
      setSemesterId("");
    } else {
      setBranchId(e.target.value);
    }
    access_token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${access_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/semesters?subdomain=${subdomain}&branch_id=${branch_id}`,
          { headers }
        )
        .then((response) => {
          setSemesters(response.data.data.semesters);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates`,
          {
            headers,
            params: {
              time_table: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Examination dates are as below") {
            if (response.data.data.dates.length !== 0) {
              setStoreDates(response.data.data.dates);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSemesterChange = (e) => {
    e.preventDefault();
    var selectedFilter = {};
    setStoreDates([]);

    if (examinationName !== "Select Examination") {
      selectedFilter["name"] = examinationName;
    }

    if (selectedYear !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear;
    }

    if (courseId !== "Select Course") {
      selectedFilter["course_id"] = courseId;
    }

    if (courseId !== "Select Branch") {
      selectedFilter["branch_id"] = branchId;
    }

    if (e.target.value === "Select Semester") {
      setSemesterId("");
    } else {
      selectedFilter["semester_id"] = e.target.value;
      setSemesterId(e.target.value);
    }
    var selectedIndex = e.target.options.selectedIndex;
    setSemesterName(
      "Semester : " +
        e.target.options[selectedIndex].getAttribute("data-semester-name")
    );
    access_token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${access_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates`,
          {
            headers,
            params: {
              time_table: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Examination dates are as below") {
            if (response.data.data.dates.length !== 0) {
              setStoreDates(response.data.data.dates);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleFilterSubmit = (e) => {
    let selectedFilter = {};

    if (examinationName === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "" || courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        name: examinationName,
        academic_year: selectedYear,
        course_id: courseId,
      };

      if (branchId !== "") {
        selectedFilter["branch_id"] = branchId;
      }

      if (semesterId !== "") {
        selectedFilter["semester_id"] = semesterId;
      }

      if (date !== "") {
        selectedFilter["date"] = date;
      }

      if (time !== "") {
        selectedFilter["time"] = time;
      }
    }

    console.log(selectedFilter);

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables`,
          {
            headers,
            params: {
              subdomain: subdomain,
              time_table: selectedFilter,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.status == "ok") {
            const time_table_viewport = document.getElementById(
              "time_table_viewport"
            );
            const download_button = document.getElementById("download_button");
            const save_as_pdf = document.getElementById("save_as_pdf");
            if (res.data.data.time_tables.length !== 0) {
              download_button.classList.remove("hidden");
              save_as_pdf.classList.remove("hidden");
              time_table_viewport.classList.remove("hidden");
              time_table_viewport.classList.add("flex");
              setDisplayTimeTable(res.data.data.time_tables);
            } else {
              toast.error("NO TimeTable found for the selected Filters", {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleSavePDF = () => {
    const contentElement = document.getElementById("time_table_viewport");
    contentElement.style = {};

    html2pdf()
      .set({
        filename: "TimeTable.pdf",
        margin: [10, 10, 10, 10],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(contentElement)
      .save();

    divStyle = {
      height: "400px",
      overflowY: "auto",
    };
  };

  return (
    <div>
      <div>
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <button
                  data-drawer-target="logo-sidebar"
                  data-drawer-toggle="logo-sidebar"
                  aria-controls="logo-sidebar"
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                  </svg>
                </button>
                <a href="" className="flex ml-2 md:mr-24">
                  <img src="" className="h-8 mr-3" alt="Logo" />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    {uniName}
                  </span>
                </a>
              </div>
              <div className="flex items-center">
                <div className="flex items-center ml-3">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      aria-expanded="false"
                      data-dropdown-toggle="dropdown-user"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src=""
                        alt="user photo"
                      />
                    </button>
                  </div>
                  <div
                    className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                    id="dropdown-user"
                  >
                    <div className="px-4 py-3" role="none">
                      <p
                        className="text-sm text-gray-900 dark:text-white"
                        role="none"
                      ></p>
                      <p
                        className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                        role="none"
                      ></p>
                    </div>
                    <ul className="py-1" role="none">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        ></a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        ></a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        ></a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        ></a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <aside
          id="logo-sidebar"
          className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
            <li>
                <a
                  href="/examinationDetails"
                  className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="ml-3">Examination Details</span>
                </a>
              </li>
              <li>
                <a
                  href="/examTimetable"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="ml-3">Time Table</span>
                </a>
              </li>
              
              <li>
                <a
                  href="/examBlockDetails"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="ml-3">Enter Block Details</span>
                </a>
              </li>
              <li>
                <a
                  href="/examAssignSupervision"
                  className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Assign Supervision
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/assignMarksEntry"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Assign Marks Entry
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/examViewTimeTable"
                  className="flex items-center p-2 text-gray-900 bg-slate-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">Report</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <div className="pt-4 sm:ml-64">
          <div className="flex flex-col items-center mt-14">
            <div className="flex items-center space-x-4 mb-5">
              <a
                className={`text-white font-bold py-2 px-4 rounded-lg bg-slate-800`}
                href="/examViewTimeTable"
              >
                Time Table
              </a>
              <a
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
                href="/examViewBlockDetails"
              >
                Blockwise Report
              </a>
              <a
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
                href="/examViewJrSupervision"
              >
                Jr.Supervisor Tab
              </a>
              <a
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
                href="/examViewSrSupervision"
              >
                Sr.Supervisor Tab
              </a>
              <a
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
                href="/examViewOtherDuty"
              >
                Other Duties
              </a>
            </div>
          </div>

          <div className="flex mt-5 ml-2">
            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={(e) => {
                handleExaminationChange(e.target.value);
              }}
            >
              <option>Select Examination</option>
              <option value="Winter">Winter</option>
              <option value="Summer">Summer</option>
            </select>

            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="Select Year">Select Year</option>
              {academic_years.map((year) => {
                return <option value={year}>{year}</option>;
              })}
            </select>
            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={handleCourseChange}
            >
              <option>Select course</option>
              {courses.map((course, index) => (
                <option value={course.id}>{course.name}</option>
              ))}
            </select>
            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={(e) => {
                handleBranchChange(e);
              }}
            >
              <option>Select Branch</option>
              {branches.map((branch) => (
                <option value={branch.id} data-name={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={handleSemesterChange}
            >
              <option>Select Semester</option>
              {semesters.map((semester) => (
                <option value={semester.id} data-semester-name={semester.name}>
                  {semester.name}
                </option>
              ))}
            </select>

            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={(e) => {
                if (e.target.value !== "Select Date") {
                  setDate(e.target.value);
                } else {
                  setDate("");
                }
              }}
            >
              <option>Select Date</option>
              {storeDates.map((date) => (
                <option value={date}>{date}</option>
              ))}
            </select>

            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={(e) => {
                if (e.target.value !== "Select time") {
                  setTime(e.target.value);
                } else {
                  setTime("");
                }
              }}
              // selected={}
            >
              <option value="">Select time</option>
              <option value="morning">10:30 A.M to 01:00 P.M</option>
              <option value="evening">03:00 P.M to 05:30 P.M</option>
            </select>
          </div>
          <div className="flex justify-center mt-5">
            <button
              className="py-2 px-3 mr-7 bg-gray-800 rounded-2xl text-white font-bold"
              onClick={handleFilterSubmit}
            >
              Submit
            </button>
            <a
              href="#"
              id="download_button"
              onClick={handlePrint}
              className="hidden py-2 px-3 mt-1 bg-blue-200 rounded-2xl text-white font-bold"
            >
              <FcPrint />
            </a>

            <a
              href="#"
              id="save_as_pdf"
              onClick={handleSavePDF}
              className="hidden py-2 px-3 ml-2 mt-1 bg-blue-200 rounded-2xl text-white font-bold"
            >
              <FcDownload />
            </a>
          </div>
          <div
            id="time_table_viewport"
            className="hidden flex-col mt-5"
            ref={componentRef}
            style={divStyle}
          >
            <div className="">
              <p className="text-center">{uniName}</p>
              <p className="text-center">
                {branchesName} {semesterName}
              </p>
              <p className="text-center">
                {examinationName} {selectedYear} Examination Time Table
              </p>
            </div>
            <div ref={tableRef} id="table-viewport" className="">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table className="min-w-full table-fixed divide-y divide-gray-200">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                          Subject Name
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                          Subject Code
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                          Day And Date
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                          Time
                        </th>
                        {/* <th className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
                          Action
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayTimeTable.map((time_table) => (
                        <tr>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                            {time_table.subject_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {time_table.subject_code}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {time_table.date + " " + time_table.day}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {time_table.time}
                          </td>

                          {/* <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <button
                            className="text-red-500 hover:text-red-700"
                            href="#"
                            // onClick={handleRemoveRole}
                          >Remove</button>
                        </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-evenly text-center mt-10"></div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExamViewTimeTable;
