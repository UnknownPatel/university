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

var acces_token;
var subdomain;
var headers;

const ExamViewSrSupervision = () => {
  const [uniName, setUniName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedYear4, setSelectedYear4] = useState();
  const [examinationName4, setExaminationName4] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("0");
  const [branchesName, setBranchesName] = useState("");
  const [srSupervisionTable, setSrSupervisionTable] = useState([]);
  const [subjectDates, setSubjectDates] = useState([]);
  const [storeDates, setStoreDates] = useState([]);
  const navigate = useNavigate();


  const componentRef4 = useRef();
  var year;

  useEffect(() => {
    acces_token = localStorage.getItem("access_token");
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

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/courses?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setCourses(response.data.data.courses);
          // setCourses2(response.data.data.courses);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const handleExaminationChange4 = (examination) => {
    setExaminationName4(examination);
  };

  const handleYearChange4 = (date) => {
    if (date !== "Select Year") {
      setSelectedYear4(date);
    } else {
      setSelectedYear4("");
    }
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
    setCourseId("");
    setBranches([]);
    setBranchId("");
    var selectedFilter = {};
    setStoreDates([]);
    if (examinationName4 !== "Select Examination") {
      selectedFilter["name"] = examinationName4;
    }

    if (time === "0") {
      selectedFilter["time"] = "morning";
    } else {
      selectedFilter["time"] = "evening";
    }

    if (selectedYear4 !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear4;
    }

    if (e.target.value !== "Select Course") {
      selectedFilter["course_id"] = e.target.value;
    }
    const sr_supervision_report_viewport = document.getElementById(
      "sr_supervision_report_viewport"
    );
    sr_supervision_report_viewport.classList.add("hidden");
    sr_supervision_report_viewport.classList.remove("flex");
    const download_button = document.getElementById("download_button");
    download_button.classList.add("hidden");
    if (e.target.value !== "Select Course") {
      setCourseId(e.target.value);
      acces_token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${acces_token}` };
      const host = window.location.host;
      const arr = host
        .split(".")
        .slice(0, host.includes("localhost") ? -1 : -2);
      if (arr.length > 0) {
        subdomain = arr[0];
      }
      if (subdomain !== null || subdomain !== "") {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/branches`,
            {
              headers,
              params: {
                subdomain: subdomain,
                course_id: e.target.value,
              },
            }
          )
          .then((response) => {
            console.log(response);
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
    } else {
      setCourseId("");
      setBranches([]);
      setBranchId("");
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    var selectedIndex = e.target.options.selectedIndex;
    setBranchesName(e.target.options[selectedIndex].getAttribute("data-name"));
    var selectedFilter = {};
    setStoreDates([]);

    if (examinationName4 !== "Select Examination") {
      selectedFilter["name"] = examinationName4;
    }

    if (selectedYear4 !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear4;
    }

    if (time === "0") {
      selectedFilter["time"] = "morning";
    } else {
      selectedFilter["time"] = "evening";
    }

    if (courseId !== "Select Course") {
      selectedFilter["course_id"] = courseId;
    }

    if (e.target.value !== "Select Branch") {
      selectedFilter["branch_id"] = e.target.value;
    }
    const sr_supervision_report_viewport = document.getElementById(
      "sr_supervision_report_viewport"
    );
    sr_supervision_report_viewport.classList.add("hidden");
    sr_supervision_report_viewport.classList.remove("flex");
    const download_button = document.getElementById("download_button");
    download_button.classList.add("hidden");
    if (e.target.value !== "Select Branch") {
      setBranchId(e.target.value);
      acces_token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${acces_token}` };
      const host = window.location.host;
      const arr = host
        .split(".")
        .slice(0, host.includes("localhost") ? -1 : -2);
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
    } else {
      setBranchId("");
    }
  };

  const handleFilterSubmit = (e) => {
    console.log("button clicked!");
    const sr_supervision_report_viewport = document.getElementById(
      "sr_supervision_report_viewport"
    );
    const download_button = document.getElementById("download_button");
    sr_supervision_report_viewport.classList.add("hidden");
    sr_supervision_report_viewport.classList.remove("flex");
    download_button.classList.add("hidden");
    let selectedFilter = {};
    let timeTableFilter = {};
    let time_table_time = "";

    if (examinationName4 === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear4 === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "" || courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: examinationName4,
        academic_year: selectedYear4,
        course_id: courseId,
        list_type: "Senior",
        time: time,
      };

      time === "0"
        ? (time_table_time = "morning")
        : (time_table_time = "evening");

      timeTableFilter = {
        name: examinationName4,
        academic_year: selectedYear4,
        course_id: courseId,
        time: time_table_time,
      };

      if (branchId !== "") {
        selectedFilter = {
          examination_name: examinationName4,
          academic_year: selectedYear4,
          course_id: courseId,
          branch_id: branchId,
          list_type: "Senior",
          time: time,
        };

        timeTableFilter = {
          name: examinationName4,
          academic_year: selectedYear4,
          course_id: courseId,
          branch_id: branchId,
          time: time_table_time,
        };
      }

      if (date !== "") {
        selectedFilter["date"] = date;
      }
    }

    console.log(selectedFilter);

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions`,
          {
            headers,
            params: {
              subdomain: subdomain,
              supervision: selectedFilter,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.status === "ok") {
            if (res.data.data.supervisions.length !== 0) {
              download_button.classList.remove("hidden");
              sr_supervision_report_viewport.classList.remove("hidden");
              sr_supervision_report_viewport.classList.add("flex");
              setSrSupervisionTable(res.data.data.supervisions);
            } else {
              download_button.add("hidden");
              sr_supervision_report_viewport.classList.add("hidden");
              sr_supervision_report_viewport.classList.remove("flex");
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
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates`,
            {
              headers,
              params: {
                // supervision: selectedFilter,
                time_table: timeTableFilter,
                subdomain: subdomain,
              },
            }
          )
          .then((response) => {
            if (response.data.message === "Examination dates are as below") {
              if (response.data.data.dates.length !== 0) {
                console.log(response.data.data.dates);
                setSubjectDates(response.data.data.dates);
                sr_supervision_report_viewport.classList.remove("hidden");
                sr_supervision_report_viewport.classList.add("flex");
              }
            }
          })
          .catch((error) => console.log(error));
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

  const handlePrint4 = useReactToPrint({
    content: () => componentRef4.current,
  });
  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
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
        <div className="flex flex-col items-center mt-14">
          <div className="flex items-center space-x-4 mb-5">
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
              Blockwise Report
            </a>
            <a
              className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
              href="/examViewJrSupervision"
            >
              Jr.Supervisor Tab
            </a>
            <a
              className={`bg-slate-800 text-white font-bold py-2 px-4 rounded-lg `}
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
              handleExaminationChange4(e.target.value);
            }}
          >
            <option>Select Examination</option>
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </select>

          <select
            className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
            onChange={(e) => handleYearChange4(e.target.value)}
          >
            <option value="Select Year">Select Year</option>
            {academic_years.map((year) => {
              return <option value={year}>{year}</option>;
            })}
          </select>
          <select
            className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
            onChange={handleCourseChange}
          >
            <option>Select course</option>
            {courses.map((course, index) => (
              <option value={course.id}>{course.name}</option>
            ))}
          </select>
          <select
            className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
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
              setTime(e.target.value);
            }}
          >
            <option value="0">10:30 A.M to 01:00 P.M</option>
            <option value="1">03:00 P.M to 05:30 P.M</option>
          </select>

          <button
            className="py-2 px-3 bg-gray-800 rounded-2xl text-white font-bold"
            // id={"button-subject-" + subject.id}
            onClick={handleFilterSubmit}
          >
            <p className="inline-flex">
              Search <GiArchiveResearch className="mt-1 ml-2" />
            </p>
          </button>
        </div>
        <div className="flex mt-5">
          <a
            href="#"
            id="download_button"
            onClick={downloadExcel}
            className="hidden py-2 px-3 absolute right-0 mt-1 mr-7 bg-blue-200 rounded-2xl text-white font-bold"
          >
            <FcDownload />
          </a>
        </div>
        <div
          className="hidden flex-col mt-5"
          ref={componentRef4}
          id="sr_supervision_report_viewport"
        >
          <div id="selected_filters">
            <p className="text-center">{uniName}</p>
            <p className="text-center">{branchesName} </p>
            <p className="text-center">
              {date} {time === "0" ? "Morning" : "Evening"}
            </p>
            <p className="text-center">
              {examinationName4} {selectedYear4} Examination Time Table
            </p>
          </div>
          <div className="overflow-y-scroll" style={{ height: 295 }}>
            <div className="p-1.5 w-full inline-block align-middle">
              <div
                id="sr_faculty_supervision_data_table"
                className="border rounded-lg"
              >
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
                          }
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default ExamViewSrSupervision;
