import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import SignInSuperAdmin from "../SuperAdmin/signInSuperAdmin";
// import "react-clock/dist/Clock.css";
import moment from "moment";
import { RiDeleteBin6Line } from "react-icons/ri";
import TimeModal from "./modals/timeModal";
import { ToastContainer, toast } from "react-toastify";
import TypeModal from "./modals/typeModal";
import NameModal from "./modals/nameModal";

var acces_token;
var subdomain;
var headers;
var roles = localStorage.getItem("roles");

const ExaminationDetails = () => {
  const [activeButton, setActiveButton] = useState("button1");
  const [examinationName, setExaminationName] = useState("");
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationType, setExaminationType] = useState("");
  const [maximumMarks, setMaximumMarks] = useState("");
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [examinationTimes, setExaminationTimes] = useState([]);
  const [nameShowModal, setNameShowModal] = useState(false);
  const [typeShowModal, setTypeShowModal] = useState(false);
  const [timeShowModal, setTimeShowModal] = useState(false);
  const [nameId, setNameId] = useState("");
  const [timeId, setTimeId] = useState("");
  const [typeId, setTypeId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    acces_token = localStorage.getItem("access_token");
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
          "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/examination_names",
          {
            headers,
            params: {
              subdomain: subdomain,
            },
          }
        )
        .then((responce) => {
          const name_viewport = document.getElementById(
            "examination_name_viewport"
          );
          console.log(name_viewport);
          if (responce.data.message === "Names found") {
            if (responce.data.data.examination_names.length !== 0) {
              name_viewport.classList.remove("hidden");
              name_viewport.classList.add("flex");
              setExaminationNames(responce.data.data.examination_names);
            } else {
              name_viewport.classList.add("hidden");
              name_viewport.classList.remove("flex");
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
          const viewport = document.getElementById("examination_type_viewport");
          if (responce.data.message === "Types found") {
            if (responce.data.data.examination_types.length !== 0) {
              viewport.classList.remove("hidden");
              viewport.classList.add("flex");
              setExaminationTypes(responce.data.data.examination_types);
            } else {
              viewport.classList.add("hidden");
              viewport.classList.remove("flex");
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
          const viewport = document.getElementById("examination_time_viewport");
          if (responce.data.message === "Times found") {
            if (responce.data.data.examination_times.length !== 0) {
              viewport.classList.remove("hidden");
              viewport.classList.add("flex");
              setExaminationTimes(responce.data.data.examination_times);
            } else {
              viewport.classList.add("hidden");
              viewport.classList.remove("flex");
              setExaminationTimes([]);
            }
          }
        })
        .catch(function (err) {
          console.log(err.message);
        });
    }
  }, []);

  function toggleContent(buttonId) {
    setActiveButton(buttonId);
  }

  const handleCreateExaminationName = (e) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");

    axios
      .post(
        "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/examination_names",
        {
          examination_name: {
            name: examinationName,
          },
          subdomain: subdomain,
        },
        {
          headers: {
            Authorization: `Bearer ${acces_token}`,
          },
        }
      )
      .then((responce) => {
        if (responce.data.status === "created") {
          setExaminationName("");
          toast.success(responce.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
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
              const viewport = document.getElementById(
                "examination_name_viewport"
              );
              if (responce.data.message === "Names found") {
                if (responce.data.data.examination_names.length !== 0) {
                  viewport.classList.remove("hidden");
                  viewport.classList.add("flex");
                  setExaminationNames(responce.data.data.examination_names);
                } else {
                  viewport.classList.add("hidden");
                  viewport.classList.remove("flex");
                  setExaminationNames([]);
                }
              }
            })
            .catch(function (err) {
              console.log(err.message);
            });
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };

  const handleCreateExaminationType = (e) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");

    axios
      .post(
        "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/examination_types",
        {
          examination_type: {
            name: examinationType,
            maximum_marks: maximumMarks,
          },
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
        if (responce.data.status === "created") {
          setExaminationType("");
          setMaximumMarks("");
          toast.success(responce.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
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
              const viewport = document.getElementById(
                "examination_type_viewport"
              );
              if (responce.data.message === "Types found") {
                if (responce.data.data.examination_types.length !== 0) {
                  viewport.classList.remove("hidden");
                  viewport.classList.add("flex");
                  setExaminationTypes(responce.data.data.examination_types);
                } else {
                  viewport.classList.add("hidden");
                  viewport.classList.remove("flex");
                  setExaminationTypes([]);
                }
              }
            })
            .catch(function (err) {
              console.log(err.message);
            });
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };

  const handleStartTime = (e) => {
    // e.preventDefault();
    console.log(e);
    if (e !== null) {
      var time = moment(e, "hh:mm A").format("hh:mm A");
      setStartTime(time);
    } else {
      setStartTime("");
    }
  };

  const handleEndTime = (e) => {
    if (e !== null) {
      var time = moment(e, "hh:mm A").format("hh:mm A");
      setEndTime(time);
    } else {
      setEndTime("");
    }
  };

  const handleCreateExaminationTime = (e) => {
    e.preventDefault();
    console.log(startTime + " - " + endTime);
    var name = startTime + " - " + endTime;

    if (subdomain !== null || subdomain !== "") {
      axios
        .post(
          "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/examination_times",
          {
            examination_time: {
              name: name,
            },
            subdomain: subdomain,
          },
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status === "created") {
            setStartTime("");
            setEndTime("");
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
                const viewport = document.getElementById(
                  "examination_time_viewport"
                );
                if (responce.data.status === "ok") {
                  if (responce.data.data.examination_times.length !== 0) {
                    viewport.classList.remove("hidden");
                    viewport.classList.add("flex");
                    setExaminationTimes(responce.data.data.examination_times);
                  } else {
                    viewport.classList.add("hidden");
                    viewport.classList.remove("flex");
                    setExaminationTimes([]);
                  }
                }
              })
              .catch(function (err) {
                console.log(err.message);
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      {acces_token && roles.includes("Examination Controller") ? (
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
                    className="flex items-center p-2 bg-slate-600 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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

          <div className="pt-4 sm:ml-64">
            <div className="flex flex-col items-center mt-14">
              <div className="flex justify-center space-x-4 mb-5">
                <button
                  className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                    activeButton === "button1" ? "bg-slate-800" : ""
                  }`}
                  onClick={() => toggleContent("button1")}
                >
                  Examination Name
                </button>
                <button
                  className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                    activeButton === "button2" ? "bg-slate-800" : ""
                  }`}
                  onClick={() => toggleContent("button2")}
                >
                  Examination Type
                </button>
                <button
                  className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                    activeButton === "button3" ? "bg-slate-800" : ""
                  }`}
                  onClick={() => toggleContent("button3")}
                >
                  Examination Time
                </button>
              </div>
              {/* Examination Name */}
              <div className="flex w-full">
                {/* 1 */}
                <div
                  id="content1"
                  className={`min-w-full p-4 rounded-lg ${
                    activeButton === "button1" ? "block" : "hidden"
                  }`}
                >
                  <div className="flex ml-2">
                    <div className="flex items-center">
                      <label className="mr-2">Examination Name: </label>
                      <input
                        type="text"
                        value={examinationName}
                        onChange={(e) => setExaminationName(e.target.value)}
                        className="form-input border border-gray-400 rounded p-2"
                        placeholder="Enter Examination Name"
                      />
                    </div>
                    <button
                      type="submit"
                      className="text-center ml-2 bg-green-600 text-gray-100 p-2 rounded tracking-wide
                font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-700 shadow-md cursor-pointer transition ease-in duration-300"
                      onClick={handleCreateExaminationName}
                    >
                      Submit
                    </button>
                  </div>
                  <div
                    id="examination_name_viewport"
                    className="hidden flex-col overflow-y-scroll min-h-max h-4/5 mt-5 "
                  >
                    <div className="">
                      <div className="p-1.5 w-full inline-block align-middle">
                        <div className="border rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="sticky top-0 bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                  sr.
                                </th>
                                <th
                                  scope="col"
                                  className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                                >
                                  Examination Name
                                </th>
                                <th
                                  scope="col"
                                  className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-center divide-y divide-gray-200">
                              {examinationNames.map(
                                (examination_name, index) => {
                                  return (
                                    <tr>
                                      <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        {index + 1}
                                      </td>
                                      <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        {examination_name.name}
                                      </td>
                                      <td>
                                        <button
                                          className="text-center w-auto bg-transparent text-gray-100 p-1 rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-200 shadow-lg cursor-pointer transition ease-in duration-300"
                                          onClick={() => {
                                            setNameShowModal(true);
                                            setNameId(examination_name.id);
                                          }}
                                        >
                                          <RiDeleteBin6Line
                                            size={20}
                                            className="text-red-600"
                                          />
                                        </button>
                                        {nameShowModal && (
                                          <NameModal
                                            setOpenModal={setNameShowModal}
                                            id={nameId}
                                            setNames={setExaminationNames}
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 2 */}
                <div
                  id="content2"
                  className={`min-w-full p-4 rounded-lg ${
                    activeButton === "button2" ? "block" : "hidden"
                  }`}
                >
                  <div className="flex ml-2">
                    <div className="flex items-center">
                      <label className="mr-2">Examination Type: </label>
                      <input
                        type="text"
                        value={examinationType}
                        onChange={(e) => setExaminationType(e.target.value)}
                        className="form-input border border-gray-400 rounded p-2"
                        placeholder="Enter Examination Type"
                      />
                      <label className="mr-2 ml-5">Maximum Marks: </label>
                      <input
                        type="text"
                        value={maximumMarks}
                        onChange={(e) => setMaximumMarks(e.target.value)}
                        className="form-input border border-gray-400 rounded p-2"
                        placeholder="Enter a maximum Marks"
                      />
                    </div>
                    <button
                      type="submit"
                      className="text-center ml-2 bg-green-600 text-gray-100 p-2 rounded tracking-wide
                font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-700 shadow-md cursor-pointer transition ease-in duration-300"
                      onClick={handleCreateExaminationType}
                    >
                      Submit
                    </button>
                  </div>
                  <div
                    id="examination_type_viewport"
                    className="hidden flex-col overflow-y-scroll min-h-max h-4/5 mt-5"
                  >
                    <div className="">
                      <div className="p-1.5 w-full inline-block align-middle">
                        <div className="border rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="sticky top-0 bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                  sr.
                                </th>
                                <th
                                  scope="col"
                                  className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                                >
                                  Examination Type
                                </th>
                                <th
                                  scope="col"
                                  className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                                >
                                  Maximum marks
                                </th>
                                <th
                                  scope="col"
                                  className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-center divide-y divide-gray-200">
                              {examinationTypes.map(
                                (examination_type, index) => {
                                  return (
                                    <tr>
                                      <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        {index + 1}
                                      </td>
                                      <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        {examination_type.name}
                                      </td>
                                      <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        {examination_type.maximum_marks}
                                      </td>
                                      <td>
                                        <button
                                          className="text-center w-auto bg-transparent text-gray-100 p-1 rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-200 shadow-lg cursor-pointer transition ease-in duration-300"
                                          onClick={() => {
                                            setTypeShowModal(true);
                                            setTypeId(examination_type.id);
                                          }}
                                        >
                                          <RiDeleteBin6Line
                                            size={20}
                                            className="text-red-600"
                                          />
                                        </button>
                                        {typeShowModal && (
                                          <TypeModal
                                            setOpenModal={setTypeShowModal}
                                            id={typeId}
                                            setTypes={setExaminationTypes}
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 3 */}
                <div
                  id="content3"
                  className={`min-w-full p-4 rounded-lg ${
                    activeButton === "button3" ? "block" : "hidden"
                  }`}
                >
                  <div className="flex ml-2">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <label htmlFor="">Start Time:</label>
                        <TimePicker
                          className="ml-2"
                          disableClock="true"
                          format="h:m a"
                          onChange={handleStartTime}
                          value={startTime}
                        />
                        <label htmlFor="" className="ml-3">
                          End Time:
                        </label>
                        <TimePicker
                          className="ml-2 "
                          disableClock="true"
                          format="h:m a"
                          onChange={handleEndTime}
                          value={endTime}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="text-center ml-2 bg-green-600 text-gray-100 p-1 rounded tracking-wide
                font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-700 shadow-md cursor-pointer transition ease-in duration-300"
                      onClick={handleCreateExaminationTime}
                    >
                      Submit
                    </button>
                  </div>
                  <div
                    id="examination_time_viewport"
                    className="hidden flex-col overflow-y-scroll min-h-max h-4/5 mt-5"
                  >
                    <div className="">
                      <div className="p-1.5 w-full inline-block align-middle">
                        <div className="border rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="sticky top-0 bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                  sr.
                                </th>
                                <th
                                  scope="col"
                                  className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                                >
                                  Examination Time
                                </th>
                                <th
                                  scope="col"
                                  className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-center divide-y divide-gray-200">
                              {examinationTimes.map(
                                (examination_time, index) => {
                                  return (
                                    <tr>
                                      <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        {index + 1}
                                      </td>
                                      <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        {examination_time.name}
                                      </td>
                                      <td>
                                        <button
                                          className="text-center w-auto bg-transparent text-gray-100 p-1 rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-200 shadow-lg cursor-pointer transition ease-in duration-300"
                                          onClick={() => {
                                            setTimeShowModal(true);
                                            setTimeId(examination_time.id);
                                          }}
                                        >
                                          <RiDeleteBin6Line
                                            size={20}
                                            className="text-red-600"
                                          />
                                        </button>
                                        {timeShowModal && (
                                          <TimeModal
                                            setOpenModal={setTimeShowModal}
                                            id={timeId}
                                            setTimes={setExaminationTimes}
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        navigate(-1)
      )}
    </div>
  );
};

export default ExaminationDetails;
