import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiArchiveResearch } from "react-icons/gi";
import { MdAddCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

var headers;
var subdomain;
var access_token;

const MarksEntry = () => {
  const [uniName, setUniName] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);
  const [division, setDivision] = useState([]);
  const [subjectName, setSubjectName] = useState([]);
  const [examinationName, setExaminationName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [type, setType] = useState("");
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [branchesName, setBranchesName] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [semesterName, setSemesterName] = useState("");
  const [selectedYear, setSelectedYear] = useState();
  const [examinationName, setExaminationName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [displayTimeTable, setDisplayTimeTable] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [storeDates, setStoreDates] = useState([]);
  const [removeOverFlow, setRemoveOverflow] = useState(false);
  const navigate = useNavigate();

  var year;

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

  const handleExaminationChange = (examination) => {
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    // marks_entry_viewport.classList.add("hidden");
    // marks_entry_viewport.classList.remove("flex");
    setExaminationName(examination);
  };

  const handleYearChange = (date) => {
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    // marks_entry_viewport.classList.add("hidden");
    // marks_entry_viewport.classList.remove("flex");
    if (date !== "Select Year") {
      setSelectedYear(date);
    } else {
      setSelectedYear("");
    }
  };

  const handleTypeChange = (e) => {
    e.preventDefault();
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    // marks_entry_viewport.classList.add("hidden");
    // marks_entry_viewport.classList.remove("flex");
    if (e.target.value === "Select Type") {
      setType("");
    } else {
      setType(e.target.value);
    }
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    // marks_entry_viewport.classList.add("hidden");
    // marks_entry_viewport.classList.remove("flex");
    console.log(e.target.value);
    if (e.target.value !== "Select course") {
      setCourseId(e.target.value);
      var course_id = e.target.value;
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
    } else {
      setCourseId("");
      setBranches([]);
    var selectedFilter = {};
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
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    // marks_entry_viewport.classList.add("hidden");
    // marks_entry_viewport.classList.remove("flex");

    // var selectedIndex = e.target.options.selectedIndex;
    // setBranchesName(e.target.options[selectedIndex].getAttribute("data-name"));
    var selectedFilter = {};

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
      }
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
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    // marks_entry_viewport.classList.add("hidden");
    // marks_entry_viewport.classList.remove("flex");
    if (e.target.value === "Select Semester") {
      setSemesterId("");
    } else {
      setSemesterId(e.target.value);
      if (subdomain !== null || subdomain !== "") {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/divisions`,
            {
              headers,
              params: {
                subdomain: subdomain,
                division: {
                  semester_id: e.target.value,
                },
              },
            }
          )
          .then((response) => {
            setDivisions(response.data.data.divisions);
          })
          .catch((error) => console.log(error));
      } else {
        setDivisions([]);
      }
    }
  };

  const handleDivisionChange = (e) => {
    e.preventDefault();
    const marks_entry_viewport = document.getElementById(
      "Marks_viewport"
    );
    marks_entry_viewport.classList.add("hidden");
    marks_entry_viewport.classList.remove("flex");
    console.log("Button clicked");
    if (e.target.value !== "Select Division") {
      setDivisionId(e.target.value);
    } else {
      setDivisionId("");
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
    } else if (branchId === "") {
      toast.error("Please select branch", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (semesterId === "") {
      toast.error("Please select semester", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (divisionId === "") {
      toast.error("Please select division", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (type === "") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: examinationName,
        academic_year: selectedYear,
        course_id: courseId,
        branch_id: branchId,
        semester_id: semesterId,
        division_id: divisionId,
        entry_type: type,
      };

      console.log(selectedFilter);
    }
    var selectedFilter = {};

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
                    <span className="self-center text-xl mr-2 font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                      Faculty Name
                    </span>
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
                href="/marks_entry"
                className="flex items-center p-2 text-gray-900 bg-slate-600 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Marks Entry</span>
              </a>
            </li>
            <li>
              <a
                href="/lock_Marks"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Lock Marks</span>
              </a>
            </li>
            <li>
              <div className="p-4 absolute inset-x-0 bottom-0">
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
        <div className="p-4 rounded-lg mt-14">
          <div className="text-center text-4xl">
            <p>Marks Entry </p>
          </div>

          <div className="flex mt-5 ml-2">
            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
              onChange={(e) => {
                handleExaminationChange(e.target.value);
              }}
              aria-label="Examination Name"
            >
              <option value="Select Examination" hidden selected>
                Examination
              </option>
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
              <option value="Select Year" hidden selected>
                Year
              </option>
              {academic_years.map((year) => {
                return <option value={year}>{year}</option>;
              })}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleTypeChange}
            >
              <option value="Select Type" hidden selected>
                Type
              </option>
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
              <option value="Select Course" hidden selected>
                Course
              </option>
              {courses.map((course, index) => (
                <option value={course.id}>{course.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleBranchChange}
              // isSearchable={true}
            >
              <option value="Select Branch" hidden selected>
                Branch
              </option>
              {branches.map((branch) => (
                <option value={branch.id}>{branch.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleSemesterChange}
            >
              <option value="Select Semester" hidden selected>
                Semester
              </option>
              {semesters.map((semester) => (
                <option value={semester.id}>{semester.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleDivisionChange}
            >
              <option value="Select Division" hidden selected>
                Division
              </option>
              {divisions.map((division) => (
                <option value={division.id}>{division.name}</option>
              ))}
            </select>

            <select className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto">
              <option value="Select Division" hidden selected>
                Division
              </option>
            </select>

            <select className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto">
              <option value="Select SubjectName" hidden selected>
                Subject Name
              </option>
            </select>

            <button
              className="py-2 px-3 mr-7 ml-2 bg-gray-800 rounded-2xl text-white font-bold"
              onClick={handleFilterSubmit}
            >
              <p className="inline-flex">
                Search <GiArchiveResearch className="mt-1 ml-2" />
              </p>
            </button>
          </div>
          {/* Table of Faculty List */}
          <div
            id="Marks_viewport"
            className="hidden flex-col mt-5"
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
                          Sr No.
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Student Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Enrollment No.
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Enter Marks
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          QR Code
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200"></tbody>
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

export default MarksEntry;
