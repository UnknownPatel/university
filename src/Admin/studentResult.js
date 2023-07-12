import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiArchiveResearch } from "react-icons/gi";
import { MdAddCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";

var headers;
var subdomain;
var access_token;

const StudentResult = () => {
  const [uniName, setUniName] = useState("");
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [type, setType] = useState("");
  const [selectedYear, setSelectedYear] = useState();
  const [examinationName, setExaminationName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [studentId, setStudentId] = useState("");
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
    const student_mark_viewport = document.getElementById(
      "student_marks_viewport"
    );
    const error_message = document.getElementById("type-tr");
    error_message.classList.remove("flex");
    error_message.classList.add("hidden");
    student_mark_viewport.classList.remove("flex");
    student_mark_viewport.classList.add("hidden");
    if (e.target.value === "Select Type") {
      setType("");
    } else {
      const typeTr = document.getElementById("type-tr");
      if (e.target.value !== "External") {
        typeTr.classList.add("hidden");
      } else {
        typeTr.classList.remove("hidden");
      }
      setType(e.target.value);
    }
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

  const handleEnrollmentChange = (e) => {
    e.preventDefault();
    setEnrollmentNumber(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    let selectedFilter = {};
    if (examinationName === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (type === "") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (enrollmentNumber === "") {
      toast.error("Please enter enrollment number", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: examinationName,
        academic_year: selectedYear,
      };

      if (type !== "External") {
        selectedFilter["examination_type"] = type;
      } else {
        delete selectedFilter["examination_type"];
      }

      if (subdomain !== "" || subdomain !== null) {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/student_marks/fetch_marks_through_enrollment_number`,
            {
              headers,
              params: {
                student_mark: selectedFilter,
                enrollment_number: enrollmentNumber,
                subdomain: subdomain,
              },
            }
          )
          .then((res) => {
            console.log(res.data.status);
            const viewport = document.getElementById("student_marks_viewport");
            if (res.data.status === "ok") {
              axios
                .get(
                  `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/students/${enrollmentNumber}/fetch_subjects`,
                  {
                    headers,
                    params: {
                      subdomain: subdomain,
                    },
                  }
                )
                .then((resp) => {
                  console.log(resp);
                  if (resp.data.message === "Details found") {
                    if (resp.data.data.subjects.length !== 0) {
                      setSubjects(resp.data.data.subjects);
                      setStudentId(resp.data.data.student_id);
                    } else {
                      setSubjects([]);
                    }
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
              setMarksData(res.data.data.student_marks);
              viewport.classList.add("flex");
              viewport.classList.remove("hidden");
            } else {
              console.log(res.data.message);
              const error_message = document.getElementById("error-message");
              if (res.data.message !== "Details not found") {
                error_message.classList.remove("hidden");
                error_message.classList.add("flex");
              } else {
                error_message.classList.remove("flex");
                error_message.classList.add("hidden");
                toast.error(res.data.message, {
                  position: toast.POSITION.BOTTOM_LEFT,
                });
              }
            }
          })
          .catch((err) => {
            console.error(err);
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
                    <span className="self-center text-xl mr-2 font-semibold sm:text-2xl whitespace-nowrap dark:text-white"></span>
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

      <div className="p-4 rounded-lg mt-14">
        <div className="text-center text-4xl">
          <p>Student Result </p>
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
            <option value="Select Examination" hidden selected>
              Examination
            </option>
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
            <option value="Select Year" hidden selected>
              Year
            </option>
            {academic_years.map((year) => {
              return <option value={year}>{year}</option>;
            })}
          </select>

          <select
            className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
            onChange={handleTypeChange}
          >
            <option value="Select Type" hidden selected>
              Type
            </option>
            {examinationTypes.map((examination_type) => {
              return (
                <option value={examination_type.name}>
                  {examination_type.name}
                </option>
              );
            })}
          </select>
          <input
            type="text"
            onChange={(e) => handleEnrollmentChange(e)}
            id="enroll-search"
            class="bg-gray-50 border-0 border-b-2  text-gray-900 text-sm rounded-lg block w-auto pl-10 p-2.5 border-gray-600 "
            placeholder="Enter Enrollment No."
            required
          />
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
        <div id="error-message" className="hidden flex-col mt-5">
          {" "}
          Please wait for your result to be declared by administrator!{" "}
        </div>
        <div
          id="student_marks_viewport"
          className="hidden flex-col mt-5"
          style={{ height: 520 }}
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
                        Subject Name
                      </th>
                      <th
                        scope="col"
                        colSpan={
                          type === "External" ? examinationTypes.length : 1
                        }
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        {type !== "External" ? "Marks" : "Marks"}
                      </th>
                    </tr>
                    <tr id="type-tr" className="hidden">
                      {examinationTypes.map((type) => {
                        return (
                          <th
                            key={`${type.id}`}
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                          >
                            {type.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="text-center divide-y divide-gray-200">
                    {subjects.map((subject, index) => {
                      console.log(marksData);
                      if (type !== "External") {
                        return (
                          <tr key={subject.id}>
                            <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {index + 1}
                            </td>
                            <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {subject.name}
                            </td>
                            <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {marksData?.["marks"]?.[subject.name]?.[type] ||
                                "-"}
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={subject.id}>
                            <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {index + 1}
                            </td>
                            <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {subject.name}
                            </td>
                            {examinationTypes.map((examination_type) => {
                              return (
                                <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {marksData?.["marks"]?.[subject.name]?.[
                                    examination_type.name
                                  ] || "-"}
                                </td>
                              );
                            })}
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
  );
};

export default StudentResult;
