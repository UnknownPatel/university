import axios from "axios";
import ReactDOMServer from "react-dom/server";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import { GiArchiveResearch } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

var acces_token;
var headers;
var subdomain;

const ExamTimeTable = () => {
  const componentRef = useRef();
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [examinationName, setExaminationName] = useState("");
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [storedTimeTable, setStoredTimeTable] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [type, setType] = useState("");
  const [storedDates, setStoredDates] = useState([]);
  const navigate = useNavigate();

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
    }
  }, []);
  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleExaminationChange = (examination) => {
    handleViewPortChange();
    setExaminationName(examination);
  };

  const handleYearChange = (date) => {
    handleViewPortChange();
    if (date !== "Select Year") {
      setSelectedYear(date);
      setMinDate(date.split(" - ")[0] + "-01-01");
      setMaxDate(date.split(" - ")[1] + "-12-31");
    } else {
      setSelectedYear("");
      setMinDate("");
      setMaxDate("");
    }
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
    var selectedFilter = {};
    if (examinationName !== "Select Examination") {
      selectedFilter["name"] = examinationName;
    } else if (selectedYear !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear;
    } else if (e.target.value !== "Select Course") {
      selectedFilter["course_id"] = e.target.value;
    }

    console.log(selectedFilter);
    setSubjects([]);
    setSemesters([]);
    handleViewPortChange();
    var course_id = e.target.value;
    setCourseId(course_id);
    acces_token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${acces_token}` };
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
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    setSubjects([]);
    handleViewPortChange();
    var branch_id = e.target.value;
    if (branch_id === "Select Branch") {
      setBranchId("");
      setSemesterId("");
    } else {
      setBranchId(e.target.value);
    }
    acces_token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${acces_token}` };
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
          if (response.data.status === "ok") {
            setSemesters(response.data.data.semesters);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSemesterChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setSubjects([]);
    handleViewPortChange();
    if (e.target.value === "Select Semester") {
      setSemesterId("");
    } else {
      setSemesterId(e.target.value);
    }
  };

  const handleTypeChange = (e) => {
    e.preventDefault();
    setSubjects([]);
    handleViewPortChange();
    if (e.target.value === "Select Type") {
      setType("");
    } else {
      setType(e.target.value);
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
    } else if (type === "" || type === "Select type") {
      toast.error("Please select type", {
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
        time_table_type: type,
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
    }

    console.log(selectedFilter);

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/subjects`,
          {
            headers,
            params: {
              subdomain: subdomain,
              subject: selectedFilter,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.status == "ok") {
            const time_table_viewport = document.getElementById(
              "time_table_viewport"
            );
            if (res.data.data.subjects.length !== 0) {
              time_table_viewport.classList.remove("hidden");
              time_table_viewport.classList.add("flex");
              setSubjects(res.data.data.subjects);
              res.data.data.subjects.map((subject) => {
                axios
                  .get(
                    `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/${subject.id}/fetch_details`,
                    {
                      headers,
                      params: {
                        time_table: selectedFilter,
                        subdomain: subdomain,
                      },
                    }
                  )
                  .then((get_response) => {
                    const button = document.getElementById(
                      "button-subject-" + subject.id
                    );
                    const table_date = document.getElementById(
                      "date-select-subject-" + subject.id
                    );
                    const table_time = document.getElementById(
                      "select-time-subject-" + subject.id
                    );
                    if (get_response.data.message === "Details found") {
                      button.innerHTML = "Update";
                      button.setAttribute(
                        "data-time-table-id",
                        get_response.data.data.time_table.id
                      );
                      table_date.value = get_response.data.data.time_table.date;
                      var selectedIndex =
                        get_response.data.data.time_table.time ===
                        "10:30 A.M to 01:00 P.M"
                          ? 1
                          : 2;
                      table_time.options.selectedIndex = selectedIndex;
                    } else {
                      button.innerHTML = "Create";
                      table_date.value = "";
                      table_time.options[
                        table_time.options.selectedIndex
                      ].text = "Select time";
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            } else {
              toast.error("No subjects found for the selected criteria!", {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          } else {
            toast.error("No subjects found for the selected criteria!", {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const createObject = (e, id, date, time) => {
    e.preventDefault();
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
    } else if (type === "") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        name: examinationName,
        academic_year: selectedYear,
        course_id: courseId,
        subject_id: id,
        time_table_type: type,
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
    }
    var time_table_id = e.target.getAttribute("data-time-table-id");
    const date_input = document.getElementById("date-select-subject-" + id);
    const time_input = document.getElementById("select-time-subject-" + id);

    var dateValue = date_input.value;
    var timeValue = time_input.options[time_input.options.selectedIndex].value;
    if (dateValue !== "") {
      selectedFilter["date"] = dateValue;
    } else {
      delete selectedFilter["date"];
    }

    if (timeValue !== "") {
      selectedFilter["time"] = timeValue;
    } else {
      delete selectedFilter["time"];
    }
    if (e.target.innerHTML === "Update") {
      // Update TimeTable API
      axios
        .put(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/${time_table_id}`,
          {
            subdomain: subdomain,
            time_table: selectedFilter,
          },
          { headers }
        )
        .then((res) => {
          if (res.data.status === "ok") {
            if (res.data.data.time_table.length !== 0) {
              console.log("Updated");
              toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      // Create TimeTable API
      axios
        .post(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables`,
          {
            time_table: selectedFilter,
            subdomain: subdomain,
          },
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((responce) => {
          console.log(responce.data);
          const button = document.getElementById("button-subject-" + id);
          const date = document.getElementById("date-select-subject-" + id);
          const time = document.getElementById("select-time-subject-" + id);
          if (responce.data.status == "created") {
            button.innerHTML = "Update";
            button.setAttribute(
              "data-time-table-id",
              responce.data.data.time_table.id
            );
            date.value = responce.data.data.time_table.date;
            time.options[time.options.selectedIndex].text =
              responce.data.data.time_table.time;
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
    }
  };

  const handleViewPortChange = () => {
    const time_table_viewport = document.getElementById("time_table_viewport");
    time_table_viewport.classList.add("hidden");
    time_table_viewport.classList.remove("flex");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
                  className="flex items-center p-2 bg-slate-600 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  className="flex items-center p-2 text-gray-900  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">Report</span>
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
          <div className="p-4 rounded-lg mt-10">
            <div className="text-center text-4xl">
              <p>Create Time Table</p>
            </div>
          </div>
          {/* Button Content 1 */}
          <div className="flex mt-5 ml-2">
            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
              onChange={(e) => {
                handleExaminationChange(e.target.value);
              }}
              aria-label="Examination Name"
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
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="Select Year">Year</option>
              {academic_years.map((year) => {
                return <option value={year}>{year}</option>;
              })}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleTypeChange}
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
              aria-label="Select Course"
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleCourseChange}
            >
              <option value="Select Course">Course</option>
              {courses.map((course, index) => (
                <option value={course.id}>{course.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleBranchChange}
              isSearchable={true}
            >
              <option value="Select Branch">Branch</option>
              {branches.map((branch) => (
                <option value={branch.id}>{branch.name}</option>
              ))}
            </select>

            <select
              // data-te-select-init
              // data-te-select-filter="true"
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleSemesterChange}
            >
              <option value="Select Semester">Semester</option>
              {semesters.map((semester) => (
                <option value={semester.id}>{semester.name}</option>
              ))}
            </select>

            <button
              className="py-2 px-3 mr-7 bg-gray-800 rounded-2xl text-white font-bold"
              onClick={handleFilterSubmit}
            >
              <p className="inline-flex">
                Search <GiArchiveResearch className="mt-1 ml-2" />
              </p>
            </button>
          </div>
          <div
            id="time_table_viewport"
            className="hidden flex-col overflow-y-scroll mt-5"
            style={{ height: 390 }}
          >
            <div className="">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table className="min-w-full divide-y table-auto divide-gray-200">
                    <thead className="sticky top-0 bg-gray-50">
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
                          className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                        >
                          Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {subjects.map((subject) => (
                        <tr>
                          <td
                            className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                            data-id={subject.id}
                          >
                            {subject.name}
                          </td>
                          <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {subject.code}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <input
                              className="shadow appearance-none border rounded w-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id={"date-select-subject-" + subject.id}
                              onChange={(e) => setDate(e.target.value)}
                              type="date"
                              min={new Date().toISOString().split("T")[0]} // Set min attribute to today's date
                              max={maxDate}
                              onBeforeInput={(e) => e.preventDefault()}
                              // disabled={true}
                              required
                            />
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <select
                              id={"select-time-subject-" + subject.id}
                              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-2 py-1"
                              onChange={(e) => {
                                setTime(e.target.value);
                              }}
                              // selected={}
                            >
                              <option value="">Select time</option>
                              <option value="morning">
                                10:30 A.M to 01:00 P.M
                              </option>
                              <option value="evening">
                                03:00 P.M to 05:30 P.M
                              </option>
                            </select>
                          </td>
                          <td
                            className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                            data-id={subject.id}
                          >
                            <button
                              className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                              id={"button-subject-" + subject.id}
                              onClick={(e) =>
                                createObject(e, subject.id, date, time)
                              }
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

export default ExamTimeTable;
