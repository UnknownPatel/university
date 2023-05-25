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
var headers;
var subdomain;

const ExamBlockDetails = () => {
  const [uniName, setUniName] = useState("");
  const [selectedYear2, setSelectedYear2] = useState();
  const [examinationName2, setExaminationName2] = useState("");
  const [courses2, setCourses2] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branches2, setBranches2] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [semesters2, setSemesters2] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [subjects2, setSubjects2] = useState([]);
  const [subjectId2, setSubjectId2] = useState("");
  const [date2, setDate2] = useState("");
  const [time2, setTime2] = useState("");
  const [noOfStudent, setNoOfStudent] = useState();
  const [examTimeTableId, setExamTimeTableId] = useState("");
  const [displayBlockWiseTable, setDisplayBlockWiseTable] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const componentRef2 = useRef();
  const [timeTables, setTimeTables] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          setCourses2(response.data.data.courses);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const handleExaminationChange2 = (examination) => {
    setExaminationName2(examination);
  };

  const handleYearChange2 = (date) => {
    if (date !== "Select Year") {
      setSelectedYear2(date);
      setMinDate(date.split(" - ")[0] + "-01-01");
      setMaxDate(date.split(" - ")[1] + "-12-31");
    } else {
      setSelectedYear2("");
      setMinDate("");
      setMaxDate("");
    }
  };

  const handleCourseChange2 = (e) => {
    e.preventDefault();
    setCourseId("");
    setBranches2([]);
    setBranchId("");
    setSemesters2([]);
    setSemesterId("");
    if (e.target.value !== "Select Course") {
      const time_table_viewport = document.getElementById(
        "time_table_viewport"
      );
      time_table_viewport.classList.add("hidden");
      time_table_viewport.classList.remove("flex");
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
            setBranches2(response.data.data.branches);
          })
          .catch((error) => console.log(error));
      }
    } else {
      setCourseId("");
      setBranches2([]);
      setBranchId("");
      setSemesters2([]);
      setSemesterId("");
    }
  };

  const handleBranchChange2 = (e) => {
    e.preventDefault();
    if (e.target.value !== "Select Branch") {
      const time_table_viewport = document.getElementById(
        "time_table_viewport"
      );
      time_table_viewport.classList.add("hidden");
      time_table_viewport.classList.remove("flex");
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
              setSemesters2(response.data.data.semesters);
            }
          })
          .catch((error) => console.log(error));
      }
    } else {
      setBranchId("");
      setSemesters2([]);
      setSemesterId("");
    }
  };
  const handleSemesterChange2 = (e) => {
    e.preventDefault();
    if (e.target.value !== "Select Semester") {
      setSemesterId(e.target.value);
    } else {
      setSemesterId("");
    }
  };

  const handleFilterSubmit = (e) => {
    console.log("button clicked!");
    let selectedFilter = {};

    if (examinationName2 === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear2 === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "" || courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        name: examinationName2,
        academic_year: selectedYear2,
        course_id: courseId,
      };

      if (branchId !== "") {
        selectedFilter = {
          name: examinationName2,
          academic_year: selectedYear2,
          course_id: courseId,
          branch_id: branchId,
        };
      }

      if (semesterId !== "") {
        selectedFilter = {
          name: examinationName2,
          academic_year: selectedYear2,
          course_id: courseId,
          branch_id: branchId,
          semester_id: semesterId,
        };
      }
    }

    console.log(selectedFilter);

    if (subdomain !== null || subdomain !== "") {
      console.log(selectedFilter);
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
          if (res.data.status === "ok") {
            const time_table_viewport = document.getElementById(
              "time_table_viewport"
            );
            if (res.data.data.time_tables.length !== 0) {
              time_table_viewport.classList.remove("hidden");
              time_table_viewport.classList.add("flex");
              setTimeTables(res.data.data.time_tables);
              res.data.data.time_tables.map((time_table) => {
                axios
                  .get(
                    `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/time_table_block_wise_reports/${time_table.id}/fetch_details`,
                    {
                      headers,
                      params: {
                        subdomain: subdomain,
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res);
                    const no_of_students = document.getElementById(
                      "input-time-table-" + time_table.id
                    );
                    const button_submit = document.getElementById(
                      "button-subject-" + time_table.id
                    );
                    if (res.data.message === "Details found") {
                      no_of_students.disabled = true;
                      no_of_students.classList.add("cursor-not-allowed");
                      no_of_students.value =
                        res.data.data.report.no_of_students;

                      button_submit.disabled = true;
                      button_submit.classList.add("cursor-not-allowed");
                      button_submit.innerHTML = "Created";
                    } else {
                      no_of_students.disabled = false;
                      no_of_students.value = "";
                      no_of_students.classList.remove("cursor-not-allowed");

                      button_submit.disable = false;
                      button_submit.value = "";
                      button_submit.innerHTML = "Create";
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              });
            } else {
              toast.error(
                `No timetable found for ${examinationName2} ${selectedYear2}, please create!`,
                {
                  position: toast.POSITION.BOTTOM_LEFT,
                }
              );
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleSubmitBlockWiseReport = (e, time_table_id, no_of_students) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");

    axios
      .post(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/time_table_block_wise_reports?subdomain=${subdomain}`,
        {
          report: {
            examination_name: examinationName2,
            academic_year: selectedYear2,
            exam_time_table_id: time_table_id,
            no_of_students: no_of_students,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${acces_token}`,
          },
        }
      )
      .then((responce) => {
        if (responce.data.status == "created") {
          const button = document.getElementById(
            "button-subject-" + time_table_id
          );
          const student_input = document.getElementById(
            "input-time-table-" + time_table_id
          );
          student_input.disabled = true;
          student_input.classList.add("cursor-not-allowed");
          button.classList.add("cursor-not-allowed");
          button.innerHTML = "Created";
          toast.success(responce.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        } else {
          toast.error(responce.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };
  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

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
                  href="/examTimetable"
                  className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="ml-3">Time Table</span>
                </a>
              </li>
              <li>
                <a
                  href="/examBlockDetails"
                  className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Report
                  </span>
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

        <div className="p-4 sm:ml-64">
          <div className="p-4 rounded-lg mt-10">
            <div className="text-center text-4xl">
              <p>Enter Block Details</p>
            </div>
          </div>
          <div className="flex ml-2 mt-5">
            {/* Select Examination option in BlockWise Report */}

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md rounded justify-center px-3 py-2"
              onChange={(e) => {
                handleExaminationChange2(e.target.value);
              }}
            >
              <option>Select Examination</option>
              <option value="Winter">Winter</option>
              <option value="Summer">Summer</option>
            </select>
            {/* Select Year option in BlockWise Report */}
            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={(e) => handleYearChange2(e.target.value)}
            >
              <option value="Select Year">Select Year</option>
              {academic_years.map((year) => {
                return <option value={year}>{year}</option>;
              })}
            </select>

            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={handleCourseChange2}
            >
              <option>Select course</option>
              {courses2.map((course) => (
                <option value={course.id}>{course.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2"
              onChange={handleBranchChange2}
            >
              <option>Select Branch</option>
              {branches2.map((branch) => (
                <option value={branch.id}>{branch.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2"
              onChange={handleSemesterChange2}
            >
              <option>Select Semester</option>
              {semesters2.map((semester) => (
                <option value={semester.id}>{semester.name}</option>
              ))}
            </select>
            <button
              className="py-2 px-3 absolute right-0 mr-7 bg-gray-800 rounded-2xl text-white font-bold"
              // id={"button-subject-" + subject.id}
              onClick={handleFilterSubmit}
            >
              Submit
            </button>
          </div>

          <div
            id="time_table_viewport"
            className="hidden flex-col overflow-y-scroll mt-5"
            style={{ height: 445 }}
          >
            <div className="">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Subject Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Subject Code
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          No. of Students
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    {/* Body of the BlockWise Report */}

                    <tbody className="divide-y divide-gray-200">
                      {timeTables.map((time_table) => (
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {time_table.subject_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {time_table.subject_code}
                          </td>
                          <td className="px-6 py-4 text-sm  whitespace-nowrap">
                            {time_table.date}
                          </td>
                          <td className="px-6 py-4 text-sm  whitespace-nowrap">
                            {time_table.time}
                          </td>
                          <td className="px-6 py-4 text-sm  whitespace-nowrap">
                            <input
                              className="shadow appearance-none border rounded w-44 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id={"input-time-table-" + time_table.id}
                              onChange={(e) =>
                                setNoOfStudent(parseInt(e.target.value))
                              }
                              type="text"
                              placeholder="Enter Student Number"
                              required
                            />
                          </td>
                          <td className="px-6 py-4 text-sm  whitespace-nowrap">
                            <button
                              className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                              onClick={(e) =>
                                handleSubmitBlockWiseReport(
                                  e,
                                  time_table.id,
                                  noOfStudent
                                )
                              }
                              id={"button-subject-" + time_table.id}
                            >
                              Create
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExamBlockDetails;
