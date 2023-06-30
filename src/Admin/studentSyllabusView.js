import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { GiArchiveResearch } from "react-icons/gi";
import numberToWords from "number-to-words";
import { ToastContainer, toast } from "react-toastify";

var access_token;
var subdomain;
var year;
var headers;

const StudentSyllabusView = () => {
  const [uniName, setUniName] = useState("");
  const [academic_years, setAcademicYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [courseId, setCourseId] = useState("");
  const [branchesName, setBranchesName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [semesterName, setSemesterName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");

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
          //   console.log(response.data.university.name);
          setUniName(response.data.university.name);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(headers);

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

  const handleYearChange = (date) => {
    if (date !== "Select Year") {
      setSelectedYear(date);
    } else {
      setSelectedYear("");
    }
  };

  const handleCourseChange = (e) => {
    e.preventDefault();
    var selectedFilter = {};
    if (selectedYear !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear;
    }

    if (e.target.value !== "Select Course") {
      selectedFilter["course_id"] = e.target.value;
    }

    console.log(selectedFilter);
    setCourseId(e.target.value);
    var course_id = e.target.value;
    access_token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${access_token}` };
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
          setBranches(response.data.data.branches);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    var selectedFilter = {};

    if (selectedYear !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear;
    }

    if (courseId !== "Select Course") {
      selectedFilter["course_id"] = courseId;
    }

    if (e.target.value !== "Select Branch") {
      selectedFilter["branch_id"] = e.target.value;
    }

    console.log(selectedFilter);
    var selectedIndex = e.target.options.selectedIndex;
    setBranchesName(e.target.options[selectedIndex].getAttribute("data-name"));
    var branch_id = e.target.value;
    if (branch_id === "Select Branch") {
      setBranchId("");
      setSemesterId("");
    } else {
      setBranchId(e.target.value);
    }
    access_token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${access_token}` };
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
          setSemesters(response.data.data.semesters);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSemesterChange = (e) => {
    e.preventDefault();
    var selectedFilter = {};

    if (selectedYear !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear;
    }

    if (courseId !== "Select Course") {
      selectedFilter["course_id"] = courseId;
    }

    if (courseId !== "Select Branch") {
      selectedFilter["branch_id"] = branchId;
    }

    if (e.target.value === "Select Semester") {
      setSemesterId("");
    } else {
      selectedFilter["semester_id"] = e.target.value;
      setSemesterId(e.target.value);
    }
    var selectedIndex = e.target.options.selectedIndex;
    setSemesterName(
      numberToWords.toOrdinal(
        e.target.options[selectedIndex].getAttribute("data-semester-name")
      ) + " Semester"
    );
    access_token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${access_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (subdomain !== null || subdomain !== "") {
    }
  };

  const handleSubjectCodeChange = (e) => {
    e.preventDefault();
    setSubjectCode(e.target.value);
  };

  const handleSubjectNameChange = (e) => {
    e.preventDefault();
    setSubjectName(e.target.value);
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
    } else {
      selectedFilter = {
        academic_year: selectedYear,
        course_id: courseId,
      };

      if (branchId !== "") {
        selectedFilter["branch_id"] = branchId;
      } else {
        delete selectedFilter["branch_id"];
      }

      if (semesterId !== "") {
        selectedFilter["semester_id"] = semesterId;
      } else {
        delete selectedFilter["semester_id"];
      }

      if (subjectCode !== "") {
        selectedFilter["subject_code"] = subjectCode;
      } else {
        delete selectedFilter["subject_code"];
      }

      if (subjectName !== "") {
        selectedFilter["subject_name"] = subjectName;
      } else {
        delete selectedFilter["subject_name"];
      }

      if (subdomain !== null || subdomain !== "") {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/syllabuses`,
            {
              headers,
              params: {
                subdomain: subdomain,
                syllabus: selectedFilter,
              },
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }

    console.log(selectedFilter);
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
          </div>
        </div>
      </nav>

      <div className="p-4 rounded-lg mt-14">
        <div className="text-center text-4xl">
          <p>TEACHING SCHEME / DETAIL SYALLBUS</p>
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
          >
            <option value="Select Branch">Branch</option>
            {branches.map((branch) => (
              <option value={branch.id} data-name={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>

          <select
            className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
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
            className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
            onChange={(e) => handleYearChange(e.target.value)}
          >
            <option value="Select Year">Year</option>
            {academic_years.map((year) => {
              return <option value={year}>{year}</option>;
            })}
          </select>
          <input
            type="text"
            id="subject-code-search"
            onChange={(e) => handleSubjectCodeChange(e)}
            class="bg-gray-50 border-0 border-b-2  text-gray-900 text-sm rounded-lg block w-auto pl-10 p-2.5 border-gray-600 "
            placeholder="Subject Code"
          />
          <input
            type="text"
            id="subject-name-search"
            onChange={(e) => handleSubjectNameChange(e)}
            class="bg-gray-50 border-0 border-b-2 text-gray-900 text-sm rounded-lg block ml-2 w-auto pl-10 p-2.5 border-gray-600 "
            placeholder="Subject Name"
          />
          <button
            className="py-2 px-3 ml-20 mr-7 bg-gray-800 rounded-2xl text-white font-bold"
            onClick={handleFilterSubmit}
          >
            <p className="inline-flex">
              Search <GiArchiveResearch className="mt-1 ml-2" />
            </p>
          </button>
        </div>
        <div id="syllabus_viewport" className="flex flex-col mt-5">
          <div id="table-viewport" className="">
            <div className="p-1.5 w-full inline-block align-middle">
              <div className="border rounded-lg">
                <table className="min-w-full table-fixed divide-y divide-gray-200">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th
                        colSpan={5}
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      ></th>
                      <th
                        colSpan={3}
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Hours
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        Credit
                      </th>
                      <th
                        colSpan={5}
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                      >
                        Max Marks
                      </th>
                    </tr>
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        Subject Code
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        Branch Code
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        Subject Name
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        Category
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        Sem
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        L.
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        T.
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        P.
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        Total
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        E.
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        M.
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        I.
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        V.
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentSyllabusView;
