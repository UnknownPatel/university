import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiArchiveResearch } from "react-icons/gi";
import { MdAddCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

var headers;
var subdomain;
var access_token;

const MarksEntry = () => {
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
  const [marksData, setMarksData] = useState([]);
  const [faculty, setFaculty] = useState("");
  const navigate = useNavigate();

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
    if (selectedFilter === "") {
    } else {
      console.log(JSON.parse(JSON.stringify(selectedFilter.subject_ids)));
      // Get Branches
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/branches?subdomain=${subdomain}&course_id=${selectedFilter.course_id}`,
          { headers }
        )
        .then((response) => {
          setBranches(response.data.data.branches);
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

      // Get Subjects
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
        })
        .catch((error) => console.log(error));
    }
  }, [selectedFilter]);

  const handleSubjectChange = (e) => {
    e.preventDefault();
    setMarksData([]);
    const viewport = document.getElementById("marks_entry_viewport");
    viewport.classList.add("hidden");
    viewport.classList.remove("flex");
    if (e.target.value === "Select Subject") {
      setSubjectId("");
    } else {
      setSubjectId(e.target.value);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    const studentId = e.target.getAttribute("data-student-id");
    console.log(studentId);
    var student_mark_id = e.target.getAttribute("data-student-mark-entry-id");
    const existingInputIndex = marksData.findIndex(
      (input) => input.student_id === studentId
    );
    const regex = /^(Ab|ZR|\d*)$/;

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/examination_types/${type}/fetch_maximum_marks`,
          {
            headers,
            params: {
              subdomain: subdomain,
            },
          }
        )
        .then((res) => {
          if (res.data.message === "Type found") {
            if (res.data.data.maximum_marks.length !== 0) {
              console.log(res.data.data.maximum_marks);
              const error_message = document.getElementById(
                "error-message-" + studentId
              );
              if (regex.test(value)) {
                if (value !== "Ab" && value !== "ZR") {
                  if (value <= parseInt(res.data.data.maximum_marks)) {
                    e.target.classList.remove("border-red-700");
                    e.target.classList.add("border-green-700");
                    e.target.classList.add("focus:outline-none");
                    e.target.classList.remove("focus:outline-red-700");
                    e.target.classList.add("focus:outline-green-700");
                    error_message.textContent = "";
                  } else {
                    e.target.classList.add("border-red-700");
                    e.target.classList.remove("border-green-700");
                    e.target.classList.remove("focus:outline-none");
                    e.target.classList.add("focus:outline-red-700");
                    e.target.classList.remove("focus:outline-green-700");
                    error_message.textContent = `Entered marks exceeded the maximum marks allowed`;
                  }
                } else {
                  e.target.classList.remove("border-red-700");
                  e.target.classList.add("border-green-700");
                  e.target.classList.add("focus:outline-none");
                  e.target.classList.remove("focus:outline-red-700");
                  e.target.classList.add("focus:outline-green-700");
                  error_message.textContent = "";
                }
              } else {
                e.target.classList.add("border-red-700");
                e.target.classList.remove("border-green-700");
                e.target.classList.remove("focus:outline-none");
                e.target.classList.add("focus:outline-red-700");
                e.target.classList.remove("focus:outline-green-700");
                error_message.textContent = `Entered Input is not acceptable, please change!`;
              }
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    if (existingInputIndex !== -1) {
      const updatedInputValues = [...marksData];
      updatedInputValues[existingInputIndex].marks = value;
      setMarksData(updatedInputValues);
    } else {
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
      } else if (subjectId === "") {
        toast.error("Please select subject", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      } else {
        var newInputValue = {};
        if (regex.test(value)) {
          newInputValue = {
            examination_name: examinationName,
            examination_type: type,
            academic_year: selectedYear,
            course_id: courseId,
            branch_id: branchId,
            semester_id: semesterId,
            division_id: divisionId,
            subject_id: subjectId,
            student_id: studentId,
            marks: value,
          };

          if (student_mark_id !== "" || student_mark_id !== null) {
            newInputValue["id"] = student_mark_id;
          } else {
            delete newInputValue["id"];
          }
          setMarksData([...marksData, newInputValue]);
        } else {
        }
      }
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
    } else if (subjectId === "") {
      toast.error("Please select subject", {
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
        subject_id: subjectId,
      };

      if (subdomain !== null || subdomain !== "") {
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
                viewport.classList.add("flex");
                viewport.classList.remove("hidden");
                setStudents(response.data.data.students);
                response.data.data.students.map((student) => {
                  selectedFilter["student_id"] = student.id;
                  axios
                    .get(
                      `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/student_marks/${student.id}/fetch_details`,
                      {
                        headers,
                        params: {
                          student_mark: selectedFilter,
                          subdomain: subdomain,
                        },
                      }
                    )
                    .then((res) => {
                      const student_marks_input = document.getElementById(
                        "input-marks-entry-" + student.id
                      );
                      const submit_button =
                        document.getElementById("submit-button");
                      if (res.data.message === "Details found") {
                        student_marks_input.setAttribute(
                          "data-student-mark-entry-id",
                          res.data.data.student_mark.id
                        );
                        submit_button.innerHTML = "Update Marks";
                        student_marks_input.value =
                          res.data.data.student_mark.marks;
                        submit_button.disabled =
                          res.data.data.student_mark.lock_marks;
                        if (res.data.data.student_mark.lock_marks === true) {
                          submit_button.classList.add("cursor-not-allowed");
                        } else {
                          submit_button.classList.remove("cursor-not-allowed");
                        }
                        student_marks_input.disabled =
                          res.data.data.student_mark.lock_marks;
                      } else {
                        student_marks_input.removeAttribute(
                          "data-student-mark-entry-id"
                        );
                        student_marks_input.value = "";
                        student_marks_input.disabled = false;
                        submit_button.innerHTML = "Submit Marks";
                        submit_button.disable = false;
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                });
              }
            }
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const handleSubmitMarks = (e) => {
    e.target.disabled = true;
    e.target.classList.add("cursor-not-allowed");
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
        examination_type: type,
        academic_year: selectedYear,
        course_id: courseId,
        branch_id: branchId,
        semester_id: semesterId,
        division_id: divisionId,
      };

      if (subjectId !== "") {
        selectedFilter["subject_id"] = subjectId;
      } else {
        delete selectedFilter["subject_id"];
      }
    }

    if (subdomain !== null || subdomain !== "") {
      if (e.target.innerHTML === "Update Marks") {
        console.log(marksData);
        e.target.innerHTML = "Updating Marks ...";
        if (marksData.length === 0) {
          e.target.innerHTML = "Update Marks";
          e.target.disabled = false;
          e.target.classList.remove("cursor-not-allowed");
          toast.error("Please enter marks to update");
        } else {
          axios
            .put(
              `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/student_marks/${divisionId}`,
              {
                subdomain: subdomain,
                student_marks: marksData,
              },
              { headers }
            )
            .then((res) => {
              e.target.disabled = false;
              e.target.classList.remove("cursor-not-allowed");
              e.target.innerHTML = "Update Marks";
              if (res.data.status === "ok") {
                toast.success("The entered marks has been updated!");
              } else {
                toast.error(res.data.message);
              }
            })
            .catch((err) => {
              e.target.innerHTML = "Update Marks";
              e.target.disabled = false;
              e.target.classList.remove("cursor-not-allowed");
              toast.error("Something went wrong, please try again!");
              console.error(err);
            });
        }
      } else {
        e.target.innerHTML = "Submitting Marks ...";
        if (marksData.length === 0) {
          e.target.innerHTML = "Submit Marks";
          e.target.disabled = false;
          e.target.classList.remove("cursor-not-allowed");
          toast.error("Please enter some marks to submit!");
        } else {
          axios
            .post(
              `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/student_marks`,
              {
                student_marks: marksData,
                subdomain: subdomain,
              },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((responce) => {
              console.log(responce.data);
              if (responce.data.status === "created") {
                setMarksData([]);
                e.target.disabled = false;
                e.target.classList.remove("cursor-not-allowed");
                responce.data.data.student_marks.map((student_mark) => {
                  const marks_entry_input = document.getElementById(
                    "input-marks-entry-" + student_mark.student_id
                  );
                  marks_entry_input.setAttribute(
                    "data-student-mark-entry-id",
                    student_mark.id
                  );
                  marks_entry_input.value = student_mark.marks;
                  marks_entry_input.disabled = student_mark.lock_marks;
                });
                const submit_button = document.getElementById("submit-button");
                submit_button.innerHTML = "Update Marks";
                submit_button.disabled =
                  responce.data.data.student_marks[0].lock_marks;
                if (responce.data.data.student_marks[0].lock_marks === true) {
                  submit_button.classList.add("cursor-not-allowed");
                } else {
                  submit_button.classList.remove("cursor-not-allowed");
                }
                toast.success("All Entered marks are been saved!");
              } else {
                e.target.innerHTML = "Submit Marks";
                toast.error(responce.data.message);
              }
            })
            .catch(function (err) {
              e.target.innerHTML = "Submit Marks";
              e.target.disabled = false;
              e.target.classList.remove('cursor-not-allowed');
              toast.error("Something went wrong, please try again!");
              console.log(err.response.data);
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
                className="flex items-center p-2 text-gray-900 bg-slate-600 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <p>Marks Entry </p>
          </div>

          <div className="flex mt-5 ml-2">
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
              disabled={true}
            >
              <option value="Select Course">Course</option>
              {courses.map((course, index) => (
                <option value={course.id}>{course.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              value={branchId}
              // isSearchable={true}
              disabled={true}
            >
              <option value="Select Branch">Branch</option>
              {branches.map((branch) => (
                <option value={branch.id}>{branch.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-20"
              value={semesterId}
              disabled={true}
            >
              <option value="Select Semester">Semester</option>
              {semesters.map((semester) => (
                <option value={semester.id}>{semester.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-28"
              value={divisionId}
              disabled={true}
            >
              <option value="Select Division">Division</option>
              {divisions.map((division) => (
                <option value={division.id}>{division.name}</option>
              ))}
            </select>

            <select
              className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded shadow-md px-3 py-2 w-auto"
              onChange={handleSubjectChange}
              isSearchable={true}
            >
              <option value="Select Subject" selected>
                Subject
              </option>
              {subjects.map((subject) => (
                <option value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-center mt-5">
            <button
              className="text-center ml-4 w-auto bg-transparent text-slate-950 p-3 rounded-2xl tracking-wide border border-slate-950
              font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-700 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={handleFilterSubmit}
            >
              <p className="inline-flex">
                Search <GiArchiveResearch className="mt-1 ml-2" />
              </p>
            </button>
          </div>
          {/* Table of Faculty List */}
          <div
            id="marks_entry_viewport"
            className="hidden flex-col mt-5"
            style={{ height: 390 }}
          >
            <div className="">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table className="min-w-full divide-y table-auto divide-gray-200">
                    <thead className="sticky top-0 bg-gray-50">
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
                          Enter Marks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {students.map((student, index) => {
                        return (
                          <tr>
                            <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {index + 1}
                            </td>
                            <td
                              className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                              data-id={student.id}
                            >
                              {student.name}
                            </td>
                            <td
                              className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                              data-id={student.id}
                            >
                              {student.enrollment_number}
                            </td>
                            <td className="text-start px-6 py-4 text-sm  whitespace-nowrap">
                              <div>
                                <input
                                  className=" appearance-none border rounded w-44 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id={"input-marks-entry-" + student.id}
                                  data-student-id={student.id}
                                  type="text"
                                  placeholder="Enter Ab, Zr or Numbers "
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <span
                                id={"error-message-" + student.id}
                                className="text-red-500 text-xs"
                              ></span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center mt-5">
                  <button
                    className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                      font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 hover:text-white hover:border-white shadow-lg transition ease-in duration-300"
                    onClick={handleSubmitMarks}
                    id="submit-button"
                  >
                    <p className="inline-flex">Submit Marks</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarksEntry;
