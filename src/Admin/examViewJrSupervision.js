import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import { FcCheckmark } from "react-icons/fc";

import { useReactToPrint } from "react-to-print";

var acces_token;
var subdomain;

const ExamViewJrSupervision = () => {
  const [uniName, setUniName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedYear3, setSelectedYear3] = useState();
  const [examinationName3, setExaminationName3] = useState("");
  const [subjectDates, setSubjectDates] = useState([]);
  const [dateCheckBox, setDateCheckBox] = useState([]);
  const [facultyName, setFacultyName] = useState([{}]);
  const [userId, setUserId] = useState("");
  const [supervisionDesignation, setSupervisionDesignation] = useState("");
  const [supervisionDepartment, setSupervisionDepartment] = useState("");
  const [displaySupervisionTable, setDisplaySupervisionTable] = useState([]);
  const componentRef3 = useRef();
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
          // setCourses(response.data.data.courses);
          // setCourses2(response.data.data.courses);
        })
        .catch((error) => console.log(error));
    }
  }, []);


  const handleExaminationChange3 = (examination) => {
    // console.log(examinationName);
    setExaminationName3(examination);
    let access_token = localStorage.getItem("access_token");
    // console.log(access_token);
    const headers = { Authorization: `Bearer ${access_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (subdomain !== null || subdomain !== "") {
      // Get Examination Dates
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates?examination_name=${examination}&academic_year=${selectedYear3}&subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          setSubjectDates(response.data.data.dates);
          // setDisplayTimeTable(response.data.data.time_tables);
        })
        .catch((error) => console.log(error));

      //  Get Faculty names
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setFacultyName(response.data.data.users);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?type=Junior&academic_year=${moment(
            selectedYear3
          ).format(
            "YYYY"
          )}&subdomain=${subdomain}&examination_name=${examination}`,
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((response) => {
          setDisplaySupervisionTable(response.data.data.supervisions);
          // setDisplayTimeTable(response.data.data.time_tables);
        })
        .catch((error) => console.log(error));
    }
  };
  const handleonChangeFacultyName = (event) => {
    setUserId(event.target.value);
    var selectedIndex = event.target.options.selectedIndex;
    setSupervisionDesignation(
      event.target.options[selectedIndex].getAttribute("data-designation")
    );
    setSupervisionDepartment(
      event.target.options[selectedIndex].getAttribute("data-department")
    );
  };
  const handlechangeDateCheckBox = (event) => {
    setDateCheckBox({
      ...dateCheckBox,
      [event.target.name]: event.target.checked,
    });
  };
  const handleYearChange3 = (date) => {
    // console.log(examinationName);
    // setDisplayTimeTable([]);
    setSelectedYear3(date);
    let access_token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${access_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates?examination_name=${examinationName3}&academic_year=${moment(
            date
          ).format("YYYY")}&subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setSubjectDates(response.data.data.dates);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setFacultyName(response.data.data.users);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?type=Junior&academic_year=${moment(
            selectedYear3
          ).format(
            "YYYY"
          )}&subdomain=${subdomain}&examination_name=${examinationName3}`,
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data.data);
          setDisplaySupervisionTable(response.data.data.supervisions);
          // setDisplayTimeTable(response.data.data.time_tables);
        })
        .catch((error) => console.log(error));
    }
  };
  const handleJuniorSupervisionSubmit = (e) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");
    const metadata = JSON.stringify(dateCheckBox);
    axios
      .post(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?subdomain=${subdomain}`,
        {
          supervision: {
            academic_year: moment(selectedYear3).format("YYYY"),
            user_id: userId,
            list_type: "Junior",
            metadata: {
              metadata,
            },
            examination_name: examinationName3,
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
          toast.success(responce.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        } else {
          toast.error(responce.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        }

        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?type=Junior&academic_year=${moment(
              selectedYear3
            ).format(
              "YYYY"
            )}&subdomain=${subdomain}&examination_name=${examinationName3}`,
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((response) => {
            // console.log(response.data.data);
            setDisplaySupervisionTable(response.data.data.supervisions);
            console.log(response.data.data.supervisions[0]);
            // setDisplayTimeTable(response.data.data.time_tables);
          })
          .catch((error) => console.log(error));
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };
  const handlePrint3 = useReactToPrint({
    content: () => componentRef3.current,
  });
  
  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

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
            </li>
          </ul>
        </div>
      </aside>

      <div className="pt-4 sm:ml-64">
        <div className="flex flex-col items-center mt-14">
          <div className="text-3xl">Jr. Supervision Report</div>
          <hr />
          <br />
          <div className="flex ml-2">
            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              // onChange={(e) => {
              //   handleExaminationChange3(e.target.value);
              // }}
            >
              <option>Select Examination</option>
              <option value="Winter">Winter</option>
              <option value="Summer">Summer</option>
            </select>

            <select
              className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              // onChange={(e) => handleYearChange3(e.target.value)}
            >
              <option value="Select Year">Select Year</option>
              {academic_years.map((year) => {
                return <option value={year}>{year}</option>;
              })}
            </select>
            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              // onChange={handleCourseChange}
            >
              <option>Select course</option>
              {/* {courses.map((course, index) => (
                <option value={course.id}>{course.name}</option>
              ))} */}
            </select>
            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 ml-4 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              // onChange={(e) => {
              //   handleBranchChange(e);
              // }}
            >
              <option>Select Branch</option>
              {/* {branches.map((branch) => (
                <option value={branch.id} data-name={branch.name}>
                  {branch.name}
                </option>
              ))} */}
            </select>
            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 ml-4 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
              // onChange={handleSemesterChange}
            >
              <option>Select Semester</option>
              {/* {semesters.map((semester) => (
                <option value={semester.id}>{semester.name}</option>
              ))} */}
            </select>

            <button
              className="py-2 px-3 ml-20 bg-gray-800 rounded-2xl text-white font-bold"
              // id={"button-subject-" + subject.id}
              // onClick={handleFilterSubmit}
            >
              Submit
            </button>
          </div>
          <div className="flex mt-5">
            <a href="#"
            //  onClick={handlePrint} 
             className="ml-4 px-3 py-2">
              Download
            </a>
          </div>
          <div className="flex flex-col" ref={componentRef3}>
                  <div className="overflow-x-auto table-auto">
                    <div className="p-1.5 min-w-full w-auto inline-block align-middle">
                      <div className="overflow-hidden rounded-lg">
                        <table className="min-w-full border divide-y divide-x rounded-lg divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Designation
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Department
                              </th>
                              {subjectDates.map((e) => (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                  <p className="flex justify-center">{e}</p>
                                </th>
                              ))}
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Sign
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {displaySupervisionTable.map((supervision) => (
                              <tr>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                  {supervision.faculty_name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {supervision.designation}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {supervision.department}
                                </td>
                                {Object.entries(
                                  JSON.parse(supervision.metadata.metadata)
                                ).map((value) => {
                                  if (value[1] === true) {
                                    return (
                                      <td className="px-6 py-4 text-sm text-gray-800 ">
                                        <p className="flex justify-center">
                                          <FcCheckmark />
                                        </p>
                                      </td>
                                    );
                                  }
                                })}
                                {/* {subjectDates.map((value) => (
                                  <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                    {Object.entries(JSON.parse(supervision.metadata.metadata))[value]}
                                  </td>
                                ))} */}
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
  )
}

export default ExamViewJrSupervision
