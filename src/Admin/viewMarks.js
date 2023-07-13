import axios from "axios";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { FcDownload } from "react-icons/fc";
import { FcPrint } from "react-icons/fc";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import numberToWords from "number-to-words";

var headers;
var subdomain;
var access_token;

const ViewMarks = () => {
  const componentRef = useRef();
  const [uniName, setUniName] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
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
  const [selectedFilter, setSelectedFilter] = useState("");
  const [marksData, setMarksData] = useState([]);
  const [faculty, setFaculty] = useState("");
  const navigate = useNavigate();
  const { subject_id } = useParams();

  var divStyle = {
    height: "400px",
    overflowY: "auto",
  };

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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/universities/${subdomain}/get_authorization_details`
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
          setSelectedFilter(responce.data.configuration);
          setExaminationName(responce.data.configuration.examination_name);
          setSelectedYear(responce.data.configuration.academic_year);
          setType(responce.data.configuration.examination_type);
          setCourseId(responce.data.configuration.course_id);
          setBranchId(responce.data.configuration.branch_id);
          setSemesterId(responce.data.configuration.semester_id);
          setDivisionId(responce.data.configuration.division_id);
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

  useEffect(() => {
    if (selectedFilter !== "") {
      console.log(JSON.parse(JSON.stringify(selectedFilter.subject_ids)));
      selectedFilter["subject_id"] = subject_id;
      var course_select = document.getElementById("course-select");
      var branch_select = document.getElementById("branch-select");
      var semester_select = document.getElementById("semester-select");
      var subject_select = document.getElementById("subject-select");
      var division_select = document.getElementById("division-select");
      // Get Branches
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/branches?subdomain=${subdomain}&course_id=${selectedFilter.course_id}`,
          { headers }
        )
        .then((response) => {
          setBranches(response.data.data.branches);
          var selectedIndex = branch_select.options.selectedIndex;
          setBranchesName(
            branch_select.options[selectedIndex].getAttribute("data-name")
          );
          console.log(selectedIndex);
        })
        .catch((error) => console.log(error));

      // Get Semesters
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/semesters?subdomain=${subdomain}&branch_id=${selectedFilter.branch_id}`,
          { headers }
        )
        .then((response) => {
          setSemesters(response.data.data.semesters);
          var selectedIndex = semester_select.options.selectedIndex;
          setSemesterName(
            numberToWords.toOrdinal(
              semester_select.options[selectedIndex].getAttribute("data-name")
            ) + " Semester"
          );
        })
        .catch((error) => console.log(error));

      // Get Divisions
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/divisions?subdomain=${subdomain}`,
          {
            headers,
            params: {
              division: {
                semester_id: selectedFilter.semester_id,
              },
            },
          }
        )
        .then((response) => {
          setDivisions(response.data.data.divisions);
        })
        .catch((error) => console.log(error));

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
                id: JSON.stringify(selectedFilter.subject_ids),
              },
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          setSubjects(response.data.data.subjects);
          var selectedIndex = subject_select.options.selectedIndex;
          setSubjectName(
            subject_select.options[selectedIndex].getAttribute("data-name")
          );
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/student_marks`,
          {
            headers,
            params: {
              student_mark: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Details found") {
            const viewport = document.getElementById("marks_entry_viewport");
            const button_viewport = document.getElementById("button-viewport");
            if (res.data.data.student_marks.length !== 0) {
              viewport.classList.remove("hidden");
              button_viewport.classList.remove("hidden");
              viewport.classList.add("flex");
              button_viewport.classList.add("flex");
              setMarksData(res.data.data.student_marks);
            } else {
              viewport.classList.add("hidden");
              button_viewport.classList.add("hidden");
              button_viewport.classList.remove("hidden");
              viewport.classList.remove("flex");
              setMarksData([]);
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
  }, [selectedFilter]);

  const handleBranchChange = (e) => {
    var selectedIndex = e.target.options.selectedIndex;
    setBranchesName(e.target.options[selectedIndex].getAttribute("data-name"));
  };

  const handlePrint = useReactToPrint({
    onBeforeGetContent: () => {
      const contentElement = componentRef.current;
      contentElement.classList.remove("overflow-y-scroll");
      contentElement.style = {};
    },
    content: () => componentRef.current,
    onAfterPrint: () => {
      const contentElement = componentRef.current;
      contentElement.classList.add("overflow-y-scroll");
    },
  });

  const handleSavePDF = () => {
    const contentElement = document.getElementById("marks_entry_viewport");
    contentElement.classList.remove("overflow-y-scroll");

    html2pdf()
      .set({
        filename: "Marks.pdf",
        margin: [10, 10, 10, 10],
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(contentElement)
      .save()
      .then(() => {
        // PDF saving completed, add the class back
        contentElement.classList.add("overflow-y-scroll");
      });
  };

  const exportToExcel = (tableData) => {
    const worksheet = XLSX.utils.table_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "table_data.xlsx");
  };

  const downloadExcel = () => {
    const tableElement = document.getElementById("my-table"); // Replace 'my-table' with the ID of your table
    exportToExcel(tableElement);
  };

  const downloadExcel1 = () => {
    const wrapper = document.getElementById("marks_entry_viewport"); // Replace 'table' with the ID of your div element containing the table
    const table = wrapper.querySelector("table");
    const additionalData = wrapper.querySelectorAll("#selected-filters p");
    const worksheetData = [];

    additionalData.forEach((p) => {
      const rowData = [
        {
          v: p.textContent,
          t: "s",
          s: { alignment: { horizontal: "center" } },
        },
      ];
      worksheetData.push(rowData);
    });

    worksheetData.push([]);

    const tableRows = table.querySelectorAll("tr");
    // Prepare the worksheet data
    tableRows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("th, td");
      cells.forEach((cell) => {
        let cellData = cell.textContent;
        rowData.push({ v: cellData });
      });
      worksheetData.push(rowData);
    });
    // Create a new workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    // Create a new worksheet
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "viewMarksData"); // Replace 'Sheet1' with your desired sheet name
    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    // Create a Blob object from the Excel buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ViewMarks.xlsx"; // Replace 'table.xlsx' with your desired file name
    // Trigger the download
    link.click();
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
            <div className="flex justify-center">
              <p className="text-center">View Marks</p>
            </div>
          </div>

          <div className="hidden mt-5 ml-2">
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
              id="course-select"
              disabled={true}
            >
              <option value="Select Course">Course</option>
              {courses.map((course, index) => (
                <option value={course.id} data-course-name={course.name}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              value={branchId}
              id="branch-select"
              // isSearchable={true}
              disabled={true}
            >
              <option value="Select Branch">Branch</option>
              {branches.map((branch) => (
                <option value={branch.id} data-name={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-20"
              value={semesterId}
              id="semester-select"
              disabled={true}
            >
              <option value="Select Semester">Semester</option>
              {semesters.map((semester) => (
                <option value={semester.id} data-name={semester.name}>
                  {semester.name}
                </option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-28"
              value={divisionId}
              id="division-select"
              disabled={true}
            >
              <option value="Select Division">Division</option>
              {divisions.map((division) => (
                <option value={division.id} data-name={division.name}>
                  {division.name}
                </option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              // onChange={}
              value={subject_id}
              id="subject-select"
              disabled={true}
            >
              <option value="Select Subject">Subject</option>
              {subjects.map((subject) => (
                <option value={subject.id} data-name={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div
            id="marks_entry_viewport"
            className="hidden flex-col overflow-y-scroll mt-5 h-[65vh] max-h-fit"
            ref={componentRef}
          >
            <div className="">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table
                    id="my-table"
                    className="min-w-full divide-y table-auto divide-gray-200"
                  >
                    <thead className="sticky top-0 bg-gray-50">
                      <tr id="selected-filters">
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-gray-500 text-center"
                          colSpan={4}
                        >
                          <p className="text-center">{uniName}</p>
                          <p className="text-center">
                            {examinationName} {selectedYear} {type}
                          </p>
                          <p className="text-center">
                            {branchesName}, {semesterName}
                          </p>
                          <p className="text-center">{subjectName}</p>
                        </th>
                      </tr>
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
                          Marks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {marksData.map((data, index) => {
                        return (
                          <tr>
                            <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {index + 1}
                            </td>
                            <td
                              className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                              data-id={data.id}
                            >
                              {data.student_name}
                            </td>
                            <td
                              className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                              data-id={data.id}
                            >
                              {data.student_enrollment_number}
                            </td>
                            <td className="text-start px-6 py-4 text-sm  whitespace-nowrap">
                              {data.marks}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div id="button-viewport" className="hidden justify-end mt-5 mb-5">
            <a
              href="#"
              id="download_button"
              onClick={handlePrint}
              className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
              font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-500 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
            >
              <FcPrint size={30} />
            </a>

            <a
              href="#"
              id="save_as_pdf"
              onClick={handleSavePDF}
              className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950 ml-2
              font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-500 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
            >
              <FcDownload size={30} />
            </a>
            <a
              href="#"
              id="save_as_pdf"
              onClick={downloadExcel}
              className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950 ml-2
              font-semibold focus:outline-none focus:shadow-outline hover:bg-slate-500 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
            >
              <SiMicrosoftexcel size={30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMarks;
