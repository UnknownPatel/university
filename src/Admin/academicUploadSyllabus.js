import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiArchiveResearch } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import numberToWords from "number-to-words";
import { MdAddCircle } from "react-icons/md";
import { responsiveArray } from "antd/es/_util/responsiveObserver";

var access_token;
var subdomain;
var year;
var headers;

const AcademicUploadSyllabus = () => {
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const navigate = useNavigate();
  const [academic_years, setAcademicYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [courseId, setCourseId] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchesName, setBranchesName] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesterName, setSemesterName] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    access_token = localStorage.getItem("access_token");
    const roles = localStorage.getItem("roles");

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
      // if (access_token) {
      //   axios
      //     .get(
      //       `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/find_user?subdomain=${subdomain}`,
      //       {
      //         headers: {
      //           Authorization: `Bearer ${access_token}`,
      //         },
      //       }
      //     )
      //     .then((responce) => {
      //       // console.log(responce);
      //       // console.log(responce.data.roles);
      //       if (responce.data.roles.length !== 0) {
      //         roles = responce.data.roles;
      //       } else {
      //         roles = [];
      //       }
      //     })
      //     .catch((error) => console.log(error));
      // }

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
    }
    if (roles === null) {
      toast.error("Something went wrong, please Try Again!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, []);

  const handleYearChange = (date) => {
    if (date !== "Select Year") {
      setSelectedYear(date);
    } else {
      setSelectedYear("");
    }
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
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
  };

  const handleSemesterChange = (e) => {
    e.preventDefault();
    var selectedIndex = e.target.options.selectedIndex;

    if (e.target.value === "Select Semester") {
      setSemesterId("");
    } else {
      setSemesterId(e.target.value);
      setSemesterName(
        numberToWords.toOrdinal(
          e.target.options[selectedIndex].getAttribute("data-semester-name")
        ) + " Semester"
      );
    }
  };

  const handleFilterSubmit = (e) => {
    let selectedFilter = {};
    if (selectedYear === "") {
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
    } else {
      selectedFilter = {
        academic_year: selectedYear,
        course_id: courseId,
        branch_id: branchId,
        semester_id: semesterId,
      };

      const viewport = document.getElementById("syllabus_viewport");

      if (subdomain !== "" || subdomain !== null) {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/subjects`,
            {
              headers,
              params: {
                subject: selectedFilter,
                subdomain: subdomain,
              },
            }
          )
          .then((response) => {
            if (response.data.status === "ok") {
              if (response.data.data.subjects.length !== 0) {
                viewport.classList.remove("hidden");
                viewport.classList.add("flex");
                setSubjects(response.data.data.subjects);
                response.data.data.subjects.map((subject) => {
                  selectedFilter["subject_id"] = subject.id;
                  axios
                    .get(
                      `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/syllabuses/${subject.id}/fetch_details`,
                      {
                        headers,
                        params: {
                          subdomain: subdomain,
                          syllabus: selectedFilter,
                        },
                      }
                    )
                    .then((res) => {
                      const syllabusButton = document.getElementById(
                        "button-subject-" + subject.id
                      );
                      if (res.data.status === "ok") {
                        if (res.data.data.syllabus.length !== 0) {
                          syllabusButton.innerHTML = "Update";
                          syllabusButton.setAttribute(
                            "data-syllabus-id",
                            res.data.data.syllabus.id
                          );
                        }
                      } else {
                        syllabusButton.innerHTML = "Create";
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                });
              } else {
                setSubjects([]);
                viewport.classList.add("hidden");
                viewport.classList.remove("flex");
              }
            }
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const createObject = (e, subject_id) => {
    e.preventDefault();
    let selectedFilter = {};

    if (subject_id === "") {
      toast.error("Something went wrong, please try again!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedFile === "") {
      toast.error("Please select a file", {
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
    } else {
      selectedFilter = {
        academic_year: selectedYear,
        course_id: courseId,
        branch_id: branchId,
        semester_id: semesterId,
        subject_id: subject_id,
        syllabus_pdf: selectedFile,
      };

      if (subdomain !== "" || subdomain !== null) {
        if (e.target.innerHTML === "Update") {
          var syllabus_id = e.target.getAttribute("data-syllabus-id");
          axios
            .put(
              `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/syllabuses/${syllabus_id}`,
              {
                subdomain: subdomain,
                syllabus: selectedFilter,
              },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              if (res.data.status === "ok") {
                toast.success("Syllabus has been updated", {
                  position: toast.POSITION.BOTTOM_LEFT,
                });
              } else {
                toast.error(res.data.message, {
                  position: toast.POSITION.BOTTOM_LEFT,
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          axios
            .post(
              "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/syllabuses",
              {
                subdomain: subdomain,
                syllabus: selectedFilter,
              },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              if (res.data.status === "ok") {
                e.target.innerHTML = "Update";
                e.target.setAttribute(
                  "data-syllabus-id",
                  res.data.data.syllabus.id
                );

                toast.success("Syllabus has been created", {
                  position: toast.POSITION.BOTTOM_LEFT,
                });
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
        localStorage.getItem("roles").includes("Academic Head") ? (
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
                      href="/academic_UploadSyllabus"
                      className="flex items-center p-2 text-gray-900 bg-slate-600 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="ml-3">Upload Syllabus</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/academic_CreactCertificate"
                      className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="ml-3">Certificate</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="ml-3">Certificate Request</span>
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
                  <p>Upload Syllabus</p>
                </div>

                <div className="flex mt-5 ml-2">
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
                  <button
                    className="py-2 px-3 mr-7 ml-2 bg-gray-800 rounded-2xl text-white font-bold"
                    onClick={handleFilterSubmit}
                  >
                    <p className="inline-flex">
                      Search <GiArchiveResearch className="mt-1 ml-2" />
                    </p>
                  </button>
                </div>
                <div
                  id="syllabus_viewport"
                  className="hidden flex-col mt-5"
                  style={{ height: 485 }}
                >
                  <div className="overflow-x-scroll">
                    <div className="p-1.5 w-full inline-block align-middle">
                      <div className="border rounded-lg">
                        <table
                          id="my-table"
                          className="min-w-full divide-y table-auto text-center divide-gray-200"
                        >
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
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Select File
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                              >
                                Upload
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
                                <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  <input
                                    type="file"
                                    id="file_input"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-blue-100"
                                    onChange={(e) =>
                                      setSelectedFile(e.target.files[0])
                                    }
                                    accept=".pdf"
                                  />
                                </td>
                                <td
                                  className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                                  data-id={subject.id}
                                >
                                  <button
                                    className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                    id={"button-subject-" + subject.id}
                                    onClick={(e) => createObject(e, subject.id)}
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
          </div>
        ) : (
          navigate(-1)
        )
      ) : (
        // toast.error("Something went wrong, please Try Again!", {
        // //   position: toast.POSITION.BOTTOM_LEFT,
        // // })
        navigate("/")
      )}
      {/* {access_token && roles.includes("Academic Head") ? (
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
                    href="/academic_UploadSyllabus"
                    className="flex items-center p-2 text-gray-900 bg-slate-600 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="ml-3">Upload Syllabus</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/academic_CreactCertificate"
                    className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="ml-3">Certificate</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="ml-3">Certificate Request</span>
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
                <p>Upload Syllabus</p>
              </div>

              <div className="flex mt-5 ml-2">
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
                <button
                  className="py-2 px-3 mr-7 ml-2 bg-gray-800 rounded-2xl text-white font-bold"
                  onClick={handleFilterSubmit}
                >
                  <p className="inline-flex">
                    Search <GiArchiveResearch className="mt-1 ml-2" />
                  </p>
                </button>
              </div>
              <div
                id="syllabus_viewport"
                className="hidden flex-col mt-5"
                style={{ height: 485 }}
              >
                <div className="overflow-x-scroll">
                  <div className="p-1.5 w-full inline-block align-middle">
                    <div className="border rounded-lg">
                      <table
                        id="my-table"
                        className="min-w-full divide-y table-auto text-center divide-gray-200"
                      >
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
                              className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                            >
                              Select File
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                            >
                              Upload
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
                              <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                <input
                                  type="file"
                                  id="file_input"
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-blue-100"
                                  onChange={(e) =>
                                    setSelectedFile(e.target.files[0])
                                  }
                                  accept=".pdf"
                                />
                              </td>
                              <td
                                className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                                data-id={subject.id}
                              >
                                <button
                                  className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                  id={"button-subject-" + subject.id}
                                  onClick={(e) => createObject(e, subject.id)}
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
        </div>
      ) : (
        navigate(-1)
      )} */}
    </div>
  );
};

export default AcademicUploadSyllabus;
