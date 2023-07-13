import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import { GiArchiveResearch } from "react-icons/gi";
import { MdAddCircle } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import BlockDetailsModal from "./modals/blockDetailsModal";

var acces_token;
var headers;
var subdomain;
var roles = localStorage.getItem("roles");

const ExamBlockDetails = () => {
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [selectedYear2, setSelectedYear2] = useState();
  const [examinationName2, setExaminationName2] = useState("");
  const [courses2, setCourses2] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branches2, setBranches2] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [semesters2, setSemesters2] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [subjects2, setSubjects2] = useState([]);
  const [subjectId2, setSubjectId2] = useState("");
  const [date2, setDate2] = useState("");
  const [time2, setTime2] = useState("");
  const [noOfStudent, setNoOfStudent] = useState();
  const [examTimeTableId, setExamTimeTableId] = useState("");
  const [timeTables, setTimeTables] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);
  const [storeDates, setStoreDates] = useState([]);
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [examinationTimes, setExaminationTimes] = useState([]);
  const [blockDetailsShowModal, setBlockDetailsShowModal] = useState(false);
  const [blockDetailsId, setBlockDetailsId] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    headers = { Authorization: `Bearer ${acces_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }

    if (subdomain !== null || subdomain !== "") {
      if (acces_token) {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/find_user?subdomain=${subdomain}`,
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((responce) => {
            console.log(responce);
            console.log(responce.data.roles);
            if (responce.data.roles.length !== 0) {
              roles = responce.data.roles;
            } else {
              roles = [];
            }
          })
          .catch((error) => console.log(error));
      }
      // University details
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

      // Courses Index API
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/courses?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setCourses2(response.data.data.courses);
        })
        .catch((error) => console.log(error));

      // Examination Names API
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

      // Examination Types API
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
          if (responce.data.status === "ok") {
            if (responce.data.data.examination_times.length !== 0) {
              setExaminationTimes(responce.data.data.examination_times);
            } else {
              setExaminationTimes([]);
            }
          }
        })
        .catch(function (err) {
          console.log(err.message);
        });
    }
  }, []);

  const handleExaminationChange2 = (e, examination) => {
    handleViewPortChange();
    setExaminationName2(examination);
  };

  const handleYearChange2 = (date) => {
    handleViewPortChange();
    if (date !== "Select Year") {
      setSelectedYear2(date);
    } else {
      setSelectedYear2("");
    }
  };

  const handleTypeChange = (e) => {
    e.preventDefault();
    handleViewPortChange();
    var selectedFilter = {};
    setStoreDates([]);
    if (examinationName2 !== "Select Examination") {
      selectedFilter["name"] = examinationName2;
    } else {
      delete selectedFilter["name"];
    }

    if (selectedYear2 !== "") {
      selectedFilter["academic_year"] = selectedYear2;
    } else {
      delete selectedFilter["academic_year"];
    }

    if (courseId !== "") {
      selectedFilter["course_id"] = courseId;
    } else {
      delete selectedFilter["course_id"];
    }

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

    if (time2 !== "") {
      selectedFilter["time"] = time2;
    } else {
      delete selectedFilter["time"];
    }

    if (e.target.value === "Select Type") {
      delete selectedFilter["time_table_type"];
      setType("");
    } else {
      selectedFilter["time_table_type"] = e.target.value;
      setType(e.target.value);
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates`,
          {
            headers,
            params: {
              time_table: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Examination dates are as below") {
            if (response.data.data.dates.length !== 0) {
              setStoreDates(response.data.data.dates);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleCourseChange2 = (e) => {
    e.preventDefault();
    handleViewPortChange();
    setCourseId("");
    setBranches2([]);
    setBranchId("");
    setSemesters2([]);
    setSemesterId("");
    var selectedFilter = {};
    setStoreDates([]);
    if (examinationName2 !== "Select Examination") {
      selectedFilter["name"] = examinationName2;
    } else {
      delete selectedFilter["name"];
    }

    if (selectedYear2 !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear2;
    } else {
      delete selectedFilter["academic_year"];
    }

    if (time2 !== "") {
      selectedFilter["time"] = time2;
    } else {
      delete selectedFilter["time"];
    }

    if (type !== "") {
      selectedFilter["time_table_type"] = type;
    } else {
      delete selectedFilter["time_table_type"];
    }

    if (e.target.value !== "Select Course") {
      selectedFilter["course_id"] = e.target.value;
      console.log(selectedFilter);
      const time_table_viewport = document.getElementById(
        "time_table_viewport"
      );
      time_table_viewport.classList.add("hidden");
      time_table_viewport.classList.remove("flex");
      setCourseId(e.target.value);
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
            setBranches2(response.data.data.branches);
          })
          .catch((error) => console.log(error));
      }
    } else {
      setCourseId("");
      setBranches2([]);
      setBranchId("");
      setSemesters2([]);
      setSemesterId("");
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates`,
          {
            headers,
            params: {
              time_table: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Examination dates are as below") {
            if (response.data.data.dates.length !== 0) {
              setStoreDates(response.data.data.dates);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleBranchChange2 = (e) => {
    e.preventDefault();
    var selectedFilter = {};
    setStoreDates([]);
    handleViewPortChange();

    if (examinationName2 !== "Select Examination") {
      selectedFilter["name"] = examinationName2;
    } else {
      delete selectedFilter["name"];
    }

    if (selectedYear2 !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear2;
    } else {
      delete selectedFilter["academic_year"];
    }

    if (time2 !== "") {
      selectedFilter["time"] = time2;
    } else {
      delete selectedFilter["time"];
    }

    if (courseId !== "Select Course") {
      selectedFilter["course_id"] = courseId;
    } else {
      delete selectedFilter["course_id"];
    }

    if (type !== "") {
      selectedFilter["time_table_type"] = type;
    } else {
      delete selectedFilter["time_table_type"];
    }

    if (e.target.value !== "Select Branch") {
      selectedFilter["branch_id"] = e.target.value;
      console.log(selectedFilter);
      setBranchId(e.target.value);
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
              setSemesters2(response.data.data.semesters);
            }
          })
          .catch((error) => console.log(error));
      }
    } else {
      setBranchId("");
      setSemesters2([]);
      setSemesterId("");
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates`,
          {
            headers,
            params: {
              time_table: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Examination dates are as below") {
            if (response.data.data.dates.length !== 0) {
              setStoreDates(response.data.data.dates);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSemesterChange2 = (e) => {
    e.preventDefault();
    handleViewPortChange();
    var selectedFilter = {};
    setStoreDates([]);
    if (time2 !== "") {
      selectedFilter["time"] = time2;
    } else {
      delete selectedFilter["time"];
    }

    if (examinationName2 !== "Select Examination") {
      selectedFilter["name"] = examinationName2;
    }

    if (selectedYear2 !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear2;
    }

    if (courseId !== "Select Course") {
      selectedFilter["course_id"] = courseId;
    }

    if (courseId !== "Select Branch") {
      selectedFilter["branch_id"] = branchId;
    }

    if (e.target.value !== "Select Semester") {
      selectedFilter["semester_id"] = e.target.value;
      setSemesterId(e.target.value);
    } else {
      delete selectedFilter["semester_id"];
      setSemesterId("");
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates`,
          {
            headers,
            params: {
              time_table: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Examination dates are as below") {
            if (response.data.data.dates.length !== 0) {
              setStoreDates(response.data.data.dates);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleTimeChange = (e) => {
    e.preventDefault();
    handleViewPortChange();
    var selectedFilter = {};
    setStoreDates([]);

    if (examinationName2 !== "Select Examination") {
      selectedFilter["name"] = examinationName2;
    } else {
      delete selectedFilter["name"];
    }

    if (selectedYear2 !== "Select Year") {
      selectedFilter["academic_year"] = selectedYear2;
    } else {
      delete selectedFilter["academic_year"];
    }

    if (courseId !== "Select Course") {
      selectedFilter["course_id"] = courseId;
    } else {
      delete selectedFilter["course_id"];
    }

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

    if (e.target.value !== "Select time") {
      selectedFilter["time"] = e.target.value;
      setTime2(e.target.value);
    } else {
      delete selectedFilter["time"];
      setTime2("");
    }
    console.log(selectedFilter);
    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates`,
          {
            headers,
            params: {
              time_table: selectedFilter,
              subdomain: subdomain,
            },
          }
        )
        .then((response) => {
          if (response.data.message === "Examination dates are as below") {
            if (response.data.data.dates.length !== 0) {
              setStoreDates(response.data.data.dates);
            }
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleFilterSubmit = (e) => {
    let selectedFilter = {};
    console.log(type);
    if (examinationName2 === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear2 === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "" || courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (type === "") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter["examination_name"] = examinationName2;
      selectedFilter["academic_year"] = selectedYear2;
      selectedFilter["course_id"] = courseId;
      selectedFilter["time_table_type"] = type;

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

      if (date2 !== "") {
        selectedFilter["date"] = date2;
      } else {
        delete selectedFilter["date"];
      }

      if (time2 !== "") {
        selectedFilter["time"] = time2;
      } else {
        delete selectedFilter["time"];
      }
    }

    if (subdomain !== null || subdomain !== "") {
      console.log(selectedFilter);
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables`,
          {
            headers,
            params: {
              subdomain: subdomain,
              time_table: selectedFilter,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.status === "ok") {
            const time_table_viewport = document.getElementById(
              "time_table_viewport"
            );
            if (res.data.data.time_tables.length !== 0) {
              time_table_viewport.classList.remove("hidden");
              time_table_viewport.classList.add("flex");
              setTimeTables(res.data.data.time_tables);
              res.data.data.time_tables.map((time_table) => {
                axios
                  .get(
                    `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/time_table_block_wise_reports/${time_table.id}/fetch_details`,
                    {
                      headers,
                      params: {
                        subdomain: subdomain,
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res);
                    const no_of_students = document.getElementById(
                      "input-time-table-" + time_table.id
                    );

                    const deleteButton = document.getElementById(
                      "delete-button-time-table-" + time_table.id
                    );

                    const button_submit = document.getElementById(
                      "button-subject-" + time_table.id
                    );
                    if (res.data.message === "Details found") {
                      no_of_students.value =
                        res.data.data.report.no_of_students;
                      button_submit.innerHTML = "Update";
                      button_submit.setAttribute(
                        "data-report-id",
                        res.data.data.report.id
                      );
                      deleteButton.setAttribute(
                        "data-report-id",
                        res.data.data.report.id
                      );
                      deleteButton.classList.remove("hidden");
                    } else {
                      no_of_students.value = "";
                      button_submit.innerHTML = "Create";
                      deleteButton.classList.add("hidden");
                      button_submit.removeAttribute("data-report-id");
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              });
            } else {
              toast.error(`No timetable found for selected filters`, {
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

  const handleSubmitBlockWiseReport = (e, time_table_id, no_of_students) => {
    e.preventDefault();
    let selectedFilter = {};
    selectedFilter["exam_time_table_id"] = time_table_id;
    if (examinationName2 === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear2 === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "" || courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (type === "") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter["examination_name"] = examinationName2;
      selectedFilter["academic_year"] = selectedYear2;
      selectedFilter["course_id"] = courseId;
      selectedFilter["report_type"] = type;

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

      if (date2 !== "") {
        selectedFilter["date"] = date2;
      } else {
        delete selectedFilter["date"];
      }

      if (time2 !== "") {
        selectedFilter["time"] = time2;
      } else {
        delete selectedFilter["time"];
      }
    }
    var no_of_students_input = document.getElementById(
      "input-time-table-" + time_table_id
    );
    selectedFilter["no_of_students"] = no_of_students_input.value;
    acces_token = localStorage.getItem("access_token");
    if (e.target.innerHTML === "Update") {
      var report_id = e.target.getAttribute("data-report-id");
      axios
        .put(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/time_table_block_wise_reports/${report_id}`,
          {
            subdomain: subdomain,
            report: selectedFilter,
          },
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status == "ok") {
            const student_input = document.getElementById(
              "input-time-table-" + time_table_id
            );
            student_input.value = res.data.data.report.no_of_students;
            toast.success(res.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          } else {
            toast.error(res.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      axios
        .post(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/time_table_block_wise_reports?subdomain=${subdomain}`,
          {
            report: selectedFilter,
          },
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((responce) => {
          const deleteButton = document.getElementById(
            "delete-button-time-table-" + time_table_id
          );
          if (responce.data.status == "created") {
            const button = document.getElementById(
              "button-subject-" + time_table_id
            );
            const student_input = document.getElementById(
              "input-time-table-" + time_table_id
            );
            deleteButton.setAttribute(
              "data-report-id",
              responce.data.data.report.id
            );
            deleteButton.classList.remove("hidden");
            button.innerHTML = "Update";
            button.setAttribute("data-report-id", responce.data.data.report.id);
            student_input.value = responce.data.data.report.no_of_students;
            toast.success(responce.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          } else {
            deleteButton.classList.add("hidden");
            toast.error(responce.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        })
        .catch(function (err) {
          console.log(err.message);
        });
    }
  };

  const handleViewPortChange = () => {
    const time_table_viewport = document.getElementById("time_table_viewport");
    time_table_viewport.classList.add("hidden");
    time_table_viewport.classList.remove("flex");
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
                    className="flex items-center p-2 bg-slate-600 text-gray-900 rounded-lg  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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

          <div className="p-4 sm:ml-64">
            <div className="p-4 rounded-lg mt-10">
              <div className="text-center text-4xl">
                <p>Enter Block Details</p>
              </div>
            </div>
            <div className="flex ml-2 mt-5">
              {/* Select Examination option in BlockWise Report */}

              <select
                className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md rounded justify-center px-3 py-2 w-auto"
                onChange={(e) => {
                  handleExaminationChange2(e, e.target.value);
                }}
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

              {/* Select Year option in BlockWise Report */}
              <select
                className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                onChange={(e) => handleYearChange2(e.target.value)}
              >
                <option value="Select Year">Year</option>
                {academic_years.map((year) => {
                  return <option value={year}>{year}</option>;
                })}
              </select>

              <select
                className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                onChange={handleTypeChange}
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
                className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                onChange={handleCourseChange2}
              >
                <option value="Select course">Course</option>
                {courses2.map((course) => (
                  <option value={course.id}>{course.name}</option>
                ))}
              </select>

              <select
                className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2 w-auto"
                onChange={handleBranchChange2}
              >
                <option value="Select Branch">Branch</option>
                {branches2.map((branch) => (
                  <option value={branch.id}>{branch.name}</option>
                ))}
              </select>

              <select
                className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2 w-auto"
                onChange={handleSemesterChange2}
              >
                <option value="Select Semester">Semester</option>
                {semesters2.map((semester) => (
                  <option value={semester.id}>{semester.name}</option>
                ))}
              </select>

              <select
                className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                onChange={(e) => {
                  if (e.target.value !== "Select Date") {
                    setDate2(e.target.value);
                  } else {
                    setDate2("");
                  }
                }}
              >
                <option value="Select Date">Date</option>
                {storeDates.map((date) => (
                  <option value={date}>{date}</option>
                ))}
              </select>

              <select
                className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                onChange={(e) => {
                  handleTimeChange(e);
                }}
              >
                <option value="Select time">Time</option>
                {examinationTimes.map((examination_time) => {
                  return (
                    <option value={examination_time.name}>
                      {examination_time.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex justify-center mt-5">
              <button
                className="text-center w-auto bg-transparent text-slate-950 p-3 rounded-2xl tracking-wide border border-slate-950
                font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-700 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                id={"submit-button"}
                onClick={handleFilterSubmit}
              >
                <p className="inline-flex">
                  Search <GiArchiveResearch className="mt-1 ml-2" />
                </p>
              </button>
            </div>

            <div
              id="time_table_viewport"
              className="hidden flex-col h-96 max-h-fit overflow-y-scroll mt-5"
            >
              <div className="">
                <div className="p-1.5 w-full inline-block align-middle">
                  <div className="border rounded-lg">
                    <table className="min-w-full divide-y table-autos divide-gray-200">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                          >
                            Subject Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                          >
                            Subject Code
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                          >
                            No. of Students
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>

                      {/* Body of the BlockWise Report */}

                      <tbody className="divide-y divide-gray-200">
                        {timeTables.map((time_table) => (
                          <tr>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                              {time_table.subject_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                              {time_table.subject_code}
                            </td>
                            <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                              {time_table.date}
                            </td>
                            <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                              {time_table.time}
                            </td>
                            <td className="px-6 py-4 text-sm flex justify-center whitespace-nowrap">
                              <input
                                className="shadow appearance-none border rounded w-44 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id={"input-time-table-" + time_table.id}
                                onChange={(e) =>
                                  setNoOfStudent(parseInt(e.target.value))
                                }
                                type="text"
                                placeholder="Enter Student Number"
                                required
                              />
                            </td>
                            <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                              <button
                                className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                                data-id={time_table.id}
                                onClick={(e) =>
                                  handleSubmitBlockWiseReport(
                                    e,
                                    time_table.id,
                                    noOfStudent
                                  )
                                }
                                id={"button-subject-" + time_table.id}
                              >
                                Create
                              </button>
                              <button
                                id={"delete-button-time-table-" + time_table.id}
                                className="hidden text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-red-600 hover:text-slate-50 hover:border-none shadow-lg cursor-pointer transition ease-in duration-300"
                                onClick={(e) => {
                                  setBlockDetailsShowModal(true);
                                  setBlockDetailsId(
                                    e.target.getAttribute("data-report-id")
                                  );
                                }}
                              >
                                Delete
                              </button>
                              {blockDetailsShowModal && (
                                <BlockDetailsModal
                                  setOpenModal={setBlockDetailsShowModal}
                                  id={blockDetailsId}
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
      ) : (
        navigate(-1)
      )}
    </div>
  );
};

export default ExamBlockDetails;
