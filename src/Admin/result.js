import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiArchiveResearch } from "react-icons/gi";
import { MdAddCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import numberToWords from "number-to-words";

var headers;
var subdomain;
var access_token;

const Result = () => {
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
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [displayTimeTable, setDisplayTimeTable] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [removeOverFlow, setRemoveOverflow] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [marksData, setMarksData] = useState({});
  const [faculty, setFaculty] = useState("");
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
    setExaminationName(examination);
  };

  const handleYearChange = (date) => {
    if (date !== "Select Year") {
      setSelectedYear(date);
    } else {
      setSelectedYear("");
    }
  };

  const handleTypeChange = (e) => {
    e.preventDefault();
    const viewport = document.getElementById("marks_entry_viewport");
    const excel_sheet_button = document.getElementById("save_excel_sheet");
    viewport.classList.add("hidden");
    excel_sheet_button.classList.add("hidden");
    viewport.classList.remove("flex");
    setSubjects([]);
    if (e.target.value === "Select Type") {
      setType("");
    } else {
      const typeTr = document.getElementById("type-tr");
      if (e.target.value !== "All") {
        typeTr.classList.add("hidden");
      } else {
        typeTr.classList.remove("hidden");
      }
      setType(e.target.value);
    }
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
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
    var selectedFilter = {};

    if (examinationName !== "Select Examination") {
      selectedFilter["name"] = examinationName;
    } else {
      delete selectedFilter["name"];
    }

    if (selectedYear !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear;
    } else {
      delete selectedFilter["academic_year"];
    }

    if (courseId !== "Select Course") {
      selectedFilter["course_id"] = courseId;
    } else {
      delete selectedFilter["course_id"];
    }

    if (e.target.value !== "Select Branch") {
      selectedFilter["branch_id"] = e.target.value;
    } else {
      delete selectedFilter["branch_id"];
    }

    if (semesterId !== "Select Semester") {
      selectedFilter["semester_id"] = semesterId;
    } else {
      delete selectedFilter["semester_id"];
    }

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
    setSemesterName(
      numberToWords.toOrdinal(
        e.target.options[selectedIndex].getAttribute("data-semester-name")
      ) + " Semester"
    );
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
      };

      if (type !== "All" && type !== "") {
        selectedFilter["examination_type"] = type;
      } else {
        delete selectedFilter["examination_type"];
      }

      console.log(selectedFilter);

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
            setSubjects(response.data.data.subjects);
          })
          .catch((error) => console.log(error));

        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/students`,
            {
              headers,
              params: {
                student: selectedFilter,
                subdomain: subdomain,
              },
            }
          )
          .then((response) => {
            if (response.data.message === "Details found") {
              if (response.data.data.students.length !== 0) {
                const viewport = document.getElementById(
                  "marks_entry_viewport"
                );
                const excel_sheet_button =
                  document.getElementById("save_excel_sheet");
                setStudents(response.data.data.students);
                var updatedMarks = {};
                response.data.data.students.map((student, index) => {
                  selectedFilter["student_id"] = student.id;
                  axios
                    .get(
                      `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/student_marks/${student.id}/fetch_marks`,
                      {
                        headers,
                        params: {
                          student_mark: selectedFilter,
                          subdomain: subdomain,
                        },
                      }
                    )
                    .then((res) => {
                      if (res.data.status === "ok") {
                        const studentMarks = res.data.data.student_marks;
                        updatedMarks = {
                          ...updatedMarks,
                          [studentMarks.student_id]: {
                            student_name: studentMarks.student_name,
                            student_enrollment_number:
                              studentMarks.student_enrollment_number,
                            marks: studentMarks.marks,
                          },
                        };
                        setMarksData(updatedMarks);
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                });

                if (Object.keys(updatedMarks).length !== 0) {
                  viewport.classList.add("flex");
                  viewport.classList.remove("hidden");
                  excel_sheet_button.classList.remove("hidden");
                } else {
                  toast.error("Result not found for the selected filters", {
                    position: toast.POSITION.BOTTOM_LEFT,
                  });
                }
              }
            }
          })
          .catch((error) => console.log(error));
      }
    }
  };

  // const exportToExcel = (tableData) => {
  //   const worksheet = XLSX.utils.table_to_sheet(tableData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   XLSX.writeFile(workbook, "table_data.xlsx");
  // };

  const exportToExcel = (tableData) => {
    const worksheet = XLSX.utils.table_to_sheet(tableData);

    // Loop through each cell and add custom styling
    for (let cell in worksheet) {
      if (cell.startsWith("A") && worksheet.hasOwnProperty(cell)) {
        const cellStyle = worksheet[cell].s || {};
        cellStyle.alignment = cellStyle.alignment || {};
        cellStyle.alignment.horizontal = "center";
        worksheet[cell].s = cellStyle;
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "MasterSheet.xlsx");
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
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <p>Result </p>
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
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleTypeChange}
            >
              <option value="Select Type">Type</option>
              <option value="All">All</option>
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
                <option value={semester.id} data-semester-name={semester.name}>
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
                <option value={division.id} data-division-name={division.name}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center mt-5">
            <button
              className="py-2 px-3 mr-7 ml-2 bg-gray-800 rounded-2xl text-white font-bold"
              onClick={handleFilterSubmit}
            >
              <p className="inline-flex">
                Search <GiArchiveResearch className="mt-1 ml-2" />
              </p>
            </button>
            <a
              href="#"
              id="save_excel_sheet"
              onClick={downloadExcel}
              className="py-2 px-10 bg-blue-200 rounded-2xl hidden"
            >
              <SiMicrosoftexcel />
            </a>
          </div>
          {/* Table of Faculty List */}
          <div
            id="marks_entry_viewport"
            className="hidden flex-col mt-5"
            style={{ height: 390 }}
          >
            <div className="overflow-x-scroll">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table
                    id="my-table"
                    className="min-w-full divide-y table-auto text-center divide-gray-200"
                  >
                    <thead className="sticky top-0 bg-gray-50">
                      <tr id="selected-filters">
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-gray-500 text-center"
                          colSpan={
                            type === "All"
                              ? 3 + subjects.length * examinationTypes.length
                              : 3 + subjects.length
                          }
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
                          rowSpan={2}
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Sr No.
                        </th>
                        <th
                          scope="col"
                          rowSpan={2}
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Student Name
                        </th>
                        <th
                          scope="col"
                          rowSpan={2}
                          className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                        >
                          Enrollment No.
                        </th>
                        {subjects.map((subject) => {
                          return (
                            <th
                              key={subject.id}
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                              colSpan={
                                type === "All" ? examinationTypes.length : 1
                              }
                            >
                              {subject.name}
                            </th>
                          );
                        })}
                      </tr>
                      <tr id="type-tr" className="hidden">
                        {subjects.map((subject) =>
                          examinationTypes.map((type) => (
                            <th
                              key={`${subject.id}-${type.id}`}
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                            >
                              {type.name}
                            </th>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {Object.entries(marksData).map(
                        ([studentId, studentData], index) => {
                          const {
                            student_name,
                            student_enrollment_number,
                            marks,
                          } = studentData;
                          if (type === "All") {
                            return (
                              <tr key={studentId}>
                                <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {index + 1}
                                </td>
                                <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {student_name}
                                </td>
                                <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {student_enrollment_number}
                                </td>
                                {subjects.flatMap((subject) => {
                                  return examinationTypes.flatMap((type) => {
                                    const cellKey = `${studentId}-${subject.name}-${type.name}`;
                                    const studentMarks =
                                      marks?.[subject.name]?.[type.name] || "-";

                                    return (
                                      <td
                                        key={cellKey}
                                        className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                                      >
                                        {studentMarks}
                                      </td>
                                    );
                                  });
                                })}
                              </tr>
                            );
                          } else {
                            return (
                              <tr key={studentId}>
                                <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {index + 1}
                                </td>
                                <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {student_name}
                                </td>
                                <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {student_enrollment_number}
                                </td>
                                {subjects.flatMap((subject) => {
                                  const cellKey = `${studentId}-${subject.name}-${type}`;
                                  const studentMarks =
                                    marks?.[subject.name]?.[type] || "-";

                                  return (
                                    <td
                                      key={cellKey}
                                      className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                                    >
                                      {studentMarks}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          }
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
  );
};

export default Result;
