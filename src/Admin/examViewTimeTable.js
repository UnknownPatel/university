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
import { GiArchiveResearch } from "react-icons/gi";
import numberToWords from "number-to-words";

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
import { useNavigate } from "react-router-dom";

var access_token;
var subdomain;
var year;
var headers;

const ExamViewTimeTable = () => {
  const componentRef = useRef();
  const tableRef = useRef(null);
  const [faculty, setFaculty] = useState("");
  const [uniName, setUniName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [displayTimeTable, setDisplayTimeTable] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [storeDates, setStoreDates] = useState([]);
  const navigate = useNavigate();
  const [academic_years, setAcademicYears] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTimes, setExaminationTimes] = useState([]);
  const [type, setType] = useState("");
  const [hidden, setHidden] = useState(true);

  // View Variables
  const [branchesName, setBranchesName] = useState("");
  const [semesterName, setSemesterName] = useState("");
  const [selectedYear, setSelectedYear] = useState();
  const [examinationName, setExaminationName] = useState("");
  const [examinationType, setExaminationType] = useState("");
  const [examinationTime, setExaminationTime] = useState("");

  useEffect(() => {
    access_token = localStorage.getItem("access_token");
    const roles = localStorage.getItem("roles");

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
        .get(`/universities/${subdomain}/get_authorization_details`)
        .then((response) => {
          //   console.log(response.data.university.name);
          setUniName(response.data.university.name);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(headers);

      axios
        .get(`/users/users/find_user?subdomain=${subdomain}`, {
          headers,
        })
        .then((responce) => {
          // selectedFilter = responce.data.configuration;
          setFaculty(
            responce.data.user.first_name + " " + responce.data.user.last_name
          );
          setCourseId(responce.data.user.course_id);
          axios
            .get(
              `/branches?subdomain=${subdomain}&course_id=${responce.data.user.course_id}`,
              {
                headers,
              }
            )
            .then((response) => {
              setBranches(response.data.data.branches);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }

    axios
      .get("/examination_names", {
        headers,
        params: {
          subdomain: subdomain,
        },
      })
      .then((responce) => {
        if (responce.data.message === "Names found") {
          if (responce.data.data.examination_names.length !== 0) {
            setExaminationNames(responce.data.data.examination_names);
          } else {
            setExaminationNames([]);
          }
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });

    axios
      .get("/examination_types", {
        headers,
        params: {
          subdomain: subdomain,
        },
      })
      .then((responce) => {
        if (responce.data.message === "Types found") {
          if (responce.data.data.examination_types.length !== 0) {
            setExaminationTypes(responce.data.data.examination_types);
          } else {
            setExaminationTypes([]);
          }
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });

    axios
      .get("/examination_times", {
        headers,
        params: {
          subdomain: subdomain,
        },
      })
      .then((responce) => {
        if (responce.data.status === "ok") {
          if (responce.data.data.examination_times.length !== 0) {
            setExaminationTimes(responce.data.data.examination_times);
          } else {
            setExaminationTimes([]);
          }
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
    if (roles === null) {
      toast.error("Something went wrong, please Try Again!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, []);

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleExaminationChange = (examination) => {
    setHidden(true);
    setExaminationName(examination);
  };

  const handleYearChange = (date) => {
    setHidden(true);
    if (date !== "Select Year") {
      setSelectedYear(date);
    } else {
      setSelectedYear("");
    }
  };

  const handleTypeChange = (e) => {
    e.preventDefault();
    setHidden(true);
    if (e.target.value === "Select Type") {
      setType("");
    } else {
      setExaminationType(e.target.value);
      setType(e.target.value);
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    setHidden(true);
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
        .get(`/semesters?subdomain=${subdomain}&branch_id=${branch_id}`, {
          headers,
        })
        .then((response) => {
          setSemesters(response.data.data.semesters);
        })
        .catch((error) => console.log(error));

      axios
        .get(`/exam_time_tables/get_examination_dates`, {
          headers,
          params: {
            time_table: selectedFilter,
            subdomain: subdomain,
          },
        })
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

  const handleTimeChange = (e) => {
    e.preventDefault();
    setHidden(true);
    if (e.target.value === "Select time") {
      setTime("");
    } else {
      setExaminationTime(e.target.value);
      setTime(e.target.value);
    }
  };

  const handleSemesterChange = (e) => {
    e.preventDefault();
    setHidden(true);
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
      numberToWords.toOrdinal(
        e.target.options[selectedIndex].getAttribute("data-semester-name")
      ) + " Semester"
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
        .get(`/exam_time_tables/get_examination_dates`, {
          headers,
          params: {
            time_table: selectedFilter,
            subdomain: subdomain,
          },
        })
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
      } else {
        delete selectedFilter["branch_id"];
      }

      if (semesterId !== "") {
        selectedFilter["semester_id"] = semesterId;
      } else {
        delete selectedFilter["semester_id"];
      }

      if (type !== "" || type !== "Select Type") {
        selectedFilter["time_table_type"] = type;
      } else {
        delete selectedFilter["time_table_type"];
      }

      if (date !== "") {
        selectedFilter["date"] = date;
      } else {
        delete selectedFilter["date"];
      }

      if (time !== "") {
        selectedFilter["time"] = time;
      } else {
        delete selectedFilter["time"];
      }
    }

    console.log(selectedFilter);

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(`/exam_time_tables`, {
          headers,
          params: {
            subdomain: subdomain,
            time_table: selectedFilter,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.status == "ok") {
            if (res.data.data.time_tables.length !== 0) {
              setHidden(false);
              setDisplayTimeTable(res.data.data.time_tables);
            } else {
              setHidden(true);
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
    onBeforeGetContent: () => {
      const contentElement = componentRef.current;
      contentElement.classList.remove("overflow-y-scroll");
      contentElement.classList.remove("h-[60vh]");
    },
    content: () => componentRef.current,
    onAfterPrint: () => {
      const contentElement = componentRef.current;
      contentElement.classList.add("overflow-y-scroll");
      contentElement.classList.add("h-[60vh]");
    },
  });

  const handleSavePDF = () => {
    const contentElement = document.getElementById("time_table_viewport");
    contentElement.classList.remove("overflow-y-scroll");
    contentElement.classList.remove("h-[60vh]");

    html2pdf()
      .set({
        filename: "TimeTable.pdf",
        margin: [10, 10, 10, 10],
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(contentElement)
      .save()
      .then(() => {
        // PDF saving completed, add the class back
        contentElement.classList.add("overflow-y-scroll");
        contentElement.classList.add("h-[60vh]");
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      {localStorage.getItem("roles") !== null ? (
        access_token &&
        localStorage.getItem("roles").includes("Examination Controller") ? (
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
                          clipRule="evenodd"
                          fillRule="evenodd"
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
                          <span className="self-center text-xl mr-2 font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                            {faculty}
                          </span>
                          <span className="sr-only">Open user menu</span>
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
                      className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="ml-3">Enter Block Details</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/examAssignSupervision"
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        Assign Supervision
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/assignMarksEntry"
                      className="flex items-center p-2  text-gray-900  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        Assign Marks Entry
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/unlock_Marks"
                      className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="ml-3">Unlock Marks</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/examViewTimeTable"
                      className="flex items-center p-2 bg-slate-600 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="flex-1 ml-3 whitespace-nowrap">
                        Report
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/result"
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="ml-3">Result</span>
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
                <div className="text-center space-x-4 mt-2">
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
                    BlockWise Details
                  </a>
                  <a
                    className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
                    href="/examViewJrSupervision"
                  >
                    Jr.Supervision
                  </a>
                  <a
                    className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
                    href="/examViewSrSupervision"
                  >
                    Sr.Supervision
                  </a>
                  <a
                    className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
                    href="/examViewOtherDuty"
                  >
                    Other Duties
                  </a>
                </div>
                <div className="flex flex-col justify-start mt-5">
                  <div className="flex flex-row w-full mt-5 bg-white rounded-xl z-10">
                    <div className="flex flex-row">
                      <div className="relative text-left w-full">
                        <select
                          id="examinationName"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={(e) => {
                            handleExaminationChange(e.target.value);
                          }}
                        >
                          <option
                            value="Select Examination"
                            className="text-gray-600"
                          >
                            Examination
                          </option>
                          {examinationNames.map((examination_name) => {
                            return (
                              <option
                                value={examination_name.name}
                                className="text-black font-bold"
                              >
                                {examination_name.name}
                              </option>
                            );
                          })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2 10a8 8 0 018-8 8 8 0 110 16 8 8 0 01-8-8zm1 0a7 7 0 1014 0 7 7 0 00-14 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row">
                      <div className="relative text-left w-full">
                        <select
                          id="academicYear"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={(e) => handleYearChange(e.target.value)}
                        >
                          <option value="Select Year" className="text-gray-600">
                            Year
                          </option>
                          {academic_years.map((year) => {
                            return (
                              <option
                                value={year}
                                className="text-black font-bold"
                              >
                                {year}
                              </option>
                            );
                          })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2 10a8 8 0 018-8 8 8 0 110 16 8 8 0 01-8-8zm1 0a7 7 0 1014 0 7 7 0 00-14 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row">
                      <div className="relative text-left w-full">
                        <select
                          id="examinationType"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={handleTypeChange}
                        >
                          <option value="Select Type" className="text-gray-600">
                            Type
                          </option>
                          {examinationTypes.map((examination_type) => {
                            return (
                              <option
                                value={examination_type.name}
                                className="text-black font-bold"
                              >
                                {examination_type.name}
                              </option>
                            );
                          })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2 10a8 8 0 018-8 8 8 0 110 16 8 8 0 01-8-8zm1 0a7 7 0 1014 0 7 7 0 00-14 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row">
                      <div className="relative text-left w-full">
                        <select
                          id="time"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={(e) => handleTimeChange(e)}
                        >
                          <option value="Select time" className="text-gray-600">
                            Time
                          </option>
                          {examinationTimes.map((examination_time) => {
                            return (
                              <option
                                value={examination_time.name}
                                className="text-black font-bold"
                              >
                                {examination_time.name}
                              </option>
                            );
                          })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2 10a8 8 0 018-8 8 8 0 110 16 8 8 0 01-8-8zm1 0a7 7 0 1014 0 7 7 0 00-14 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row">
                      <div className="relative text-left w-full">
                        <select
                          id="branch"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={handleBranchChange}
                        >
                          <option
                            value="Select Branch"
                            className="text-gray-600"
                          >
                            Branch
                          </option>
                          {branches.map((branch) => (
                            <option
                              value={branch.id}
                              className="text-black font-bold"
                              data-name={branch.name}
                            >
                              {branch.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2 10a8 8 0 018-8 8 8 0 110 16 8 8 0 01-8-8zm1 0a7 7 0 1014 0 7 7 0 00-14 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row">
                      <div className="relative text-left w-full">
                        <select
                          id="branch"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={handleSemesterChange}
                        >
                          <option
                            value="Select Semester"
                            className="text-gray-600"
                          >
                            Semester
                          </option>
                          {semesters.map((semester) => (
                            <option
                              value={semester.id}
                              data-semester-name={semester.name}
                              className="text-black font-bold"
                            >
                              {semester.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2 10a8 8 0 018-8 8 8 0 110 16 8 8 0 01-8-8zm1 0a7 7 0 1014 0 7 7 0 00-14 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row">
                      <div className="relative text-left w-full">
                        <select
                          id="date"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={(e) => {
                            if (e.target.value !== "Select Date") {
                              setDate(e.target.value);
                            } else {
                              setDate("");
                            }
                          }}
                        >
                          <option value="Select Date" className="text-gray-600">
                            Date
                          </option>
                          {storeDates.map((date) => (
                            <option
                              value={date}
                              className="text-black font-bold"
                            >
                              {date}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M2 10a8 8 0 018-8 8 8 0 110 16 8 8 0 01-8-8zm1 0a7 7 0 1014 0 7 7 0 00-14 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row ml-2">
                      <button
                        id="submit-button"
                        className="ml-2 z-10 text-center w-auto bg-transparent text-slate-950 p-1 px-12 rounded-2xl tracking-wide border border-slate-950
                    font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-700 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                        onClick={handleFilterSubmit}
                      >
                        <div className="inline-flex">
                          Search <GiArchiveResearch className="mt-1 ml-2" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="time_table_viewport"
                className={`${
                  hidden ? "hidden" : "flex"
                } flex-col overflow-y-scroll mt-5 h-[69vh] max-h-fit`}
                ref={componentRef}
              >
                <div className="text-[15px] mb-5">
                  <p className="text-center">{uniName}</p>
                  <p className="text-center">
                    {examinationName} {selectedYear} {examinationType}
                  </p>
                  <p className="text-center">
                    {branchesName} {semesterName}
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
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap uppercase">
                                {time_table.date + " " + time_table.day}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {time_table.time}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-lg mt-10">
                      By. Exam Coordinator: ________________
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${hidden ? "hidden" : "flex"} justify-end mt-5`}>
                <a
                  href="#"
                  id="download_button"
                  onClick={handlePrint}
                  className={` ${
                    hidden ? "hidden" : "flex"
                  } text-center w-auto bg-transparent mr-2 text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-500 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300`}
                >
                  <FcPrint size={25} />
                </a>

                <a
                  href="#"
                  id="save_as_pdf"
                  onClick={handleSavePDF}
                  className={`${
                    hidden ? "hidden" : "flex"
                  } text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-500 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300`}
                >
                  <FcDownload size={25} />
                </a>
              </div>
            </div>
          </div>
        ) : (
          navigate(-1)
        )
      ) : (
        navigate("/")
      )}
    </div>
  );
};

export default ExamViewTimeTable;
