import axios, { Axios } from "axios";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { FcDownload } from "react-icons/fc";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from "react-to-print";
import { ToastContainer, toast } from "react-toastify";
import Multiselect from "multiselect-react-dropdown";
import { GiArchiveResearch } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";

var access_token;
var subdomain;
var year;
var headers;
var options_2;
var options;
var url;

const AssignMarksEntry = () => {
  const componentRef = useRef();
  const tableRef = useRef(null);
  const [uniName, setUniName] = useState("");
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
  const [faculty, setFaculty] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [type, setType] = useState("");
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [subjectIds, setSubjectIds] = useState({});
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [isExaminationLoading, setIsExaminationLoading] = useState(true);
  const [isTypeLoading, setIsTypeLoading] = useState(true);
  const [isBranchLoading, setIsBranchLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    access_token = localStorage.getItem("access_token");
    const roles = localStorage.getItem("roles");
    url = window.location.protocol + "//" + window.location.host;
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
          console.log(responce.data);
          setFaculty(
            responce.data.user.first_name + " " + responce.data.user.last_name
          );
          setCourseId(responce.data.user.course_id);
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
            })
            .finally(() => {
              setIsExaminationLoading(false);
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
            })
            .finally(() => {
              setIsTypeLoading(false);
            });

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
        .catch((error) => console.log(error))
        .finally(() => {
          setIsBranchLoading(false);
        });
    }
    if (roles === null) {
      toast.error("Something went wrong, please Try Again!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, []);

  const handleExaminationChange = (examination) => {
    setSelectedOptions({});
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    marks_entry_viewport.classList.add("hidden");
    marks_entry_viewport.classList.remove("flex");
    setExaminationName(examination);
  };

  const handleYearChange = (date) => {
    setSelectedOptions({});
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    marks_entry_viewport.classList.add("hidden");
    marks_entry_viewport.classList.remove("flex");
    if (date !== "Select Year") {
      setSelectedYear(date);
    } else {
      setSelectedYear("");
    }
  };

  const handleTypeChange = (e) => {
    e.preventDefault();
    setSubjects([]);
    setSelectedOptions({});
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    marks_entry_viewport.classList.add("hidden");
    marks_entry_viewport.classList.remove("flex");
    if (e.target.value === "Select Type") {
      setType("");
    } else {
      setType(e.target.value);
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    setSemesters([]);
    setDivisions([]);
    setSelectedOptions({});
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    marks_entry_viewport.classList.add("hidden");
    marks_entry_viewport.classList.remove("flex");
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
        .get(`/semesters?subdomain=${subdomain}&branch_id=${branch_id}`, {
          headers,
        })
        .then((response) => {
          setSemesters(response.data.data.semesters);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSemesterChange = (e) => {
    e.preventDefault();
    setDivisions([]);
    setSelectedOptions({});
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
    );
    marks_entry_viewport.classList.add("hidden");
    marks_entry_viewport.classList.remove("flex");
    if (e.target.value === "Select Semester") {
      setSemesterId("");
    } else {
      setSemesterId(e.target.value);
      if (subdomain !== null || subdomain !== "") {
        axios
          .get(`/divisions`, {
            headers,
            params: {
              subdomain: subdomain,
              division: {
                semester_id: e.target.value,
              },
            },
          })
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
    const marks_entry_viewport = document.getElementById(
      "marks_entry_viewport"
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
    options_2 = undefined;
    setSelectedOptions({});
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
        .get(`/users/users/faculty_names`, {
          headers,
          params: {
            user: selectedFilter,
            request_from: "marks_entry",
            subdomain: subdomain,
          },
        })
        .then((response) => {
          if (response.data.status === "ok") {
            setFaculties(response.data.data.users);
            const viewport = document.getElementById("marks_entry_viewport");
            viewport.classList.remove("hidden");
            viewport.classList.add("flex");
            response.data.data.users.map((faculty) => {
              selectedFilter["user_id"] = faculty.id;
              axios
                .get(`/marks_entries/${faculty.id}/fetch_details`, {
                  headers,
                  params: {
                    subdomain: subdomain,
                    marks_entry: selectedFilter,
                  },
                })
                .then((res) => {
                  const button = document.getElementById(
                    "button-faculty-" + faculty.id
                  );

                  if (res.data.message === "Details found") {
                    console.log("Hello");
                    console.log(res.data.data.marks_entry);
                    setSelectedOptions((prevSelectedValues) => ({
                      ...prevSelectedValues,
                      [faculty.id]: res.data.data.marks_entry.subjects.map(
                        (subject) => {
                          return {
                            key: `${subject.id}`,
                            value: `${subject.name}`,
                          };
                        }
                      ),
                    }));
                    button.setAttribute(
                      "data-marks-entry-id",
                      res.data.data.marks_entry.id
                    );
                    button.innerHTML = "Update";
                  } else {
                    button.removeAttribute("data-marks-entry-id");
                    button.innerHTML = "Create";
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            });
          }
        })
        .catch((error) => console.log(error));

      axios
        .get(`/subjects`, {
          headers,
          params: {
            subject: selectedFilter,
            subdomain: subdomain,
          },
        })
        .then((response) => {
          if (response.data.status === "ok") {
            if (response.data.data.subjects.length !== 0) {
              setSubjects(response.data.data.subjects);
              options_2 = response.data.data.subjects.map((subject) => {
                return { key: `${subject.id}`, value: subject.name };
              });
            } else {
              setSubjects([]);
            }
          } else {
            setSubjects([]);
            options_2 = undefined;
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const onSelect = (selectedList, faculty_id) => {
    var subject_ids = selectedList.map((option) => option.key);
    setSelectedOptions((prevSelectedValues) => ({
      ...prevSelectedValues,
      [faculty_id]: selectedList,
    }));

    setSubjectIds((prevSelectedValues) => ({
      ...prevSelectedValues,
      [faculty_id]: subject_ids,
    }));
  };

  const onRemove = (selectedList, faculty_id) => {
    var subject_ids = selectedList.map((option) => option.key);

    setSelectedOptions((prevSelectedValues) => ({
      ...prevSelectedValues,
      [faculty_id]: selectedList,
    }));
    setSubjectIds((prevSelectedValues) => ({
      ...prevSelectedValues,
      [faculty_id]: subject_ids,
    }));
  };

  const createObject = (e) => {
    e.preventDefault();
    e.target.disabled = true;
    e.target.classList.add("cursor-not-allowed");
    let selectedFilter = {};
    var faculty_id = e.target.getAttribute("data-id");
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
        entry_type: type,
        division_id: divisionId,
        user_id: faculty_id,
        subject_ids: subjectIds[faculty_id],
      };
    }

    if (subdomain !== null || subdomain !== "") {
      if (e.target.innerHTML === "Update") {
        e.target.innerHTML = "Assigning ...";
        var marks_entry_id = e.target.getAttribute("data-marks-entry-id");
        axios
          .put(
            `/marks_entries/${marks_entry_id}`,
            {
              subdomain: subdomain,
              marks_entry: selectedFilter,
              url: url,
            },
            {
              headers,
            }
          )
          .then((res) => {
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            e.target.innerHTML = "Update";
            if (res.data.message === "Update successful") {
              const button = document.getElementById("search-button");
              button.click();
              toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            } else {
              toast.error(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          })
          .catch((err) => {
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            e.target.innerHTML = "Update";
            console.error(err);
          });
      } else {
        e.target.innerHTML = "Assigning ...";
        axios
          .post(
            `/marks_entries`,
            {
              subdomain: subdomain,
              marks_entry: selectedFilter,
              url: url,
            },
            {
              headers,
            }
          )
          .then((responce) => {
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            const marksEntryCreateButton = document.getElementById(
              "button-faculty-" + faculty_id
            );
            if (responce.data.status === "created") {
              e.target.setAttribute(
                "data-marks-entry-id",
                responce.data.data.marks_entry.id
              );

              setSelectedOptions((prevSelectedValues) => ({
                ...prevSelectedValues,
                [faculty_id]: responce.data.data.marks_entry.subjects.map(
                  (subject) => {
                    return { key: subject.id, value: subject.name };
                  }
                ),
              }));
              marksEntryCreateButton.innerHTML = "Update";
              toast.success(responce.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            } else {
              marksEntryCreateButton.innerHTML = "Create";
              toast.error(responce.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          })
          .catch(function (err) {
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            e.target.innerHTML = "Create";
            console.log(err.message);
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
                      className="flex items-center p-2 bg-slate-600 text-gray-900  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                <div className="text-center text-4xl">
                  <h3 className="mt-2 text-3xl font-bold text-gray-900">
                    Assign Marks Entry
                  </h3>
                </div>
                {isExaminationLoading || isBranchLoading || isTypeLoading ? (
                  <>
                    <div className="flex items-center justify-center mt-10 w-full">
                      <Loader width={"w-10"} height={"h-10"} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col justify-start mt-5">
                      <div className="flex flex-row w-full mt-5 bg-white rounded-xl z-10">
                        {/* Examination Name */}
                        <div className="flex flex-row">
                          <div className="relative text-left w-full">
                            <select
                              id="examination_name"
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

                        {/* Academic Year */}
                        <div className="flex flex-row">
                          <div className="relative text-left w-full">
                            <select
                              id="academicYear"
                              className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                              onChange={(e) => handleYearChange(e.target.value)}
                            >
                              <option
                                value="Select Year"
                                className="text-gray-600"
                              >
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

                        {/* Examination Type */}
                        <div className="flex flex-row">
                          <div className="relative text-left w-full">
                            <select
                              id="examinationType"
                              className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                              onChange={handleTypeChange}
                            >
                              <option
                                value="Select Type"
                                className="text-gray-600"
                              >
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

                        {/* Branch Name */}
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

                        {/* Semester Name */}
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

                        {/* Division Name */}
                        <div className="flex flex-row">
                          <div className="relative text-left w-full">
                            <select
                              id="division"
                              className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                              onChange={handleDivisionChange}
                            >
                              <option
                                value="Select Division"
                                className="text-gray-600"
                              >
                                Division
                              </option>
                              {divisions.map((division) => (
                                <option
                                  value={division.id}
                                  data-division-name={division.name}
                                  className="text-black font-bold"
                                >
                                  {division.name}
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

                        {/* Search Button */}
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
                  </>
                )}
              </div>
              <div
                id="marks_entry_viewport"
                className="hidden flex-col overflow-y-scroll mt-5 h-[75vh] max-h-fit"
                ref={componentRef}
              >
                <div ref={tableRef} id="table-viewport" className="">
                  <div className="p-1.5 w-full inline-block align-middle">
                    <div className="border rounded-lg">
                      <table className="min-w-full table-fixed divide-y divide-gray-200">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                              Faculty Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                            >
                              Designation
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                            >
                              Department
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase ">
                              Subject
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase ">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {faculties.map((faculty) => (
                            <tr>
                              <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                {faculty.first_name} {faculty.last_name}
                              </td>
                              <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                                {faculty.designation}
                              </td>
                              <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                                {faculty.department}
                              </td>
                              <td className="px-6 py-4 text-sm flex justify-center text-gray-800 whitespace-nowrap">
                                <Multiselect
                                  options={options_2}
                                  showCheckbox={true}
                                  id={"marks-entry-" + faculty.id}
                                  displayValue="value"
                                  selectedValues={selectedOptions[faculty.id]}
                                  onSelect={(e) => onSelect(e, faculty.id)}
                                  onRemove={(e) => onRemove(e, faculty.id)}
                                  style={{
                                    multiselectContainer: {
                                      width: "250px",
                                      margin: "10px",
                                    },
                                    searchBox: {
                                      fontSize: "14px",
                                      overflowX: "auto",
                                    },
                                    inputField: {
                                      overflow: "hidden", // Hide overflowing content
                                    },
                                    chips: {
                                      fontSize: "12px",
                                    },
                                    optionContainer: {
                                      fontSize: "14px",
                                    },
                                    option: {
                                      fontSize: "14px",
                                    },
                                  }}
                                />
                              </td>
                              <td
                                className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap"
                                data-id={faculty.id}
                              >
                                <button
                                  className="text-center w-auto bg-transparent text-slate-950 p-4 rounded-2xl tracking-wide border border-slate-950
                                font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 hover:text-white hover:border-white shadow-lg transition ease-in duration-300"
                                  id={"button-faculty-" + faculty.id}
                                  data-id={faculty.id}
                                  onClick={(e) => createObject(e)}
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
        ) : (
          navigate(-1)
        )
      ) : (
        navigate("/")
      )}
      {/* {access_token && roles.includes("Examination Controller") ? (
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
                    className="flex items-center p-2 bg-slate-600 text-gray-900  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <div className="p-4 rounded-lg mt-10">
              <div className="text-center text-4xl">
                <p>Assign Marks Entry</p>
              </div>
            </div>

            <div className="flex mt-5 ml-2">
              <select
                id="examination_name"
                className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                onChange={(e) => {
                  handleExaminationChange(e.target.value);
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
                className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                onChange={(e) => handleYearChange(e.target.value)}
              >
                <option value="Select Year">Year</option>
                {academic_years.map((year) => {
                  return <option value={year}>{year}</option>;
                })}
              </select>

              <select
                className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
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
                className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                onChange={handleCourseChange}
              >
                <option value="Select course">Course</option>
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
                <option value="Select Branch">Branch</option>
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
                <option value="Select Semester">Semester</option>
                {semesters.map((semester) => (
                  <option
                    value={semester.id}
                    data-semester-name={semester.name}
                  >
                    {semester.name}
                  </option>
                ))}
              </select>

              <select
                className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                onChange={handleDivisionChange}
              >
                <option value="Select Division">Division</option>
                {divisions.map((division) => (
                  <option
                    value={division.id}
                    data-division-name={division.name}
                  >
                    {division.name}
                  </option>
                ))}
              </select>

              <button
                className="text-center ml-4 w-auto bg-transparent text-slate-950 p-3 rounded-2xl tracking-wide border border-slate-950
                font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-700 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={handleFilterSubmit}
              >
                <p className="inline-flex">
                  Search <GiArchiveResearch className="mt-1 ml-2" />
                </p>
              </button>
            </div>

            <div
              id="marks_entry_viewport"
              className="hidden flex-col overflow-y-scroll mt-5 h-[65vh] max-h-fit"
              ref={componentRef}
            >
              <div ref={tableRef} id="table-viewport" className="">
                <div className="p-1.5 w-full inline-block align-middle">
                  <div className="border rounded-lg">
                    <table className="min-w-full table-fixed divide-y divide-gray-200">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                            Faculty Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                          >
                            Designation
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                          >
                            Department
                          </th>
                          <th className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase ">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase ">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {faculties.map((faculty) => (
                          <tr>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                              {faculty.first_name} {faculty.last_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                              {faculty.designation}
                            </td>
                            <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                              {faculty.department}
                            </td>
                            <td className="px-6 py-4 text-sm flex justify-center text-gray-800 whitespace-nowrap">
                              <Multiselect
                                options={options_2}
                                showCheckbox={true}
                                id={"marks-entry-" + faculty.id}
                                displayValue="value"
                                selectedValues={selectedOptions[faculty.id]}
                                onSelect={(e) => onSelect(e, faculty.id)}
                                onRemove={(e) => onRemove(e, faculty.id)}
                                style={{
                                  multiselectContainer: {
                                    width: "250px",
                                    margin: "10px",
                                  },
                                  searchBox: {
                                    fontSize: "14px",
                                    overflowX: "auto",
                                  },
                                  inputField: {
                                    overflow: "hidden", // Hide overflowing content
                                  },
                                  chips: {
                                    fontSize: "12px",
                                  },
                                  optionContainer: {
                                    fontSize: "14px",
                                  },
                                  option: {
                                    fontSize: "14px",
                                  },
                                }}
                              />
                            </td>
                            <td
                              className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap"
                              data-id={faculty.id}
                            >
                              <button
                                className="text-center w-auto bg-transparent text-slate-950 p-4 rounded-2xl tracking-wide border border-slate-950
                                font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 hover:text-white hover:border-white shadow-lg transition ease-in duration-300"
                                id={"button-faculty-" + faculty.id}
                                data-id={faculty.id}
                                onClick={(e) => createObject(e)}
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
      ) : (
        navigate(-1)
      )} */}
    </div>
  );
};

export default AssignMarksEntry;
