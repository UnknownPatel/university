import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiArchiveResearch } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

var headers;
var subdomain;
var access_token;

const UnlockMarks = () => {
  const [uniName, setUniName] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [branchesName, setBranchesName] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [examinationName, setExaminationName] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [type, setType] = useState("");
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [subjectIds, setSubjectIds] = useState({});
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [status, setStatus] = useState({});
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

      // Get Course
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/courses?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setCourses(response.data.data.courses);
        })
        .catch((error) => console.log(error));

      // Get Examination Names
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

      // Get Examination Types
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
    const unlockMarks_viewport = document.getElementById(
      "unlockMarks_viewport"
    );
    unlockMarks_viewport.classList.add("hidden");
    unlockMarks_viewport.classList.remove("flex");
    setExaminationName(examination);
  };

  const handleYearChange = (date) => {
    const unlockMarks_viewport = document.getElementById(
      "unlockMarks_viewport"
    );
    unlockMarks_viewport.classList.add("hidden");
    unlockMarks_viewport.classList.remove("flex");
    if (date !== "Select Year") {
      setSelectedYear(date);
    } else {
      setSelectedYear("");
    }
  };

  const handleTypeChange = (e) => {
    e.preventDefault();
    setSubjects([]);
    const unlockMarks_viewport = document.getElementById(
      "unlockMarks_viewport"
    );
    unlockMarks_viewport.classList.add("hidden");
    unlockMarks_viewport.classList.remove("flex");
    if (e.target.value === "Select Type") {
      setType("");
    } else {
      setType(e.target.value);
    }
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
    const unlockMarks_viewport = document.getElementById(
      "unlockMarks_viewport"
    );
    unlockMarks_viewport.classList.add("hidden");
    unlockMarks_viewport.classList.remove("flex");
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
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    const unlockMarks_viewport = document.getElementById(
      "unlockMarks_viewport"
    );
    unlockMarks_viewport.classList.add("hidden");
    unlockMarks_viewport.classList.remove("flex");
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
    }
  };

  const handleSemesterChange = (e) => {
    e.preventDefault();
    const unlockMarks_viewport = document.getElementById(
      "unlockMarks_viewport"
    );
    unlockMarks_viewport.classList.add("hidden");
    unlockMarks_viewport.classList.remove("flex");
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
    setSelectedOptions({});
    const unlockMarks_viewport = document.getElementById(
      "unlockMarks_viewport"
    );
    unlockMarks_viewport.classList.add("hidden");
    unlockMarks_viewport.classList.remove("flex");
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

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/student_marks/fetch_subjects`,
          {
            headers,
            params: {
              student_mark: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.message === "Details found") {
            if (res.data.data.subject_ids.length !== 0) {
              axios
                .get(
                  `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/subjects`,
                  {
                    headers,
                    params: {
                      subject: {
                        course_id: selectedFilter.course_id,
                        branch_id: selectedFilter.branch_id,
                        semester_id: selectedFilter.semester_id,
                        id: JSON.stringify(res.data.data.subject_ids),
                      },
                      subdomain: subdomain,
                    },
                  }
                )
                .then((response) => {
                  const unlockMarks_viewport = document.getElementById(
                    "unlockMarks_viewport"
                  );
                  unlockMarks_viewport.classList.remove("hidden");
                  unlockMarks_viewport.classList.add("flex");
                  response.data.data.subjects.map((subject) => {
                    selectedFilter["subject_id"] = subject.id;
                    axios
                      .get(
                        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/student_marks/fetch_status`,
                        {
                          headers,
                          params: {
                            subdomain: subdomain,
                            student_mark: selectedFilter,
                          },
                        }
                      )
                      .then((res) => {
                        console.log(res);
                        if (res.data.message === "Details found") {
                          const updatedCombination = {
                            ...status,
                            [subject.id]: res.data.data.locked,
                          };
                          setStatus(updatedCombination);
                        }
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  });
                  setSubjects(response.data.data.subjects);
                })
                .catch((error) => console.log(error));
            }
          } else {
            toast.error(res.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleUnlockMarks = (e) => {
    // e.preventDefault();

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
        examination_type: type,
      };
    }

    const id = e.target.getAttribute("data-subject-id");
    console.log(id);
    selectedFilter["subject_id"] = id;

    if (id !== "") {
      if (subdomain !== null || subdomain !== "") {
        axios
          .put(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/student_marks/unlock_marks`,
            {
              subdomain: subdomain,
              student_mark: selectedFilter,
            },
            { headers }
          )
          .then((res) => {
            console.log(res);
            if (res.data.status === "ok") {
              if (res.data.data.student_marks.length !== 0) {
                const updatedCombination = { ...status, [id]: false };
                setStatus(updatedCombination);
                e.target.disabled = true;
                e.target.classList.add("cursor-not-allowed");
                toast.success(res.data.message, {
                  position: toast.POSITION.BOTTOM_LEFT,
                });
              } else {
                e.target.disabled = false;
                e.target.classList.remove("cursor-not-allowed");
              }
            } else {
              toast.error(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
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
                className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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

      <div className="pt-4 sm:ml-64">
        <div className="p-4 rounded-lg mt-14">
          <div className="text-center text-4xl">
            <p>UnLock Marks Entry </p>
          </div>

          <div className="flex mt-5 ml-2">
            <select
              id="examination_name"
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
              className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={handleCourseChange}
            >
              <option value="Select course" hidden selected>
                Course
              </option>
              {courses.map((course, index) => (
                <option value={course.id}>{course.name}</option>
              ))}
            </select>

            <select
              className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={(e) => {
                handleBranchChange(e);
              }}
            >
              <option value="Select Branch" hidden selected>
                Branch
              </option>
              {branches.map((branch) => (
                <option value={branch.id} data-name={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>

            <select
              className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={handleSemesterChange}
            >
              <option value="Select Semester" hidden selected>
                Semester
              </option>
              {semesters.map((semester) => (
                <option value={semester.id} data-semester-name={semester.name}>
                  {semester.name}
                </option>
              ))}
            </select>

            <select
              className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              onChange={handleDivisionChange}
            >
              <option value="Select Division" hidden selected>
                Division
              </option>
              {divisions.map((division) => (
                <option value={division.id} data-division-name={division.name}>
                  {division.name}
                </option>
              ))}
            </select>

            <button
              className="w-auto py-2 px-3 bg-gray-800 rounded-2xl text-white font-bold"
              onClick={handleFilterSubmit}
            >
              <p className="inline-flex">
                Search <GiArchiveResearch className="mt-1 ml-2" />
              </p>
            </button>
          </div>
          {/* Table of Faculty List */}
          <div
            id="unlockMarks_viewport"
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
                          Subject Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {subjects.map((subject, index) => {
                        if (status[subject.id]) {
                          return (
                            <tr>
                              <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {index + 1}
                              </td>
                              <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {subject.name}
                              </td>
                              <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                <button
                                  className="py-2 px-3 bg-gray-800 rounded-2xl text-white font-bold"
                                  id={"lock-mark-button-" + subject.id}
                                  data-subject-id={subject.id}
                                  onClick={handleUnlockMarks}
                                >
                                  Unlock Marks
                                </button>
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr>
                              <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {index + 1}
                              </td>
                              <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {subject.name}
                              </td>
                              <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                Pending
                              </td>
                            </tr>
                          );
                        }
                      })}
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

export default UnlockMarks;
