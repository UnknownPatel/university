import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import { FcCheckmark } from "react-icons/fc";
import { FcDownload } from "react-icons/fc";
import { FcPrint } from "react-icons/fc";

import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";


var acces_token;
var subdomain;
var headers;

const ExamViewOtherDuty = () => {
  const [uniName, setUniName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedYear5, setSelectedYear5] = useState();
  const [examinationName5, setExaminationName5] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [branchesName, setBranchesName] = useState("");
  const [otherDutyTable, setOtherDutyTable] = useState([]);

  const [staffName, setStaffName] = useState([{}]);
  const [staffUserId, setStaffUserId] = useState("");
  const [staffDesignation, setStaffDesignation] = useState("");
  const [assignDuty, setAssignDuty] = useState();
  const [displayOtherDutyTable, setDisplayOtherDutyTable] = useState([]);
  const [displaySupervisionTable, setDisplaySupervisionTable] = useState([]);
  const [subjectDates, setSubjectDates] = useState([]);

  const componentRef5 = useRef();
  const tableRef = useRef(null);


  var year;
  var other_duty_date;
  var divStyle = {
    height: "400px",
    overflowY: "auto",
  };

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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/courses?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setCourses(response.data.data.courses);
          // setCourses2(response.data.data.courses);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleExaminationChange5 = (examination3) => {
    setExaminationName5(examination3);
  };
  const handleYearChange5 = (date) => {
    if (date !== "Select Year") {
      setSelectedYear5(date);
    } else {
      setSelectedYear5("");
    }
  };
  const handleCourseChange = (e) => {
    e.preventDefault();
    setCourseId("");
    setBranches([]);
    setBranchId("");
    const other_duty_report_viewport = document.getElementById(
      "other_duty_report_viewport"
    );
    other_duty_report_viewport.classList.add("hidden");
    other_duty_report_viewport.classList.remove("flex");
    const download_button = document.getElementById("download_button");
    download_button.classList.add("hidden");
    if (e.target.value !== "Select Course") {
      setCourseId(e.target.value);
      acces_token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${acces_token}` };
      const host = window.location.host;
      const arr = host
        .split(".")
        .slice(0, host.includes("localhost") ? -1 : -2);
      if (arr.length > 0) {
        subdomain = arr[0];
      }
      if (subdomain !== null || subdomain !== "") {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/branches`,
            {
              headers,
              params: {
                subdomain: subdomain,
                course_id: e.target.value,
              },
            }
          )
          .then((response) => {
            console.log(response);
            setBranches(response.data.data.branches);
          })
          .catch((error) => console.log(error));
      }
    } else {
      setCourseId("");
      setBranches([]);
      setBranchId("");
    }
  };
  const handleBranchChange = (e) => {
    e.preventDefault();
    var selectedIndex = e.target.options.selectedIndex;
    setBranchesName(e.target.options[selectedIndex].getAttribute("data-name"));
    const other_duty_report_viewport = document.getElementById(
      "other_duty_report_viewport"
    );
    other_duty_report_viewport.classList.add("hidden");
    other_duty_report_viewport.classList.remove("flex");
    const download_button = document.getElementById("download_button");
    download_button.classList.add("hidden");
    if (e.target.value !== "Select Branch") {
      setBranchId(e.target.value);
      acces_token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${acces_token}` };
      const host = window.location.host;
      const arr = host
        .split(".")
        .slice(0, host.includes("localhost") ? -1 : -2);
      if (arr.length > 0) {
        subdomain = arr[0];
      }
      if (subdomain !== null || subdomain !== "") {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/semesters`,
            {
              headers,
              params: {
                subdomain: subdomain,
                branch_id: e.target.value,
              },
            }
          )
          .then((response) => {
            if (response.data.status === "ok") {
              // setSemesters2(response.data.data.semesters);
            }
          })
          .catch((error) => console.log(error));
      }
    } else {
      setBranchId("");
    }
  };
  const handleFilterSubmit = (e) => {
    console.log("button clicked!");
    let selectedFilter = {};

    if (examinationName5 === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear5 === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "" || courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: examinationName5,
        academic_year: selectedYear5,
        course_id: courseId,
      };

      if (branchId !== "") {
        selectedFilter = {
          examination_name: examinationName5,
          academic_year: selectedYear5,
          course_id: courseId,
          branch_id: branchId,
        };
      }

      // if (semesterId !== "") {
      //   selectedFilter = {
      //     name: examinationName2,
      //     academic_year: selectedYear2,
      //     course_id: courseId,
      //     branch_id: branchId,
      //     semester_id: semesterId,
      //   };
      // }
    }

    console.log(selectedFilter);

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties`,
          {
            headers,
            params: {
              subdomain: subdomain,
              other_duty: selectedFilter,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.status === "ok") {
            const other_duty_report_viewport = document.getElementById(
              "other_duty_report_viewport"
            );
            const download_button = document.getElementById("download_button");
            const save_as_pdf = document.getElementById("save_as_pdf");
            if (res.data.data.other_duties.length !== 0) {
              download_button.classList.remove("hidden");
              save_as_pdf.classList.remove("hidden");
              other_duty_report_viewport.classList.remove("hidden");
              other_duty_report_viewport.classList.add("flex");
              setOtherDutyTable(res.data.data.other_duties);
            } else {
              toast.error(`No Reports found for selected filters!`, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleonChangeFacultyName5 = (event) => {
    setStaffUserId(event.target.value);
    var selectedIndex = event.target.options.selectedIndex;
    setStaffDesignation(
      event.target.options[selectedIndex].getAttribute("data-designation")
    );
  };
  const handleOtherDutySubmit = (e) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");
    axios
      .post(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties?subdomain=${subdomain}`,
        {
          other_duty: {
            academic_year: moment(selectedYear5).format("YYYY"),
            user_id: staffUserId,
            assign_duties: assignDuty,
            examination_name: examinationName5,
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
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties?academic_year=${moment(
              selectedYear5
            ).format(
              "YYYY"
            )}&subdomain=${subdomain}&examination_name=${examinationName5}`,
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data.data);
            setDisplayOtherDutyTable(response.data.data.other_duties);
          })
          .catch((error) => console.log(error));
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };
  const handlePrint5 = useReactToPrint({
    content: () => componentRef5.current,
  });
  const handleSavePDF = () => {
    const contentElement = document.getElementById("other_duty_report_viewport");
    contentElement.style = {};

    html2pdf()
      .set({
        filename: "OtherDuty Report.pdf",
        margin: [10, 10, 10, 10],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(contentElement)
      .save();

    divStyle = {
      height: "400px",
      overflowY: "auto",
    };
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
              <a
                href="/examViewTimeTable"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="flex-1 ml-3 whitespace-nowrap">Report</span>
              </a>
            </li>
            {/* <li>
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
            </li> */}
          </ul>
        </div>
      </aside>

      <div className="pt-4 sm:ml-64">
        <div className="flex flex-col items-center mt-14">
          <div className="flex items-center space-x-4 mb-5">
            <a
              className={`text-white font-bold py-2 px-4 rounded-lg bg-slate-500`}
              href="/examViewTimeTable"
            >
              Time Table
            </a>
            <a
              className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
              href="/examViewBlockDetails"
            >
              Blockwise Report
            </a>
            <a
              className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
              href="/examViewJrSupervision"
            >
              Jr.Supervisor Tab
            </a>
            <a
              className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg `}
              href="/examViewSrSupervision"
            >
              Sr.Supervisor Tab
            </a>
            <a
              className={`bg-slate-800 text-white font-bold py-2 px-4 rounded-lg `}
              href="/examViewOtherDuty"
            >
              Other Duties
            </a>
          </div>
        </div>

        <div className="flex mt-5 ml-2">
          <select
            className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
            onChange={(e) => {
              handleExaminationChange5(e.target.value);
            }}
          >
            <option>Select Examination</option>
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </select>

          <select
            className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
            onChange={(e) => handleYearChange5(e.target.value)}
          >
            <option value="Select Year">Select Year</option>
            {academic_years.map((year) => {
              return <option value={year}>{year}</option>;
            })}
          </select>
          <select
            className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
            onChange={handleCourseChange}
          >
            <option>Select course</option>
            {courses.map((course, index) => (
              <option value={course.id}>{course.name}</option>
            ))}
          </select>
          <select
            className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
            onChange={(e) => {
              handleBranchChange(e);
            }}
          >
            <option>Select Branch</option>
            {branches.map((branch) => (
              <option value={branch.id} data-name={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>

          
        </div>
        <div className="flex justify-center mt-5">
        <button
            className="py-2 px-3 mr-7 bg-gray-800 rounded-2xl text-white font-bold"
            onClick={handleFilterSubmit}
          >
            Submit
          </button>
          <a
            href="#"
            id="download_button"
            onClick={handlePrint5}
            className="hidden py-2 px-3 mt-1 bg-blue-200 rounded-2xl text-white font-bold"
          >
            <FcPrint />
          </a>
          <a
              href="#"
              id="save_as_pdf"
              onClick={handleSavePDF}
              className="hidden py-2 px-3 ml-2 mt-1 bg-blue-200 rounded-2xl text-white font-bold"
            >
              <FcDownload />
            </a>
        </div>
        <div
          className="hidden flex-col mt-5"
          ref={componentRef5}
          id="other_duty_report_viewport"
          style={divStyle}
        >
          <div>
            <p className="text-center">{uniName}</p>
            <p className="text-center">
              {examinationName5} {selectedYear5} Examination Time Table
            </p>
          </div>
          <div ref={tableRef} id="table-viewport" className="">
            <div className="p-1.5 w-full inline-block align-middle">
              <div className="border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="sticky top-0 bg-gray-50">
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
                      Assigned Duty
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Sign
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {otherDutyTable.map((otherDuty) => (
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                          {otherDuty.user_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {otherDuty.designation}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {otherDuty.course_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {otherDuty.assigned_duties}
                        </td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex justify-evenly text-center mt-10"></div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExamViewOtherDuty;
