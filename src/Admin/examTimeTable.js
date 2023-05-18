import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";

import { useReactToPrint } from "react-to-print";

var acces_token;
var subdomain;

const ExamTimeTable = () => {
  const componentRef = useRef();
  const [uniName, setUniName] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [examinationName, setExaminationName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [storedTimeTable, setStoredTimeTable] = useState([]);

  useEffect(() => {
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
    }
  }, []);

  const createObject = (id, date, time) => {
    console.log(moment(selectedYear).format("YYYY") != "Invalid date");
    if (moment(selectedYear).format("YYYY") != "Invalid date") {
      axios
        .post(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables?subdomain=${subdomain}`,
          {
            time_table: {
              name: examinationName,
              academic_year: moment(selectedYear).format("YYYY"),
              subject_id: id,
              date: date,
              time: time,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((responce) => {
          console.log(responce.data);
          if (responce.data.status == "created") {
            const button = document.getElementById(
              "button-subject-" + id
            );
            const date = document.getElementById(
              "date-select-subject-" + id
            );
            const time = document.getElementById(
              "select-time-subject-" + id
            );
            button.disabled = true;
            button.innerHTML = "Created";
            date.disabled = true;
            date.value = responce.data.data.time_table.date;
            time.disabled = true;
            time.options[time.options.selectedIndex].text =
              responce.data.data.time_table.time;
            date.classList.add("cursor-not-allowed");
            time.classList.add("cursor-not-allowed");

            // const date_select = document.getElementById("date-select-subject-" + id)
            // const time_select = document.getElementById("select-time-subject-" + id)
            button.classList.add("cursor-not-allowed");
            // date_select.classList.add('cursor-not-allowed')
            // date_select.value = responce.data.time_table.date
            // date_select.disabled = true
            // time_select.classList.add('cursor-not-allowed')
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
    } else {
      toast.error("Please select academic year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  const handleExaminationChange = (examination) => {
    // e.preventDefault();
    // console.log(examinationName);
    setExaminationName(examination);
    // let access_token = localStorage.getItem("access_token");
    // console.log(access_token);
    // const headers = { Authorization: `Bearer ${access_token}` };
    // const host = window.location.host;
    // const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    // if (arr.length > 0) {
    //   subdomain = arr[0];
    // }
    // if (subdomain !== null || subdomain !== "") {
    //   axios
    //     .get(
    //       `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables?examination_name=${examination}&academic_year=${moment(
    //         selectedYear
    //       ).format("YYYY")}&subdomain=${subdomain}`,
    //       { headers }
    //     )
    //     .then((response) => {
    //       console.log(response.data.data);
    //       // setStoredTimeTable(response.data.data.time_tables);
    //       // setBranches(response.data.data);
    //       // console.log(branches);
    //     })
    //     .catch((error) => console.log(error));
    // }
  };

  const handleYearChange = (date) => {
    // console.log(examinationName);
    // setDisplayTimeTable([]);
    setSelectedYear(date);
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
    var course_id = e.target.value;
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
          console.log(response.data.data.branches);
          setBranches(response.data.data.branches);
          console.log(branches);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    var branch_id = e.target.value;
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
          console.log(response.data.data.semesters);
          setSemesters(response.data.data.semesters);
          // console.log(branches);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSemesterChange = (e) => {
    e.preventDefault();
    var semester_id = e.target.value;
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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/subjects?subdomain=${subdomain}&semester_id=${semester_id}`,
          { headers }
        )
        .then((response) => {
          console.log(response.data.data.subjects);
          setSubjects(response.data.data.subjects);
          response.data.data.subjects.map((subject) => {
            axios
              .get(
                `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/${subject.id}/fetch_details?subdomain=${subdomain}`,
                { headers }
              )
              .then((response) => {
                if (response.data.status == "ok") {
                  // setButtonDisabled(false);
                  // setDate2(response.data.data.time_table.date);
                  // setTime2(response.data.data.time_table.time);
                  const button = document.getElementById(
                    "button-subject-" + subject.id
                  );
                  const date = document.getElementById(
                    "date-select-subject-" + subject.id
                  );
                  const time = document.getElementById(
                    "select-time-subject-" + subject.id
                  );
                  button.disabled = true;
                  button.innerHTML = "Created";
                  date.disabled = true;
                  date.value = response.data.data.time_table.date;
                  time.disabled = true;
                  time.options[time.options.selectedIndex].text =
                    response.data.data.time_table.time;
                  date.classList.add("cursor-not-allowed");
                  time.classList.add("cursor-not-allowed");
                  button.classList.add("cursor-not-allowed");
                  console.log(response.data.data.time_table);
                  setStoredTimeTable((time_table) => [
                    ...time_table,
                    response.data.data.time_table,
                  ]);
                } else {
                  // setButtonDisabled(true);
                  // setDate2("");
                  // setTime2("");
                  toast.error(response.data.message, {
                    position: toast.POSITION.BOTTOM_LEFT,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          });
          // console.log(branches);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSubmitTimeTable = (e) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");
    console.log(examinationName);
    console.log(moment(selectedYear).format("YYYY"));
    console.log();

    // axios
    //   .post(
    //     `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables?subdomain=${subdomain}`,
    //     {
    //       time_table: {
    //         name: examinationName,
    //         academic_year: moment(selectedYear).format("YYYY"),
    //         subject_id: subjectId,
    //         date: date,
    //         time: time,
    //       },
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${acces_token}`,
    //       },
    //     }
    //   )
    //   .then((responce) => {
    //     console.log(responce.data);
    //     if (responce.data.status == "created") {
    //       toast.success(responce.data.message, {
    //         position: toast.POSITION.BOTTOM_LEFT,
    //       });
    //     } else {
    //       toast.error(responce.data.message, {
    //         position: toast.POSITION.BOTTOM_LEFT,
    //       });
    //     }
    //   })
    //   .catch(function (err) {
    //     console.log(err.message);
    //   });
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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
                  className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  href="/examReports"
                  className="flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">Reports</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <div className="p-4 sm:ml-64">
          <div className="p-4 rounded-lg mt-10">
            <div className="text-center text-4xl">
              <p>Create Time Table</p>
            </div>
            <hr className="mt-1" />
          </div>
          <div className="flex flex-col items-center space-y-4">
            {/* Button Content 1 */}
            <div className="max-w pt-6 pl-2 pb-6 rounded overflow-hidden shadow-xl">
              <div className="flex justify-center ml-28">
                <label
                  htmlFor=""
                  className="text-sm md:text-base lg:text-base mr-4"
                >
                  Select Examination:
                </label>
                <select
                  className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                  // onChange={(e) => setExaminationName(e.target.value)}
                  onChange={(e) => {
                    // setExaminationName(e.target.value)
                    handleExaminationChange(e.target.value);
                  }}
                >
                  <option>Select Examination</option>
                  <option value="Winter">Winter</option>
                  <option value="Summer">Summer</option>
                </select>

                <label
                  htmlFor="year-picker"
                  className="text-sm md:text-base lg:text-base mr-4 ml-10"
                >
                  Select year:
                </label>
                <DatePicker
                  id="year-picker1"
                  selected={selectedYear}
                  onChange={(date) => {
                    handleYearChange(date);
                  }}
                  showYearPicker
                  dateFormat="yyyy"
                  placeholderText="Select Year"
                  className="border-0 border-b-2 border-b-gray-700 shadow-md rounded px-3 py-2 w-52  justify-center"
                />
              </div>
              <div className="flex justify-center mt-5">
                <label
                  htmlFor=""
                  className="text-sm md:text-base lg:text-base mr-2"
                >
                  Select Course:
                </label>
                <select
                  className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                  onChange={handleCourseChange}
                >
                  <option>Select course</option>
                  {courses.map((course, index) => (
                    <option value={course.id}>{course.name}</option>
                  ))}
                </select>
                <label
                  htmlFor=""
                  className="text-sm md:text-base lg:text-base mr-2"
                >
                  Select Branch:
                </label>
                <select
                  className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                  onChange={handleBranchChange}
                >
                  <option>Select Branch</option>
                  {branches.map((branch) => (
                    <option value={branch.id}>{branch.name}</option>
                  ))}
                </select>
                <label
                  htmlFor=""
                  className="text-sm md:text-base lg:text-base mr-2"
                >
                  Select Semester
                </label>
                <select
                  className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                  onChange={handleSemesterChange}
                >
                  <option>Select Semester</option>
                  {semesters.map((semester) => (
                    <option value={semester.id}>{semester.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col mt-5">
              <div className="overflow-x-auto">
                <div className="p-1.5 w-full inline-block align-middle">
                  <div className="overflow-hidden border rounded-lg">
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
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {subjects.map((subject) => (
                          <tr>
                            <td
                              className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                              data-id={subject.id}
                            >
                              {subject.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {subject.code}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <input
                                className="shadow appearance-none border rounded w-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id={"date-select-subject-" + subject.id}
                                onChange={(e) => setDate(e.target.value)}
                                type="date"
                                // disabled={true}
                                required
                              />
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <select
                                id={"select-time-subject-" + subject.id}
                                className="form-select text-sm md:text-sm lg:text-sm mr-2 border-2 select-code"
                                onChange={(e) => setTime(e.target.value)}
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
                                onClick={() =>
                                  createObject(subject.id, date, time)
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
            <div className="flex justify-evenly text-center mt-10"></div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExamTimeTable;
