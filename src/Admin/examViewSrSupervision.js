import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import * as XLSX from "xlsx";
import { FcCheckmark } from "react-icons/fc";
import { FcDownload } from "react-icons/fc";
import { GiArchiveResearch } from "react-icons/gi";

import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { SiMicrosoftexcel } from "react-icons/si";

var acces_token;
var subdomain;
var headers;

const ExamViewSrSupervision = () => {
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedYear4, setSelectedYear4] = useState();
  const [examinationName4, setExaminationName4] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [branchesName, setBranchesName] = useState("");
  const [srSupervisionTable, setSrSupervisionTable] = useState([]);
  const [subjectDates, setSubjectDates] = useState([]);
  const [storeDates, setStoreDates] = useState([]);
  const navigate = useNavigate();
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [examinationTimes, setExaminationTimes] = useState([]);
  const [type, setType] = useState("");
  const [hidden, setHidden] = useState(true);

  const componentRef4 = useRef();
  var year;

  useEffect(() => {
    acces_token = localStorage.getItem("access_token");
    const roles = localStorage.getItem("roles");

    year = new Date().getFullYear();
    setAcademicYears(
      Array.from(
        new Array(20),
        (val, index) => year - (index + 1) + " - " + (year - index)
      )
    );
    headers = { Authorization: `Bearer ${acces_token}` };
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

      axios
        .get(`/users/users/find_user?subdomain=${subdomain}`, {
          headers,
        })
        .then((responce) => {
          // selectedFilter = responce.data.configuration;
          setFaculty(
            responce.data.user.first_name + " " + responce.data.user.last_name
          );
          setCourseId(responce.data.user.cource_id);
          axios
            .get(`/branches`, {
              headers,
              params: {
                subdomain: subdomain,
                course_id: responce.data.user.course_id,
              },
            })
            .then((response) => {
              setBranches(response.data.data.branches);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));

      // Examination Names API
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

      // Examination Types API
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
    }
    if (roles === null) {
      toast.error("Something went wrong, please Try Again!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, []);

  const handleExaminationChange4 = (examination) => {
    setHidden(true);
    setExaminationName4(examination);
  };

  const handleYearChange4 = (date) => {
    setHidden(true);
    if (date !== "Select Year") {
      setSelectedYear4(date);
    } else {
      setSelectedYear4("");
    }
  };

  const handleSrTypeChange = (e) => {
    e.preventDefault();
    setStoreDates([]);
    setDate("");
    setHidden(true);
    let selectedFilter = {};
    examinationName4 !== "" || examinationName4 !== "Select Examination"
      ? (selectedFilter["name"] = examinationName4)
      : delete selectedFilter["name"];
    selectedYear4 !== "" || selectedYear4 !== "Select Year"
      ? (selectedFilter["academic_year"] = selectedYear4)
      : delete selectedFilter["academic_year"];
    courseId !== ""
      ? (selectedFilter["course_id"] = courseId)
      : delete selectedFilter["course_id"];
    branchId !== ""
      ? (selectedFilter["branch_id"] = branchId)
      : delete selectedFilter["branch_id"];
    time !== ""
      ? (selectedFilter["time"] = time)
      : delete selectedFilter["time"];
    if (e.target.value === "Select Type") {
      setType("");
    } else {
      selectedFilter["time_table_type"] = e.target.value;
      setType(e.target.value);

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
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    setBranchId("");
    setBranchesName("");
    var selectedFilter = {};
    setStoreDates([]);
    setDate("");
    setHidden(true);
    examinationName4 !== "" || examinationName4 !== "Select Examination"
      ? (selectedFilter["name"] = examinationName4)
      : delete selectedFilter["name"];
    selectedYear4 !== "" || selectedYear4 !== "Select Year"
      ? (selectedFilter["academic_year"] = selectedYear4)
      : delete selectedFilter["academic_year"];
    courseId !== ""
      ? (selectedFilter["course_id"] = courseId)
      : delete selectedFilter["course_id"];
    type !== ""
      ? (selectedFilter["time_table_type"] = type)
      : delete selectedFilter["time_table_type"];
    time !== ""
      ? (selectedFilter["time"] = time)
      : delete selectedFilter["time"];

    if (e.target.value !== "Select Branch") {
      var selectedIndex = e.target.options.selectedIndex;
      setBranchesName(
        e.target.options[selectedIndex].getAttribute("data-name")
      );
      selectedFilter["branch_id"] = e.target.value;
      setBranchId(e.target.value);
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
    }
  };

  const handleTimeChange = (e) => {
    e.preventDefault();
    setDate("");
    setStoreDates([]);
    setHidden(true);
    var selectedFilter = {};
    examinationName4 !== "" || examinationName4 !== "Select Examination"
      ? (selectedFilter["name"] = examinationName4)
      : delete selectedFilter["name"];
    selectedYear4 !== "" || selectedYear4 !== "Select Year"
      ? (selectedFilter["academic_year"] = selectedYear4)
      : delete selectedFilter["academic_year"];
    courseId !== ""
      ? (selectedFilter["course_id"] = courseId)
      : delete selectedFilter["course_id"];
    branchId !== ""
      ? (selectedFilter["branchId"] = branchId)
      : delete selectedFilter["branch_id"];
    type !== ""
      ? (selectedFilter["time_table_type"] = type)
      : delete selectedFilter["time_table_type"];

    if (e.target.value !== "Select time") {
      setTime(e.target.value);
      selectedFilter["time"] = e.target.value;
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
    } else {
      setTime("");
    }
  };

  const handleDateChange = (e) => {
    e.preventDefault();
    setHidden(true);
    if (e.target.value !== "Select Date") {
      setDate(e.target.value);
    } else {
      setDate("");
    }
  };

  const handleFilterSubmit = (e) => {
    let selectedFilter = {};
    let timeTableFilter = {};

    if (examinationName4 === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear4 === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (type === "Select Type" || type === "") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "" || courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (time === "" || time === "Select time") {
      toast.error("Please select time");
    } else {
      selectedFilter = {
        examination_name: examinationName4,
        course_id: courseId,
        list_type: "Senior",
      };

      timeTableFilter = {
        name: examinationName4,
        academic_year: selectedYear4,
        course_id: courseId,
      };

      if (branchId !== "") {
        selectedFilter["branch_id"] = branchId;
        timeTableFilter["branch_id"] = branchId;
      } else {
        delete selectedFilter["branch_id"];
        delete timeTableFilter["branch_id"];
      }

      if (date !== "") {
        selectedFilter["date"] = date;
        timeTableFilter["date"] = date;
      } else {
        delete selectedFilter["date"];
        delete timeTableFilter["date"];
      }

      if (time !== "") {
        selectedFilter["time"] = time;
        timeTableFilter["time"] = time;
      } else {
        delete selectedFilter["time"];
        delete timeTableFilter["time"];
      }

      if (subdomain !== null || subdomain !== "") {
        axios
          .get(`/supervisions`, {
            headers,
            params: {
              subdomain: subdomain,
              supervision: selectedFilter,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data.status === "ok") {
              if (res.data.data.supervisions.length !== 0) {
                setSrSupervisionTable(res.data.data.supervisions);
                setHidden(false);
              } else {
                setSrSupervisionTable([]);
                setHidden(true);
                toast.error(`No Reports found for selected filters!`, {
                  position: toast.POSITION.BOTTOM_LEFT,
                });
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });

        if (date !== "") {
          setSubjectDates([date]);
        } else {
          axios
            .get(`/exam_time_tables/get_examination_dates`, {
              headers,
              params: {
                // supervision: selectedFilter,
                time_table: timeTableFilter,
                subdomain: subdomain,
              },
            })
            .then((response) => {
              if (response.data.message === "Examination dates are as below") {
                if (response.data.data.dates.length !== 0) {
                  console.log(response.data.data.dates);
                  setSubjectDates(response.data.data.dates);
                }
              }
            })
            .catch((error) => console.log(error));
        }
      }
    }
  };

  const downloadExcel = () => {
    const wrapper = document.getElementById("sr_supervision_report_viewport"); // Replace 'table' with the ID of your div element containing the table
    const table = wrapper.querySelector("table");
    const additionalData = wrapper.querySelectorAll("#selected_filters p");
    const worksheetData = [];

    additionalData.forEach((p) => {
      const rowData = [
        {
          v: p.textContent,
          t: "s",
          s: { alignment: { horizontal: "center" } },
        },
      ];
      worksheetData.push(rowData);
    });

    worksheetData.push([]);

    const tableRows = table.querySelectorAll("tr");
    // Prepare the worksheet data
    tableRows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("th, td");
      cells.forEach((cell) => {
        let cellData = cell.textContent;
        // Check if cell content includes the checkmark icon
        if (
          cell.innerHTML.includes(
            '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon fill="#43A047" points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9"></polygon></svg>'
          )
        ) {
          cellData = "1";
        }
        rowData.push({ v: cellData });
      });
      worksheetData.push(rowData);
    });
    // Create a new workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    // Create a new worksheet
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "SrSuperVisionData"); // Replace 'Sheet1' with your desired sheet name
    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    // Create a Blob object from the Excel buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SrSuperVisionData.xlsx"; // Replace 'table.xlsx' with your desired file name
    // Trigger the download
    link.click();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      {localStorage.getItem("roles") !== null ? (
        acces_token &&
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
                  {/* <li>
                    <a
                      href="/studentResult"
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="ml-3">Student Result</span>
                    </a>
                  </li> */}
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
                    className={`text-white font-bold py-2 px-4 rounded-lg bg-slate-500`}
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
                    className={`bg-slate-800 text-white font-bold py-2 px-4 rounded-lg `}
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
                            handleExaminationChange4(e.target.value);
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
                          onChange={(e) => handleYearChange4(e.target.value)}
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
                          onChange={handleSrTypeChange}
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
                          id="branch"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
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
                          id="time"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={(e) => {
                            handleTimeChange(e);
                          }}
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
                          id="date"
                          className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                          onChange={(e) => {
                            handleDateChange(e);
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
                className={`${
                  hidden ? "hidden" : "flex"
                } w-full flex-col overflow-y-scroll mt-5 h-[60vh] max-h-fit`}
                ref={componentRef4}
                id="sr_supervision_report_viewport"
              >
                <div id="selected_filters">
                  <p className="text-center">{uniName}</p>
                  <p className="text-center">{branchesName} </p>
                  <p className="text-center">
                    {date} {time}
                  </p>
                  <p className="text-center">
                    {examinationName4} {selectedYear4} Examination Time Table
                  </p>
                </div>
                <div className="">
                  <div className="p-1.5 mt-5 max-w-max inline-block align-middle">
                    <div className="border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                            >
                              Designation
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                            >
                              Department
                            </th>
                            {subjectDates.map((e) => (
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                {e}
                              </th>
                            ))}
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                            >
                              Sign
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {srSupervisionTable.map((supervision) => (
                            <tr>
                              <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                {supervision.faculty_name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {supervision.designation}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {supervision.department}
                              </td>
                              {subjectDates.map((value) => {
                                if (supervision.metadata[value]) {
                                  return (
                                    <td className="px-6 py-4 flex-row justify-center items-center text-sm text-gray-800 ">
                                      <FcCheckmark />
                                    </td>
                                  );
                                } else {
                                  return (
                                    <td className="px-6 py-4 flex-row justify-center items-center text-sm text-gray-800 "></td>
                                  );
                                }
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <a
                  href="#"
                  id="download_button"
                  onClick={downloadExcel}
                  className={`${
                    hidden ? "hidden" : "flex"
                  } text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-500 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300`}
                >
                  <SiMicrosoftexcel size={25} />
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

export default ExamViewSrSupervision;
