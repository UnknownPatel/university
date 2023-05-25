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

const ExamReports = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const componentRef = useRef();
  const [uniName, setUniName] = useState("");
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchesName, setBranchesName] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [examinationName, setExaminationName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [displayTimeTable, setDisplayTimeTable] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);

  // BlockWise Report
  const [selectedYear2, setSelectedYear2] = useState();
  const [examinationName2, setExaminationName2] = useState("");
  const [courses2, setCourses2] = useState([]);
  const [branches2, setBranches2] = useState([]);
  const [semesters2, setSemesters2] = useState([]);
  const [subjects2, setSubjects2] = useState([]);
  const [subjectId2, setSubjectId2] = useState("");
  const [date2, setDate2] = useState("");
  const [time2, setTime2] = useState("");
  const [noOfStudent, setNoOfStudent] = useState();
  const [examTimeTableId, setExamTimeTableId] = useState("");
  const [displayBlockWiseTable, setDisplayBlockWiseTable] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const componentRef2 = useRef();

  // Junior SuperVisor Report
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

  // Senior SuperVisor Report
  const [selectedYear4, setSelectedYear4] = useState();
  const [examinationName4, setExaminationName4] = useState("");
  const [srSubjectDates, setSrSubjectDates] = useState([]);
  const [srDateCheckBox, setSrDateCheckBox] = useState([]);
  const [srFacultyName, setSrFacultyName] = useState([{}]);
  const [srUserId, setSrUserId] = useState("");
  const [srSupervisionDesignation, setSrSupervisionDesignation] = useState("");
  const [srSupervisionDepartment, setSrSupervisionDepartment] = useState("");
  const [srDisplaySupervisionTable, setSrDisplaySupervisionTable] = useState(
    []
  );
  const componentRef4 = useRef();

  // Other Duties
  const [selectedYear5, setSelectedYear5] = useState();
  const [examinationName5, setExaminationName5] = useState("");
  const [staffName, setStaffName] = useState([{}]);
  const [staffUserId, setStaffUserId] = useState("");
  const [staffDesignation, setStaffDesignation] = useState("");
  const [assignDuty, setAssignDuty] = useState();
  const [displayOtherDutyTable, setDisplayOtherDutyTable] = useState([]);

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
          setCourses(response.data.data.courses);
          setCourses2(response.data.data.courses);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const handleExaminationChange = (examination) => {
    // e.preventDefault();
    // console.log(examinationName);
    setExaminationName(examination);
    let access_token = localStorage.getItem("access_token");
    console.log(access_token);
    const headers = { Authorization: `Bearer ${access_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables?examination_name=${examination}&academic_year=${selectedYear}&subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          console.log(response.data.data);
          setDisplayTimeTable(response.data.data.time_tables);
          // setBranches(response.data.data);
          // console.log(branches);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleYearChange = (date) => {
    setSelectedYear(date);
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
    //       `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables?examination_name=${examinationName}&academic_year=${moment(
    //         date
    //       ).format("YYYY")}&subdomain=${subdomain}`,
    //       { headers }
    //     )
    //     .then((response) => {
    //       console.log(response.data.data.time_tables);
    //       setDisplayTimeTable(response.data.data.time_tables);
    //       // setBranches(response.data.data);
    //     })
    //     .catch((error) => console.log(error));
    // }
  };
  // const handleFilterSubmit = (e) => {
  //   let selectedFilter = {};

  //   if (examinationName === "") {
  //     toast.error("Please select examination name", {
  //       position: toast.POSITION.BOTTOM_LEFT,
  //     });
  //   } else if (selectedYear === "") {
  //     toast.error("Please select year", {
  //       position: toast.POSITION.BOTTOM_LEFT,
  //     });
  //   } else if (courseId === "" || courseId === "Select Course") {
  //     toast.error("Please select course", {
  //       position: toast.POSITION.BOTTOM_LEFT,
  //     });
  //   } else {
  //     selectedFilter = {
  //       course_id: courseId,
  //     };

  //     if (branchId !== "") {
  //       selectedFilter = {
  //         course_id: courseId,
  //         branch_id: branchId,
  //       };
  //     }

  //     if (semesterId !== "") {
  //       selectedFilter = {
  //         course_id: courseId,
  //         branch_id: branchId,
  //         semester_id: semesterId,
  //       };
  //     }
  //   }

  //   console.log(selectedFilter);

  //   if (subdomain !== null || subdomain !== "") {
  //     axios
  //       .get(
  //         `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/subjects`,
  //         {
  //           headers,
  //           params: {
  //             subdomain: subdomain,
  //             subject: selectedFilter,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         console.log(res);
  //         if (res.data.status == "ok") {
  //           const time_table_viewport = document.getElementById(
  //             "time_table_viewport"
  //           );
  //           if (res.data.data.subjects.length !== 0) {
  //             time_table_viewport.classList.remove("hidden");
  //             time_table_viewport.classList.add("flex");
  //             setSubjects(res.data.data.subjects);
  //             res.data.data.subjects.map((subject) => {
  //               axios
  //                 .get(
  //                   `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/${subject.id}/fetch_details?subdomain=${subdomain}`,
  //                   { headers }
  //                 )
  //                 .then((get_response) => {
  //                   const button = document.getElementById(
  //                     "button-subject-" + subject.id
  //                   );
  //                   const table_date = document.getElementById(
  //                     "date-select-subject-" + subject.id
  //                   );
  //                   const table_time = document.getElementById(
  //                     "select-time-subject-" + subject.id
  //                   );
  //                   if (get_response.data.message === "Details found") {
  //                     button.disabled = true;
  //                     button.innerHTML = "Created";
  //                     table_date.disabled = true;
  //                     table_date.value = get_response.data.data.time_table.date;
  //                     table_time.disabled = true;
  //                     table_time.options[table_time.options.selectedIndex].text =
  //                       get_response.data.data.time_table.time;
  //                     table_date.classList.add("cursor-not-allowed");
  //                     table_time.classList.add("cursor-not-allowed");
  //                     button.classList.add("cursor-not-allowed");
  //                   } else {
  //                     button.disabled = false;
  //                     button.innerHTML = "Create";
  //                     table_date.disabled = false;
  //                     table_date.value = "";
  //                     table_time.disabled = false;
  //                     table_time.options[table_time.options.selectedIndex].text =
  //                       "Select time";
  //                     table_date.classList.remove("cursor-not-allowed");
  //                     table_time.classList.remove("cursor-not-allowed");
  //                     button.classList.remove("cursor-not-allowed");
  //                   }
  //                 })
  //                 .catch((err) => {
  //                   console.log(err);
  //                 });
  //             });
  //           }
  //         }
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // };

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
    var selectedIndex = e.target.options.selectedIndex;
    setBranchesName(e.target.options[selectedIndex].getAttribute("data-name"));
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
          // console.log(branches);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSubjectNameChange = (e) => {
    e.preventDefault();
    console.log(e.target.selectedIndex);
    let codeSelect = document.getElementsByClassName("select-code")[0];
    codeSelect.selectedIndex = e.target.selectedIndex;
    setSubjectId(e.target.value);
    console.log(codeSelect);
  };

  const handleSubjectCodeChange = (e) => {
    e.preventDefault();
    console.log(e.target.selectedIndex);
    let codeSelect = document.getElementsByClassName("select-subject-name")[0];
    codeSelect.selectedIndex = e.target.selectedIndex;
    setSubjectId(e.target.value);
    console.log(codeSelect);
  };

  const handleSubmitTimeTable = (e) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");

    axios
      .post(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables?subdomain=${subdomain}`,
        {
          time_table: {
            name: examinationName,
            academic_year: moment(selectedYear).format("YYYY"),
            subject_id: subjectId,
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
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables?examination_name=${examinationName}&academic_year=${moment(
              date
            ).format("YYYY")}&subdomain=${subdomain}`,
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data.data.time_tables);
            setDisplayTimeTable(response.data.data.time_tables);
            // setBranches(response.data.data);
            console.log(branches);
          })
          .catch((error) => console.log(error));
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // BlokWise API
  const handleExaminationChange2 = (examination) => {
    // console.log(examinationName);
    setExaminationName2(examination);
    let access_token = localStorage.getItem("access_token");
    // console.log(access_token);
    const headers = { Authorization: `Bearer ${access_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/time_table_block_wise_reports?examination_name=${examination}&academic_year=${selectedYear2}&subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          console.log(response.data.data);
          setDisplayBlockWiseTable(response.data.data.reports);
          // setDisplayTimeTable(response.data.data.time_tables);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleYearChange2 = (date) => {
    // console.log(examinationName);
    // setDisplayTimeTable([]);
    setDisplayBlockWiseTable([]);
    setSelectedYear2(date);
    let access_token = localStorage.getItem("access_token");
    console.log(access_token);
    const headers = { Authorization: `Bearer ${access_token}` };
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) {
      subdomain = arr[0];
    }
    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/time_table_block_wise_reports?examination_name=${examinationName2}&academic_year=${moment(
            date
          ).format("YYYY")}&subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          // console.log(response.data.data.time_tables);
          setDisplayBlockWiseTable(response.data.data.reports);
          // setDisplayTimeTable(response.data.data.time_tables);
          // setBranches(response.data.data);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleCourseChange2 = (e) => {
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
          setBranches2(response.data.data.branches);
          console.log(branches);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleBranchChange2 = (e) => {
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
          setSemesters2(response.data.data.semesters);
          // console.log(branches);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSemesterChange2 = (e) => {
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
          setSubjects2(response.data.data.subjects);
          // console.log(branches);
        })
        .catch((error) => console.log(error));
    }
  };
  const handleSubjectNameChange2 = (e) => {
    e.preventDefault();
    console.log(e.target.selectedIndex);
    let codeSelect2 = document.getElementsByClassName("select-code2")[0];
    codeSelect2.selectedIndex = e.target.selectedIndex;
    setSubjectId2(e.target.value);
    console.log(codeSelect2);

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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/${e.target.value}/fetch_details?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          if (response.data.status == "ok") {
            setButtonDisabled(false);
            setDate2(response.data.data.time_table.date);
            setTime2(response.data.data.time_table.time);
            setExamTimeTableId(response.data.data.time_table.id);
          } else {
            setButtonDisabled(true);
            setDate2("");
            setTime2("");
            toast.error(response.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleSubjectCodeChange2 = (e) => {
    e.preventDefault();
    console.log(e.target.selectedIndex);
    let codeSelect2 = document.getElementsByClassName(
      "select-subject-name2"
    )[0];
    codeSelect2.selectedIndex = e.target.selectedIndex;
    setSubjectId2(e.target.value);
    console.log(codeSelect2);
  };
  const handleSubmitBlockWiseReport = (e) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");

    axios
      .post(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/time_table_block_wise_reports?subdomain=${subdomain}`,
        {
          report: {
            academic_year: moment(selectedYear2).format("YYYY"),
            exam_time_table_id: examTimeTableId,
            no_of_students: noOfStudent,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${acces_token}`,
          },
        }
      )
      .then((responce) => {
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
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/time_table_block_wise_reports?academic_year=${moment(
              selectedYear2
            ).format(
              "YYYY"
            )}&subdomain=${subdomain}&examination_name=${examinationName2}`,
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data.data.time_tables);
            setDisplayBlockWiseTable(response.data.data.reports);
            // setDisplayTimeTable(response.data.data.time_tables);
            // setBranches(response.data.data);
            // console.log(branches);
          })
          .catch((error) => console.log(error));
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef2.current,
  });

  // Junior Supervisor API
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

  // Senior Supervision API
  const handleExaminationChange4 = (examination2) => {
    setExaminationName4(examination2);
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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates?examination_name=${examination2}&academic_year=${moment(
            selectedYear4
          ).format("YYYY")}&subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          setSrSubjectDates(response.data.data.dates);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setSrFacultyName(response.data.data.users);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?type=Senior&academic_year=${moment(
            selectedYear4
          ).format(
            "YYYY"
          )}&subdomain=${subdomain}&examination_name=${examination2}`,
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data.data);
          setSrDisplaySupervisionTable(response.data.data.supervisions);
        })
        .catch((error) => console.log(error));
    }
  };
  const handleonChangeFacultyName4 = (event) => {
    setSrUserId(event.target.value);
    var selectedIndex = event.target.options.selectedIndex;
    setSrSupervisionDesignation(
      event.target.options[selectedIndex].getAttribute("data-designation")
    );
    setSrSupervisionDepartment(
      event.target.options[selectedIndex].getAttribute("data-department")
    );
  };
  const handlechangeDateCheckBox4 = (event) => {
    setSrDateCheckBox({
      ...srDateCheckBox,
      [event.target.name]: event.target.checked,
    });
  };
  const handleYearChange4 = (date) => {
    setSelectedYear4(date);
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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/exam_time_tables/get_examination_dates?examination_name=${examinationName4}&academic_year=${moment(
            date
          ).format("YYYY")}&subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setSrSubjectDates(response.data.data.dates);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setSrFacultyName(response.data.data.users);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?type=Senior&academic_year=${moment(
            selectedYear4
          ).format(
            "YYYY"
          )}&subdomain=${subdomain}&examination_name=${examinationName4}`,
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data.data.supervisions);
          setSrDisplaySupervisionTable(response.data.data.supervisions);
        })
        .catch((error) => console.log(error));
    }
  };
  const handleSeniorSupervisionSubmit = (e) => {
    e.preventDefault();
    acces_token = localStorage.getItem("access_token");
    const metadata = JSON.stringify(srDateCheckBox);
    axios
      .post(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?subdomain=${subdomain}`,
        {
          supervision: {
            academic_year: moment(selectedYear4).format("YYYY"),
            user_id: srUserId,
            list_type: "Senior",
            metadata: {
              metadata,
            },
            examination_name: examinationName4,
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
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?type=Senior&academic_year=${moment(
              selectedYear4
            ).format(
              "YYYY"
            )}&subdomain=${subdomain}&examination_name=${examinationName4}`,
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data.data);
            setSrDisplaySupervisionTable(response.data.data.supervisions);
            // console.log(response.data.data.supervisions[0].metadata);
          })
          .catch((error) => console.log(error));
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };
  const handlePrint4 = useReactToPrint({
    content: () => componentRef4.current,
  });

  var other_duty_date;

  // Other Duties
  const handleExaminationChange5 = (examination3) => {
    setExaminationName5(examination3);
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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setStaffName(response.data.data.users);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties?academic_year=${other_duty_date}&subdomain=${subdomain}&examination_name=${examination3}`,
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
    }
  };
  const handleYearChange5 = (date) => {
    other_duty_date = moment(date).format("YYYY");
    setSelectedYear5(date);
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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setStaffName(response.data.data.users);
        })
        .catch((error) => console.log(error));

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties?academic_year=${moment(
            date
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
          setDisplayOtherDutyTable(response.data.data.other_duties);
        })
        .catch((error) => console.log(error));
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

  const [activeButton, setActiveButton] = useState("button1");

  function toggleContent(buttonId) {
    setActiveButton(buttonId);
  }
  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

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
                  href="/examReports"
                  className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="flex-1 ml-3 whitespace-nowrap">Reports</span>
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
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Time Table
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    BlockWise Report
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Jr. Supervision Report
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Sr. Supervision Report
                  </a>
                  <a
                    href="#"
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
            <div className="flex flex-col items-center mt-14">
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button1" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button1")}
              >
                Time Table
              </button>
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button2" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button2")}
              >
                Blockwise Report
              </button>
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button3" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button3")}
              >
                Jr.Supervisor Tab
              </button>
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button4" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button4")}
              >
                Sr.Supervisor Tab
              </button>
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button5" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button5")}
              >
                Other Duties
              </button>
            </div>
            <div className="flex w-full">
              {/* Button Content 1 */}
              <div
                id="content1"
                className={`min-w-full p-4 rounded-lg ${
                  activeButton === "button1" ? "block" : "hidden"
                }`}
              >
                <div className="flex ml-2">
                  <select
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={(e) => {
                      handleExaminationChange(e.target.value);
                    }}
                  >
                    <option>Select Examination</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>

                  <select
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={(e) => handleYearChange(e.target.value)}
                  >
                    <option value="Select Year">Select Year</option>
                    {academic_years.map((year) => {
                      return <option value={year}>{year}</option>;
                    })}
                  </select>
                  {/* <DatePicker
                    id="year-picker1"
                    selected={selectedYear}
                    startDate={null}
                    onChange={(date) => {
                      handleYearChange(date);
                    }}
                    defaultValue={null}
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="Select Year"
                    className="form-select text-sm md:text-base lg:text-base mr-2 ml-4 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                  /> */}
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
                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={handleSemesterChange}
                  >
                    <option>Select Semester</option>
                    {semesters.map((semester) => (
                      <option value={semester.id}>{semester.name}</option>
                    ))}
                  </select>

                  <button
                    className="py-2 px-3 absolute right-0 mr-7 bg-gray-800 rounded-2xl text-white font-bold"
                    // onClick={handleFilterSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div className="flex mt-5">
                  <a href="#" onClick={handlePrint} className="ml-4 px-3 py-2">
                    Download
                  </a>
                </div>
                <div className="flex flex-col mt-5" ref={componentRef}>
                  <div className="">
                    <p className="text-center">{uniName}</p>
                    <p className="text-center">{branchesName}</p>
                    <p className="text-center">
                      {examinationName} {moment(selectedYear).format("YYYY")}{" "}
                      Examination Time Table
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="w-full align-middle">
                      <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full table-fixed divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                Subject Name
                              </th>
                              <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                Subject Code
                              </th>
                              <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                Day And Date
                              </th>
                              <th className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                Time
                              </th>
                              {/* <th className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
                          Action
                        </th> */}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {displayTimeTable.map((time_table) => (
                              <tr>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                  {time_table.subject_name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {time_table.subject_code}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {time_table.date + " " + time_table.day}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {time_table.time}
                                </td>

                                {/* <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <button
                            className="text-red-500 hover:text-red-700"
                            href="#"
                            // onClick={handleRemoveRole}
                          >Remove</button>
                        </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Button Content 2 */}
              <div
                id="content2"
                className={`w-full  rounded-lg ${
                  activeButton === "button2" ? "block" : "hidden"
                }`}
              >
                <div className="flex justify-center mt-5 ml-24">
                  {/* Select Examination option in BlockWise Report */}
                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={(e) => {
                      handleExaminationChange2(e.target.value);
                    }}
                  >
                    <option>Select Examination</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>

                  {/* Select Year option in BlockWise Report */}
                  <DatePicker
                    id="year-picker2"
                    selected={selectedYear2}
                    onChange={(date) => {
                      handleYearChange2(date);
                    }}
                    showYearPicker
                    dateFormat="yyyy"
                    className="form-select text-sm md:text-base lg:text-base mr-2 ml-9 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    placeholderText="Select Year"
                  />
                </div>
                <div className="flex mt-5">
                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={handleCourseChange2}
                  >
                    <option>Select course</option>
                    {courses2.map((course, index) => (
                      <option value={course.id}>{course.name}</option>
                    ))}
                  </select>

                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={handleBranchChange2}
                  >
                    <option>Select Branch</option>
                    {branches2.map((branch) => (
                      <option value={branch.id}>{branch.name}</option>
                    ))}
                  </select>

                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={handleSemesterChange2}
                  >
                    <option>Select Semester</option>
                    {semesters2.map((semester) => (
                      <option value={semester.id}>{semester.name}</option>
                    ))}
                  </select>
                </div>

                {/* Displayed table in BlockWise Report */}
                <div className="text-right mt-10">
                  <a href="#" onClick={handlePrint2} className="">
                    Download
                  </a>
                </div>
                <div className="flex flex-col mt-5" ref={componentRef2}>
                  <div>
                    <p className="text-center">{uniName}</p>
                    <p className="text-center">
                      {examinationName2} {moment(selectedYear2).format("YYYY")}{" "}
                      Examination Time Table
                    </p>
                    <p className="text-center">BlockWise Report</p>
                  </div>
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
                                No. of Rooms
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                No. of Blocks
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                No. of Students
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {displayBlockWiseTable.map((time_table) => (
                              <tr>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                  {time_table.subject_name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {time_table.subject_code}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {time_table.data}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {time_table.time}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {time_table.rooms}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {time_table.blocks}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {time_table.no_of_students}
                                </td>

                                {/* <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <button
                            className="text-red-500 hover:text-red-700"
                            href="#"
                            // onClick={handleRemoveRole}
                          >Remove</button>
                        </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Button Content 3 */}
              <div
                id="content3"
                className={`w-full  rounded-lg ${
                  activeButton === "button3" ? "block" : "hidden"
                }`}
              >
                <div className="flex justify-center mt-5 ml-24">
                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    id="select-examination"
                    onChange={(e) => {
                      handleExaminationChange3(e.target.value);
                    }}
                  >
                    <option>Select Examination</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>

                  <DatePicker
                    id="year-picker3"
                    selected={selectedYear3}
                    onChange={(date) => {
                      handleYearChange3(date);
                    }}
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="Select Year"
                    className="form-select text-sm md:text-base lg:text-base mr-2 ml-9 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                  />
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
                                  {e}
                                </th>
                              ))}
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                <select
                                  className="form-select text-sm md:text-lg lg:text-xl mr-2 border-2"
                                  id="select_name"
                                  onChange={handleonChangeFacultyName}
                                >
                                  <option>Select Name</option>
                                  {facultyName.map((item) => {
                                    // console.log( item.id)
                                    return (
                                      <>
                                        {/* <p id="designation_store" style={{display:"none"}} >{item.designation}</p> */}
                                        <option
                                          // id={item.designation}
                                          data-department={item.department}
                                          value={item.id}
                                          data-designation={item.designation}
                                        >
                                          {item.first_name}
                                        </option>
                                      </>
                                    );
                                  })}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {supervisionDesignation}
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                {supervisionDepartment}
                              </td>
                              {subjectDates.map((e, index) => (
                                <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    name={e}
                                    onChange={handlechangeDateCheckBox}
                                  />
                                </td>
                              ))}
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                <button
                                  className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                  onClick={handleJuniorSupervisionSubmit}
                                >
                                  Submit
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <button
                    onClick={handlePrint3}
                    className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                  >
                    Download
                  </button>
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
              {/* Button Content 4 */}
              <div
                id="content4"
                className={`w-full  rounded-lg ${
                  activeButton === "button4" ? "block" : "hidden"
                }`}
              >
                <div className="text-center text-2xl">{uniName}</div>
                <div className="text-center text-2xl">
                  Senior Supervisor List
                </div>
                <div className="flex justify-center mt-5 ml-56">
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Examination:
                  </label>
                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-2"
                    onChange={(e) => {
                      handleExaminationChange4(e.target.value);
                    }}
                  >
                    <option>Select Examination</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Year:
                  </label>
                  <DatePicker
                    id="year-picker4"
                    selected={selectedYear4}
                    onChange={(date) => {
                      handleYearChange4(date);
                    }}
                    showYearPicker
                    dateFormat="yyyy"
                    className="border rounded px-3 py-2"
                  />
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
                              {srSubjectDates.map((e) => (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                  {e}
                                </th>
                              ))}
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                <select
                                  className="form-select text-sm md:text-lg lg:text-xl mr-2 border-2"
                                  id="select_namesr"
                                  onChange={handleonChangeFacultyName4}
                                >
                                  <option>Select Name</option>
                                  {srFacultyName.map((item) => {
                                    return (
                                      <>
                                        <option
                                          data-department={item.department}
                                          value={item.id}
                                          data-designation={item.designation}
                                        >
                                          {item.first_name}
                                        </option>
                                      </>
                                    );
                                  })}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {srSupervisionDesignation}
                              </td>
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                {srSupervisionDepartment}
                              </td>
                              {srSubjectDates.map((e, index) => (
                                <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    name={e}
                                    onChange={handlechangeDateCheckBox4}
                                  />
                                </td>
                              ))}
                              <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                <button
                                  className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                  onClick={handleSeniorSupervisionSubmit}
                                >
                                  Submit
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <button
                    onClick={handlePrint4}
                    className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                  >
                    Download
                  </button>
                </div>
                <div className="flex flex-col" ref={componentRef4}>
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
                              {srSubjectDates.map((e) => (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                  {e}
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
                            {srDisplaySupervisionTable.map((supervision) => (
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Button Content 5 */}
              <div
                id="content5"
                className={`w-full  rounded-lg ${
                  activeButton === "button5" ? "block" : "hidden"
                }`}
              >
                <div className="text-center text-2xl">{uniName}</div>
                <div className="text-center text-2xl">Other Duties</div>
                <div className="flex justify-center mt-5 ml-16">
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Examination:
                  </label>
                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-2"
                    onChange={(e) => {
                      handleExaminationChange5(e.target.value);
                    }}
                  >
                    <option>Select Examination</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>
                  <label
                    htmlFor=""
                    className="text-sm md:text-base lg:text-base mr-2"
                  >
                    Select Year:
                  </label>
                  <DatePicker
                    id="year-picker5"
                    selected={selectedYear5}
                    onChange={(date) => {
                      handleYearChange5(date);
                    }}
                    showYearPicker
                    dateFormat="yyyy"
                    className="border rounded px-3 py-2"
                  />
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
                                Name of Staff
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                designation
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Assigned Duty
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
                            <tr>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                <select
                                  className="form-select text-sm md:text-lg lg:text-xl mr-2 border-2"
                                  id="select_namesr"
                                  onChange={handleonChangeFacultyName5}
                                >
                                  <option>Select Name</option>
                                  {staffName.map((item) => {
                                    return (
                                      <>
                                        <option
                                          value={item.id}
                                          data-designation={item.designation}
                                        >
                                          {item.first_name}
                                        </option>
                                      </>
                                    );
                                  })}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {staffDesignation}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                <input
                                  className="shadow appearance-none border rounded w-44 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id=""
                                  onChange={(e) =>
                                    setAssignDuty(e.target.value)
                                  }
                                  type="text"
                                  placeholder="Enter Assign Duty"
                                  required
                                />
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                <button
                                  className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                  onClick={handleOtherDutySubmit}
                                >
                                  Submit
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <button className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold">
                    Download
                  </button>
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
                                Name of Staff
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                designation
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Assigned Duty
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Sign
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"></td>
                              <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"></td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap"></td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap"></td>
                            </tr>
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
      <ToastContainer />
    </div>
  );
};

export default ExamReports;
