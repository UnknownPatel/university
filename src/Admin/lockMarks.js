import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiArchiveResearch } from "react-icons/gi";
import { MdAddCircle } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { BsLockFill } from "react-icons/bs";
import { CiViewList } from "react-icons/ci";
import LockMarkModal from "./modals/lockMarkModal";

var headers;
var subdomain;
var access_token;
var subjectIds;

const LockMarks = () => {
  const [uniName, setUniName] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [lockSubjectName, setLockSubjectName] = useState("");
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);
  const [division, setDivision] = useState([]);
  const [subjectName, setSubjectName] = useState([]);
  const [type, setType] = useState("");
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
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
  const [students, setStudents] = useState([]);
  const [removeOverFlow, setRemoveOverflow] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [marksData, setMarksData] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [status, setStatus] = useState({});
  const [lockMarkShowModal, setLockMarkShowModal] = useState(false);
  const [divisionIds, setDivisionIds] = useState([]);
  const [saveSubjects, setSaveSubjects] = useState({});

  const navigate = useNavigate();
  // const {subject_id} = useParams();
  const viewNav = useNavigate();

  var year;

  useEffect(() => {
    // var selectedFilter = [];
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
      // Authorization Details
      axios
        .get(
          `/universities/${subdomain}/get_authorization_details`
        )
        .then((response) => {
          //   console.log(response.data.university.name);
          setUniName(response.data.university.name);
        })
        .catch((err) => {
          console.log(err);
        });

      //  Get Current User Details
      axios
        .get(
          `/users/users/find_user?subdomain=${subdomain}`,
          {
            headers,
          }
        )
        .then((responce) => {
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

          // Get Examination Types
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
          setCourses([responce.data.user.course]);
          setCourseId(responce.data.user.course_id);
          setBranches([responce.data.user.branch]);
          setBranchId(responce.data.user.branch_id);
          setAcademicYears([
            responce.data.user.marks_entries.map(
              (object) => object.academic_year
            ),
          ]);
          setSelectedYear(
            responce.data.user.marks_entries.map(
              (object) => object.academic_year
            )
          );
          setExaminationName(
            responce.data.user.marks_entries.map(
              (object) => object.examination_name
            )
          );
          setType(
            responce.data.user.marks_entries.map((object) => object.entry_type)
          );
          var semesterIds = responce.data.user.marks_entries.map(
            (object) => object.semester_id
          );
          setDivisionIds(
            responce.data.user.marks_entries.map((object) => object.division_id)
          );
          var updatedCombination = {};
          responce.data.user.marks_entries.map((object) => {
            updatedCombination = {
              ...updatedCombination,
              [`${JSON.stringify(object.division_id)}`]: object.subjects,
            };
            setSaveSubjects(updatedCombination);
          });

          axios
            .get(
              `/semesters?subdomain=${subdomain}&branch_id=${responce.data.user.branch.id}&ids=${semesterIds}`,
              { headers }
            )
            .then((response) => {
              setSemesters(response.data.data.semesters);
            })
            .catch((error) => console.log(error));

          setFaculty(
            responce.data.user.first_name + " " + responce.data.user.last_name
          );
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const handleSemesterChange = (e) => {
    e.preventDefault();
    setDivisions([]);
    setSubjects([]);
    setMarksData([]);
    hideViewPort();
    if (e.target.value === "Select Semester") {
      setSemesterId("");
    } else {
      setSemesterId(e.target.value);
      axios
        .get(`/divisions?subdomain=${subdomain}`, {
          headers,
          params: {
            division: {
              semester_id: e.target.value,
            },
            ids: divisionIds,
          },
        })
        .then((response) => {
          setDivisions(response.data.data.divisions);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleDivisionChange = (e) => {
    e.preventDefault();
    setSubjects([]);
    hideViewPort();
    if (e.target.value === "Select Division") {
      setDivisionId("");
    } else {
      setDivisionId(e.target.value);
      subjectIds = saveSubjects[e.target.value].map((object) => object.id);
    }
  };

  const hideViewPort = () => {
    const viewport = document.getElementById("lockMarks_viewport");
    viewport.classList.add("hidden");
    viewport.classList.remove("flex");
  };

  const showViewport = () => {
    const viewport = document.getElementById("lockMarks_viewport");
    viewport.classList.add("flex");
    viewport.classList.remove("hidden");
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    var selectedFilter = {};
    if (semesterId === "") {
      toast.error("Please select Semester");
    } else if (divisionId === "") {
      toast.error("Please select division");
    } else {
      console.log(type);
      console.log(examinationName);
      console.log(selectedYear);
      selectedFilter = {
        examination_name: examinationName[0],
        examination_type: type[0],
        academic_year: selectedYear[0],
        course_id: courseId,
        branch_id: branchId,
        semester_id: semesterId,
        division_id: divisionId,
      };
      axios
        .get(`/student_marks/fetch_subjects`, {
          headers,
          params: {
            student_mark: selectedFilter,
            subdomain: subdomain,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.message === "Details found") {
            if (res.data.data.subject_ids.length !== 0) {
              const filterSubjectIds = res.data.data.subject_ids.filter(
                (subjectId) => subjectIds.includes(subjectId)
              );
              axios
                .get(`/subjects`, {
                  headers,
                  params: {
                    subject: {
                      course_id: selectedFilter.course_id,
                      branch_id: selectedFilter.branch_id,
                      semester_id: selectedFilter.semester_id,
                      id: JSON.stringify(filterSubjectIds),
                    },
                    subdomain: subdomain,
                  },
                })
                .then((response) => {
                  setSubjects(response.data.data.subjects);
                  var updatedCombination = {};
                  response.data.data.subjects.map((subject) => {
                    selectedFilter["subject_id"] = subject.id;
                    axios
                      .get(
                        `/student_marks/fetch_status`,
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
                          updatedCombination = {
                            ...updatedCombination,
                            [`${JSON.stringify(subject.id)}`]:
                              res.data.data.locked,
                          };
                          setStatus(updatedCombination);
                        }
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  });
                  showViewport();
                })
                .catch((error) => console.log(error));
            } else {
              toast.error("You haven't entered marks for any subject.");
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

  const handleViewMarks = (e) => {
    e.preventDefault();

    const subject_id = e.target.id;
    console.log(subject_id);
    viewNav(`/view_Marks/${subject_id}`);

    console.log(selectedFilter);
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
                className="flex items-center p-2 text-gray-900  rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Marks Entry</span>
              </a>
            </li>
            <li>
              <a
                href="/lock_Marks"
                className="flex items-center p-2 text-gray-900 bg-slate-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <p>Lock Marks Entry </p>
          </div>

          <div className="flex mt-5 ml-2">
            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
              value={examinationName}
              disabled={true}
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
              value={selectedYear}
              disabled={true}
            >
              <option value="Select Year">Year</option>
              {academic_years.map((year) => {
                return <option value={year}>{year}</option>;
              })}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              value={type}
              disabled={true}
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
              value={courseId}
              disabled={true}
            >
              <option value="Select Course">Course</option>
              {courses.map((course, index) => (
                <option value={course.id}>{course.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              value={branchId}
              disabled={true}
            >
              <option value="Select Branch">Branch</option>
              {branches.map((branch) => (
                <option value={branch.id}>{branch.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-20"
              value={semesterId}
              onChange={handleSemesterChange}
            >
              <option value="Select Semester">Semester</option>
              {semesters.map((semester) => (
                <option value={semester.id}>{semester.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-28"
              value={divisionId}
              onChange={handleDivisionChange}
            >
              <option value="Select Division">Division</option>
              {divisions.map((division) => (
                <option value={division.id}>{division.name}</option>
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
          {/* Table of Faculty List */}
          <div
            id="lockMarks_viewport"
            className="hidden flex-col overflow-y-scroll mt-5 h-[65vh] max-h-fit "
          >
            <div className="">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table className="min-w-full divide-y table-auto divide-gray-200">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
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
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {subjects.map((subject, index) => {
                        if (status[subject.id]) {
                          return (
                            <tr>
                              <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {index + 1}
                              </td>
                              <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {subject.name}
                              </td>
                              <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                <button
                                  className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-blue-600
                                  font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-500 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                                  id={subject.id}
                                  data-subject-id={subject.id}
                                  onClick={(e) => handleViewMarks(e)}
                                >
                                  View Marks
                                </button>
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr>
                              <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {index + 1}
                              </td>
                              <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {subject.name}
                              </td>
                              <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                <button
                                  className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-red-600
                                  font-semibold focus:outline-none focus:shadow-outline hover:bg-red-600 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                                  id={subject.id}
                                  data-subject-id={subject.id}
                                  onClick={(e) => {
                                    setLockMarkShowModal(true);
                                    setSubjectId(subject.id);
                                    setLockSubjectName(subject.name);
                                  }}
                                >
                                  Lock Marks
                                </button>
                                {lockMarkShowModal && (
                                  <LockMarkModal
                                    setOpenModal={setLockMarkShowModal}
                                    id={subjectId}
                                    selectedFilter={selectedFilter}
                                    setStatus={setStatus}
                                    status={status}
                                    name={lockSubjectName}
                                  />
                                )}
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
    </div>
  );
};

export default LockMarks;
