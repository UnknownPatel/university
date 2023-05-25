import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import { FcCheckmark } from "react-icons/fc";
import { FcDownload } from "react-icons/fc";


import { useReactToPrint } from "react-to-print";

var acces_token;
var subdomain;
var headers;

const ExamViewJrSupervision = () => {
  const [uniName, setUniName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedYear3, setSelectedYear3] = useState();
  const [examinationName3, setExaminationName3] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [branchId, setBranchId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [branchesName, setBranchesName] = useState("");

  const [subjectDates, setSubjectDates] = useState([]);
  const [dateCheckBox, setDateCheckBox] = useState([]);
  const [facultyName, setFacultyName] = useState([{}]);
  const [userId, setUserId] = useState("");
  const [supervisionDesignation, setSupervisionDesignation] = useState("");
  const [supervisionDepartment, setSupervisionDepartment] = useState("");
  const [jrSupervisionTable, setJrSupervisionTable] = useState([]);
  const componentRef3 = useRef();
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

  const handleExaminationChange3 = (examination) => {
    setExaminationName3(examination);
  };
  const handleYearChange3 = (date) => {
    if (date !== "Select Year") {
      setSelectedYear3(date);
    } else {
      setSelectedYear3("");
    }
  };
  const handleCourseChange = (e) => {
    e.preventDefault();
    setCourseId("");
    setBranches([]);
    setBranchId("");
    const jr_supervision_report_viewport = document.getElementById(
      "jr_supervision_report_viewport"
    );
    jr_supervision_report_viewport.classList.add("hidden");
    jr_supervision_report_viewport.classList.remove("flex");
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
    const jr_supervision_report_viewport = document.getElementById(
      "jr_supervision_report_viewport"
    );
    jr_supervision_report_viewport.classList.add("hidden");
    jr_supervision_report_viewport.classList.remove("flex");
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
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/semesters`,
            {
              headers,
              params: {
                subdomain: subdomain,
                branch_id: e.target.value,
              },
            }
          )
          .then((response) => {
            if (response.data.status === "ok") {
              // setSemesters2(response.data.data.semesters);
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
    let selectedFilter = {};
    let timeTableFilter = {};

    if (examinationName3 === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear3 === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "" || courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: examinationName3,
        academic_year: selectedYear3,
        course_id: courseId,
        list_type:'Junior',
      };

      timeTableFilter = {
        name: examinationName3,
        academic_year: selectedYear3,
        course_id: courseId
      }

      if (branchId !== "") {
        selectedFilter = {
          examination_name: examinationName3,
          academic_year: selectedYear3,
          course_id: courseId,
          branch_id: branchId,
          list_type:'Junior',
        };

        timeTableFilter = {
          name: examinationName3,
          academic_year: selectedYear3,
          course_id: courseId,
          branch_id: branchId
        }
      }

      // if (semesterId !== "") {
      //   selectedFilter = {
      //     name: examinationName2,
      //     academic_year: selectedYear2,
      //     course_id: courseId,
      //     branch_id: branchId,
      //     semester_id: semesterId,
      //   };
      // }
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
            const jr_supervision_report_viewport = document.getElementById(
              "jr_supervision_report_viewport"
            );
            const download_button = document.getElementById("download_button");
            if (res.data.data.supervisions.length !== 0) {
              download_button.classList.remove("hidden");
              jr_supervision_report_viewport.classList.remove("hidden");
              jr_supervision_report_viewport.classList.add("flex");
              setJrSupervisionTable(res.data.data.supervisions);
            } else {
              toast.error(`No Reports found for selected filters!`, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
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
            const jr_supervision_report = document.getElementById(
              "jr_supervision_report_viewport"
            );
            if (response.data.message === "Examination dates are as below") {
              if (response.data.data.dates.length !== 0) {
                console.log(response.data.data.dates);
                setSubjectDates(response.data.data.dates);
                jr_supervision_report.classList.remove("hidden");
                jr_supervision_report.classList.add("flex");
              }
            }
          })
          .catch((error) => console.log(error));
    }
  };



  const handlePrint3 = useReactToPrint({
    content: () => componentRef3.current,
  });

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

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
                href="/examTimetable"
                className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                href="/examViewTimeTable"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="flex-1 ml-3 whitespace-nowrap">Report</span>
              </a>
            </li>
            {/* <li>
              <button
                className="w-full bg-slate-600 text-white py-2 px-4 text-left rounded-md"
                onClick={toggleDropdown}
              >
                Reports
              </button>
              <div
                className={`bg-white shadow rounded-md mt-2 py-2 ${
                  isDropdownOpen ? "block" : "hidden"
                }`}
              >
                <a
                  href="/examViewTimeTable"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Time Table
                </a>
                <a
                  href="/examViewBlockDetails"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  BlockWise Report
                </a>
                <a
                  href="/examViewJrSupervision"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Jr. Supervision Report
                </a>
                <a
                  href="/examViewSrSupervision"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Sr. Supervision Report
                </a>
                <a
                  href="/examViewOtherDuty"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Other Duty Report
                </a>
              </div>
            </li> */}
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
              className={`bg-slate-800 text-white font-bold py-2 px-4 rounded-lg `}
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
              handleExaminationChange3(e.target.value);
            }}
          >
            <option>Select Examination</option>
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </select>

          <select
            className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
            onChange={(e) => handleYearChange3(e.target.value)}
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

          <button
            className="py-2 px-3 ml-20 bg-gray-800 rounded-2xl text-white font-bold"
            // id={"button-subject-" + subject.id}
            onClick={handleFilterSubmit}
          >
            Submit
          </button>
        </div>
        <div className="flex mt-5">
          <a
            href="#"
            id="download_button"
             onClick={handlePrint3}
            className="hidden py-2 px-3 absolute right-0 mt-1 mr-7 bg-blue-200 rounded-2xl text-white font-bold"
          >
              <FcDownload />
          </a>
        </div>
        <div className="hidden flex-col mt-5" ref={componentRef3} id="jr_supervision_report_viewport">
        <div>
              <p className="text-center">{uniName}</p>
              <p className="text-center">
                {examinationName3} {selectedYear3} Examination Time Table
              </p>
            </div>
          <div className="overflow-y-scroll" style={{ height: 295 }}>
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
                    {jrSupervisionTable.map((supervision) => (
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
                        {/* {Object.entries(
                          JSON.parse(supervision.metadata.metadata)
                        ).map((value) => {
                          if (value[1] === true) {
                            return (
                              <td className="px-6 py-4 text-sm text-gray-800 ">
                                <p className="flex justify-center">
                                  <FcCheckmark />
                                </p>
                              </td>
                            );
                          }
                        })} */}
                        {/* {subjectDates.map((value) => (
                                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                    {Object.entries(JSON.parse(supervision.metadata.metadata))[value]}
                                  </td>
                                ))} */}
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

export default ExamViewJrSupervision;
