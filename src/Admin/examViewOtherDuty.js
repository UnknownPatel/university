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
import { FcPrint } from "react-icons/fc";
import { GiArchiveResearch } from "react-icons/gi";

import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { SiMicrosoftexcel } from "react-icons/si";

var acces_token;
var subdomain;
var headers;

const ExamViewOtherDuty = () => {
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedYear5, setSelectedYear5] = useState();
  const [examinationName5, setExaminationName5] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [branchesName, setBranchesName] = useState("");
  const [otherDutyTable, setOtherDutyTable] = useState([]);
  const [time, setTime] = useState("");
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [examinationTimes, setExaminationTimes] = useState([]);
  const [storeDates, setStoreDates] = useState([]);
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [hidden, setHidden] = useState(true);

  const navigate = useNavigate();
  const componentRef5 = useRef();
  const tableRef = useRef(null);

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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/find_user?subdomain=${subdomain}`,
          {
            headers,
          }
        )
        .then((responce) => {
          // selectedFilter = responce.data.configuration;
          setFaculty(
            responce.data.user.first_name + " " + responce.data.user.last_name
          );
        })
        .catch((error) => console.log(error));

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

      axios
        .get(
          "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/examination_names",
          {
            headers,
            params: {
              subdomain: subdomain,
            },
          }
        )
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
        .get(
          "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/examination_types",
          {
            headers,
            params: {
              subdomain: subdomain,
            },
          }
        )
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
        .get(
          "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/examination_times",
          {
            headers,
            params: {
              subdomain: subdomain,
            },
          }
        )
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

  const handleExaminationChange5 = (examination3) => {
    setHidden(true);
    setExaminationName5(examination3);
  };

  const handleYearChange5 = (date) => {
    setHidden(true);
    if (date !== "Select Year") {
      setSelectedYear5(date);
    } else {
      setSelectedYear5("");
    }
  };

  const handleOdTypeChange = (e) => {
    e.preventDefault();
    setStoreDates([]);
    setDate("");
    setHidden(true);
    let selectedFilter = {};
    examinationName5 !== "" || examinationName5 !== "Select Examination"
      ? (selectedFilter["name"] = examinationName5)
      : delete selectedFilter["name"];
    selectedYear5 !== "" || selectedYear5 !== "Select Year"
      ? (selectedFilter["academic_year"] = selectedYear5)
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
    }
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
    setCourseId("");
    setBranches([]);
    setBranchId("");
    var selectedFilter = {};
    setStoreDates([]);
    setDate("");
    setHidden(true);
    examinationName5 !== "" || examinationName5 !== "Select Examination"
      ? (selectedFilter["name"] = examinationName5)
      : delete selectedFilter["name"];
    selectedYear5 !== "" || selectedYear5 !== "Select Year"
      ? (selectedFilter["academic_year"] = selectedYear5)
      : delete selectedFilter["academic_year"];
    type !== ""
      ? (selectedFilter["time_table_type"] = type)
      : delete selectedFilter["time_table_type"];
    time !== ""
      ? (selectedFilter["time"] = time)
      : delete selectedFilter["time"];

    if (e.target.value !== "Select Cource") {
      selectedFilter["cource_id"] = e.target.value;
      setCourseId(e.target.value);
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
    examinationName5 !== "" || examinationName5 !== "Select Examination"
      ? (selectedFilter["name"] = examinationName5)
      : delete selectedFilter["name"];
    selectedYear5 !== "" || selectedYear5 !== "Select Year"
      ? (selectedFilter["academic_year"] = selectedYear5)
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
    }
  };

  const handleTimeChange = (e) => {
    e.preventDefault();
    setDate("");
    setStoreDates([]);
    setHidden(true);
    var selectedFilter = {};
    examinationName5 !== "" || examinationName5 !== "Select Examination"
      ? (selectedFilter["name"] = examinationName5)
      : delete selectedFilter["name"];
    selectedYear5 !== "" || selectedYear5 !== "Select Year"
      ? (selectedFilter["academic_year"] = selectedYear5)
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
      setTime("");
    }
  };

  const handleFilterSubmit = (e) => {
    let selectedFilter = {};
    let timeTableFilter = {};

    if (examinationName5 === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear5 === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "" || courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: examinationName5,
        academic_year: selectedYear5,
        course_id: courseId,
      };

      if (branchId !== "") {
        selectedFilter = {
          examination_name: examinationName5,
          academic_year: selectedYear5,
          course_id: courseId,
          branch_id: branchId,
        };
      }
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties`,
          {
            headers,
            params: {
              subdomain: subdomain,
              other_duty: selectedFilter,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.status === "ok") {
            if (res.data.data.other_duties.length !== 0) {
              setOtherDutyTable(res.data.data.other_duties);
              setHidden(false);
            } else {
              setOtherDutyTable([]);
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
    }
  };

  const handlePrint5 = useReactToPrint({
    content: () => componentRef5.current,
  });

  const handleSavePDF = () => {
    const contentElement = document.getElementById(
      "other_duty_report_viewport"
    );
    contentElement.style = {};

    html2pdf()
      .set({
        filename: "OtherDuty Report.pdf",
        margin: [10, 10, 10, 10],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(contentElement)
      .save();
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
    link.download = "OtherDutiesData.xlsx"; // Replace 'table.xlsx' with your desired file name
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
                  <li>
                    <a
                      href="/studentResult"
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="ml-3">Student Result</span>
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
                    className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
                    href="/examViewSrSupervision"
                  >
                    Sr.Supervisor Tab
                  </a>
                  <a
                    className={`bg-slate-800 text-white font-bold py-2 px-4 rounded-lg `}
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
                    handleExaminationChange5(e.target.value);
                  }}
                >
                  <option value="Select Examination">Examination</option>
                  {examinationNames.map((examination_name) => {
                    return (
                      <option value={examination_name.name}>
                        {examination_name.name}
                      </option>
                    );
                  })}
                </select>

                <select
                  className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                  onChange={(e) => handleYearChange5(e.target.value)}
                >
                  <option value="Select Year">Year</option>
                  {academic_years.map((year) => {
                    return <option value={year}>{year}</option>;
                  })}
                </select>

                <select
                  className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                  onChange={handleOdTypeChange}
                >
                  <option value="Select Type">Type</option>
                  {examinationTypes.map((examination_type) => {
                    return (
                      <option value={examination_type.name}>
                        {examination_type.name}
                      </option>
                    );
                  })}
                </select>

                <select
                  className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                  onChange={handleCourseChange}
                >
                  <option value="Select Course">Course</option>
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
                  <option value="Select Branch">Branch</option>
                  {branches.map((branch) => (
                    <option value={branch.id} data-name={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                  onChange={(e) => {
                    handleTimeChange(e);
                  }}
                >
                  <option value="Select time">Time</option>
                  {examinationTimes.map((examination_time) => {
                    return (
                      <option value={examination_time.name}>
                        {examination_time.name}
                      </option>
                    );
                  })}
                </select>
                <button
                  className="py-2 px-3 bg-gray-800 rounded-2xl text-white font-bold"
                  onClick={handleFilterSubmit}
                >
                  <p className="inline-flex">
                    Search <GiArchiveResearch className="mt-1 ml-2" />
                  </p>
                </button>
              </div>

              <div className="flex justify-center mt-5">
                <a
                  href="#"
                  id="download_button"
                  onClick={handlePrint5}
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
                className={`${
                  hidden ? "hidden" : "flex"
                } w-full flex-col overflow-y-scroll mt-5 h-[60vh] max-h-fit`}
                ref={componentRef5}
                id="other_duty_report_viewport"
              >
                <div id="selected_filters">
                  <p className="text-center">{uniName}</p>
                  <p className="text-center">{branchesName} </p>
                  <p className="text-center">
                    {date} {time}
                  </p>
                  <p className="text-center">
                    {examinationName5} {selectedYear5} Other Duties
                  </p>
                </div>
                <div ref={tableRef} id="table-viewport" className="">
                  <div className="p-1.5 w-full inline-block align-middle">
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
                            Assigned Duty
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                            >
                              Sign
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {otherDutyTable.map((otherDuty) => (
                            <tr>
                              <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                {otherDuty.user_name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {otherDuty.designation}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {otherDuty.course_name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {otherDuty.assigned_duties}
                              </td>
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

export default ExamViewOtherDuty;
