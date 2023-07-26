import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { GiArchiveResearch, GiSausagesRibbon } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContactDetailsModel from "./modals/contactDetailsModel";
import BasicDetailsModal from "./modals/basicDetailsModal";
import AddressDetailsModal from "./modals/addressDetailsModal";
import ParentDetailsModal from "./modals/parentDetailsModal";
import GuardianDetailsModal from "./modals/guardianDetailsModal";

var acces_token;
var headers;
var subdomain;

const StudentCoordinatorHome = () => {
  const navigate = useNavigate();
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [students, setStudents] = useState([]);
  const [hidden, setHidden] = useState(true);
  const [contactDetailsShowModal, setContactDetailsShowModal] = useState(false);
  const [BasicInfoShowModal, setBasicInfoShowModal] = useState(false);
  const [addressShowModal, setAddressShowModal] = useState(false);
  const [parentShowModal, setParentShowModal] = useState(false);
  const [guardianDetailsShowModal, setGuardianDetailsShowModal] =
    useState(false);

  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    acces_token = localStorage.getItem("access_token");
    const roles = localStorage.getItem("roles");

    headers = { Authorization: `Bearer ${acces_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }

    if (subdomain !== null || subdomain !== "") {
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

      axios
        .get(
          `/users/users/find_user?subdomain=${subdomain}`,
          {
            headers,
          }
        )
        .then((responce) => {
          setFaculty(
            responce.data.user.first_name + " " + responce.data.user.last_name
          );
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `/courses?subdomain=${subdomain}`,
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

  const handleCourseChange = (e) => {
    e.preventDefault();

    setSemesters([]);
    setBranches([]);
    setHidden(true);
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
          `/branches?subdomain=${subdomain}&course_id=${course_id}`,
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
    setSemesters([]);
    setHidden(true);
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
          `/semesters?subdomain=${subdomain}&branch_id=${branch_id}`,
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
    setHidden(true);
    if (e.target.value === "Select Semester") {
      setSemesterId("");
    } else {
      setSemesterId(e.target.value);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    var selectedFilter = {};
    if (courseId === "") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (branchId === "") {
      toast.error("Please select Branch", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (semesterId === "") {
      toast.error("Please select Semester", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        courseId: courseId,
        branchId: branchId,
        semesterId: semesterId,
      };
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `/students`,
          {
            headers,
            params: {
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          if (response.data.status == "ok") {
            if (response.data.data.students !== 0) {
              setHidden(false);
              setStudents(response.data.data.students);
            } else {
              setHidden(true);
              toast.error("Students Not Found", {
                position: toast.POSITION.BOTTOM_LEFT,
              });
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
                href="/student_coordinator_homePage"
                className="flex items-center p-2 bg-slate-600 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Students Detais</span>
              </a>
            </li>
            <li>
              <a
                href="/feeDetails"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">fee Detais</span>
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
            <p>Details</p>
          </div>

          <div className="flex mt-5 ml-2">
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
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleSemesterChange}
            >
              <option value="Select Semester">Semester</option>
              {semesters.map((semester) => (
                <option value={semester.id}>{semester.name}</option>
              ))}
            </select>

            <button
              id="submit-button"
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
            id="time_table_viewport"
            className={`${
              hidden ? "hidden" : "flex"
            } flex-col overflow-y-scroll mt-5 h-[60vh] max-h-fit`}
          >
            <div className="">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table className="min-w-full divide-y table-auto divide-gray-200">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                        >
                          Student Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Basic Information
                        </th>
                        <th
                          scope="col"
                          className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
                        >
                          Address Detais
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Parent Details
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Contact Details
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Guardian Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr>
                          <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {student.name}
                          </td>
                          {/* Basic Info */}
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <button
                              className="text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-600 hover:text-slate-50 hover:border-none shadow-lg cursor-pointer transition ease-in duration-300"
                              onClick={(e) => {
                                setBasicInfoShowModal(true);
                                setStudentId(student.id);
                              }}
                            >
                              Update
                            </button>
                            {BasicInfoShowModal && (
                              <BasicDetailsModal
                                setOpenModal={setBasicInfoShowModal}
                                id={studentId}
                                accesToken={acces_token}
                                headers={headers}
                                subdomain={subdomain}
                              />
                            )}
                          </td>
                          {/* Address Info */}
                          <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                            <button
                              className="text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-600 hover:text-slate-50 hover:border-none shadow-lg cursor-pointer transition ease-in duration-300"
                              onClick={(e) => {
                                setAddressShowModal(true);
                                setStudentId(student.id);
                              }}
                            >
                              Update
                            </button>
                            {addressShowModal && (
                              <AddressDetailsModal
                                setOpenModal={setAddressShowModal}
                                id={studentId}
                                accesToken={acces_token}
                                headers={headers}
                                subdomain={subdomain}
                              />
                            )}
                          </td>
                          {/* Parent Info */}
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <button
                              className="text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-600 hover:text-slate-50 hover:border-none shadow-lg cursor-pointer transition ease-in duration-300"
                              onClick={(e) => {
                                setParentShowModal(true);
                                setStudentId(student.id);
                              }}
                            >
                              Update
                            </button>
                            {parentShowModal && (
                              <ParentDetailsModal
                                setOpenModal={setParentShowModal}
                                id={studentId}
                                accesToken={acces_token}
                                headers={headers}
                                subdomain={subdomain}
                              />
                            )}
                          </td>
                          {/* Contact Info */}
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <button
                              className="text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-600 hover:text-slate-50 hover:border-none shadow-lg cursor-pointer transition ease-in duration-300"
                              onClick={(e) => {
                                setContactDetailsShowModal(true);
                                setStudentId(student.id);
                              }}
                            >
                              Update
                            </button>
                            {contactDetailsShowModal && (
                              <ContactDetailsModel
                                setOpenModal={setContactDetailsShowModal}
                                id={studentId}
                                accesToken={acces_token}
                                headers={headers}
                                subdomain={subdomain}
                              />
                            )}
                          </td>
                          {/* Gardian Info */}
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <button
                              className="text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-600 hover:text-slate-50 hover:border-none shadow-lg cursor-pointer transition ease-in duration-300"
                              onClick={(e) => {
                                setGuardianDetailsShowModal(true);
                                setStudentId(student.id);
                              }}
                            >
                              Update
                            </button>
                            {guardianDetailsShowModal && (
                              <GuardianDetailsModal
                                setOpenModal={setGuardianDetailsShowModal}
                                id={studentId}
                                accesToken={acces_token}
                                headers={headers}
                                subdomain={subdomain}
                              />
                            )}
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
  );
};

export default StudentCoordinatorHome;
