import axios, { Axios } from "axios";
import moment from "moment/moment";
import React, { useEffect, useState, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";
import { GiArchiveResearch } from "react-icons/gi";
import { MdAddCircle, MdSmartToy } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import JrSupervisionModal from "./modals/jrSupervisionModal";
import SrSupervisionModal from "./modals/srSupervisionModal";
import OtherDutyModal from "./modals/otherDutyModal";

var acces_token;
var headers;
var subdomain;
var roles = localStorage.getItem("roles");

const ExamAssignSupervision = () => {
  const [faculty, setFaculty] = useState("");
  const [uniName, setUniName] = useState("");
  const [jrType, setJrType] = useState("");
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [examinationName, setExaminationName] = useState("");
  const [examinationNames, setExaminationNames] = useState([]);
  const [examinationTimes, setExaminationTimes] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [facultyName, setFacultyName] = useState([]);
  const [noOfSupervisions, setNoOfSupervisions] = useState();
  const [branches, setBranches] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);
  const [jrTime, setJrTime] = useState("");
  const [jrSupervisionShowModal, setJrSupervisionShowModal] = useState(false);
  const [jrSupervisionId, setJrSupervisionId] = useState("");

  const [srExaminationName, setSrExaminationName] = useState("");
  const [srSelectedYear, setSrSelectedYear] = useState("");
  const [srType, setSrType] = useState("");
  const [srCourses, setSrCourses] = useState([]);
  const [srBranches, setSrBranches] = useState([]);
  const [srCourseId, setSrCourseId] = useState("");
  const [srBranchId, setSrBranchId] = useState("");
  const [srFacultyName, setSrFacultyName] = useState([]);
  const [srNoOfSupervisions, setSrNoOfSupervisions] = useState();
  const [srTime, setSrTime] = useState("");
  const [srSupervisionShowModal, setSrSupervisionShowModal] = useState(false);
  const [srSupervisionId, setSrSupervisionId] = useState("");

  const [odExaminationName, setOdExaminationName] = useState("");
  const [odSelectedYear, setOdSelectedYear] = useState("");
  const [odType, setOdType] = useState("");
  const [odTime, setOdTime] = useState("");
  const [odCourses, setOdCourses] = useState([]);
  const [odCourseId, setOdCourseId] = useState("");
  const [odBranches, setOdBranches] = useState([]);
  const [odBranchId, setOdBranchId] = useState("");
  const [odFacultyName, setOdFacultyName] = useState([]);
  const [otherDutyData, setOtherDutyData] = useState([]);
  const [odAssignedDuty, setOdAssignedDuty] = useState("");
  const [otherDutyShowModal, setOtherDutyShowModal] = useState(false);
  const [otherDutyId, setOtherDutyId] = useState("");

  const navigate = useNavigate();

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

      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/courses?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setCourses(response.data.data.courses);
          setSrCourses(response.data.data.courses);
          setOdCourses(response.data.data.courses);
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

  const [activeButton, setActiveButton] = useState("button1");

  function toggleContent(buttonId) {
    setActiveButton(buttonId);
  }

  const handleJrExaminationChange = (examination) => {
    setExaminationName(examination);
    handleJrViewPortChange();
  };

  const handleJrYearChange = (date) => {
    setSelectedYear(date);
    handleJrViewPortChange();
  };

  const handleJrTypeChange = (e) => {
    e.preventDefault();
    handleJrViewPortChange();
    if (e.target.value === "Select Type") {
      setJrTime("");
    } else {
      setJrType(e.target.value);
    }
  };

  const handleJrCourseChange = (e) => {
    e.preventDefault();
    setBranches([]);
    setFacultyName([]);
    setCourseId(e.target.value);
    handleJrViewPortChange();

    var course_id = e.target.value;
    if (subdomain !== null || subdomain !== "") {
      if (e.target.value !== "Select Course") {
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
    }
  };

  const handleJrBranchChange = (e) => {
    e.preventDefault();
    handleJrViewPortChange();

    if (e.target.value === "Select Branch") {
      setBranchId("");
    } else {
      setBranchId(e.target.value);
    }
  };

  const handleJrTimeChange = (e) => {
    e.preventDefault();
    setFacultyName([]);
    setJrTime(e.target.value);
    handleJrViewPortChange();
  };

  const createObject = (e, user_id, no_of_supervisions) => {
    e.preventDefault();
    e.target.disabled = true;
    e.target.classList.add("cursor-not-allowed");
    var selectedFilter = {};
    var timeTableSelectedFilter = {};
    if (examinationName === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear === "") {
      toast.error("Please select academic year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (jrType === "") {
      toast.error("Please select examination type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (jrTime === "" || jrTime === "Select time") {
      toast.error("Please select time", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: examinationName,
        academic_year: selectedYear,
        course_id: courseId,
        user_type: 0,
        list_type: "Junior",
        supervision_type: jrType,
        time: jrTime,
      };

      timeTableSelectedFilter = {
        name: examinationName,
        academic_year: selectedYear,
        course_id: courseId,
        time_table_type: jrType,
        time: jrTime,
      };

      if (branchId !== "") {
        selectedFilter = {
          examination_name: examinationName,
          academic_year: selectedYear,
          course_id: courseId,
          branch_id: branchId,
          user_type: 0,
          list_type: "Junior",
          supervision_type: jrType,
          time: jrTime,
        };

        timeTableSelectedFilter = {
          name: examinationName,
          academic_year: selectedYear,
          course_id: courseId,
          branch_id: branchId,
          time_table_type: jrType,
          time: jrTime,
        };
      }

      const no_of_supervisions = document.getElementById(
        "jr-student-input-user-" + user_id
      ).value;

      if (e.target.innerHTML === "Update") {
        e.target.innerHTML = "Assigning ...";
        var supervision_id = e.target.getAttribute("data-supervision-id");

        axios
          .put(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions/${supervision_id}?subdomain=${subdomain}`,
            {
              time_table: timeTableSelectedFilter,
              supervision: {
                no_of_supervisions: no_of_supervisions,
              },
            },
            {
              headers,
            }
          )
          .then((res) => {
            e.target.innerHTML = "Update";
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            if (res.data.status === "ok") {
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
        e.target.innerHTML = "Assigning ...";
        axios
          .post(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?subdomain=${subdomain}`,
            {
              time_table: timeTableSelectedFilter,
              supervision: {
                examination_name: examinationName,
                academic_year: selectedYear,
                course_id: courseId,
                user_id: user_id,
                list_type: "Junior",
                no_of_supervisions: no_of_supervisions,
                supervision_type: jrType,
                time: jrTime,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((res) => {
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            const jr_no_of_supervisions_input = document.getElementById(
              "jr-student-input-user-" + user_id
            );
            const jr_supervision_submit_button = document.getElementById(
              "jr-supervision-button-" + user_id
            );
            const delete_button = document.getElementById(
              "jr-delete-button-user-" + user_id
            );
            if (res.data.status === "created") {
              jr_supervision_submit_button.setAttribute(
                "data-supervision-id",
                res.data.data.supervision.id
              );
              delete_button.setAttribute(
                "data-supervision-id",
                res.data.data.supervision.id
              );
              delete_button.classList.remove("hidden");
              jr_no_of_supervisions_input.value =
                res.data.data.supervision.no_of_supervisions;
              jr_supervision_submit_button.innerHTML = "Update";

              toast.success(
                "Supervision has assigned, you can view that in the Reports!",
                {
                  position: toast.POSITION.BOTTOM_LEFT,
                }
              );
            } else {
              jr_no_of_supervisions_input.value = "";
              delete_button.classList.add("hidden");
              jr_supervision_submit_button.innerHTML = "Create";
              toast.error(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  const handleFilterSubmit = (e) => {
    let selectedFilter = {};
    if (examinationName === "Select Examination" || examinationName === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear === "Select Year" || selectedYear === "") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (jrType === "" || jrType === "Select Type") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "Select Course" || courseId === "") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (jrTime === "" || jrTime === "Select time") {
      toast.error("Please select time", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: examinationName,
        academic_year: selectedYear,
        course_id: courseId,
        user_type: 0,
        list_type: "Junior",
        supervision_type: jrType,
        time: jrTime,
      };

      if (branchId !== "") {
        selectedFilter = {
          examination_name: examinationName,
          academic_year: selectedYear,
          course_id: courseId,
          branch_id: branchId,
          user_type: 0,
          list_type: "Junior",
          supervision_type: jrType,
          time: jrTime,
        };
      }

      if (subdomain !== null || subdomain !== "") {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names`,
            {
              headers,
              params: {
                subdomain: subdomain,
                user: selectedFilter,
              },
            }
          )
          .then((res) => {
            console.log(res);
            const faculty_listing_viewport = document.getElementById(
              "jr_faculty_listing_viewport"
            );
            if (res.data.status === "ok") {
              if (res.data.data.users.length !== 0) {
                faculty_listing_viewport.classList.remove("hidden");
                faculty_listing_viewport.classList.add("flex");
                setFacultyName(res.data.data.users);
                res.data.data.users.map((faculty) => {
                  selectedFilter["user_id"] = faculty.id;
                  axios
                    .get(
                      `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions/${faculty.id}/fetch_details`,
                      {
                        headers,
                        params: {
                          subdomain: subdomain,
                          supervision: selectedFilter,
                        },
                      }
                    )
                    .then((res) => {
                      const jr_no_of_supervisions_input =
                        document.getElementById(
                          "jr-student-input-user-" + faculty.id
                        );
                      const jr_supervision_submit_button =
                        document.getElementById(
                          "jr-supervision-button-" + faculty.id
                        );
                      const delete_button = document.getElementById(
                        "jr-delete-button-user-" + faculty.id
                      );
                      if (res.data.message == "Details found") {
                        jr_supervision_submit_button.innerHTML = "Update";
                        delete_button.classList.remove("hidden");
                        delete_button.setAttribute(
                          "data-supervision-id",
                          res.data.data.supervision.id
                        );
                        jr_supervision_submit_button.setAttribute(
                          "data-supervision-id",
                          res.data.data.supervision.id
                        );
                        jr_no_of_supervisions_input.value =
                          res.data.data.supervision.no_of_supervisions;
                      } else {
                        jr_supervision_submit_button.innerHTML = "Create";
                        delete_button.classList.add("hidden");
                        jr_no_of_supervisions_input.value = "";
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                });
              } else {
                toast.error("No faculties found for selected criteria", {
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

  const handleJrViewPortChange = () => {
    const viewport = document.getElementById("jr_faculty_listing_viewport");
    viewport.classList.add("hidden");
    viewport.classList.remove("flex");
  };

  // Senior Supervision API

  const handleSrExaminationChange = (examination) => {
    setSrExaminationName(examination);
    handleSrViewPortChange();
  };

  const handleSrYearChange = (date) => {
    setSrSelectedYear(date);
    handleSrViewPortChange();
  };

  const handleSrTypeChange = (e) => {
    e.preventDefault();
    handleSrViewPortChange();

    if (e.target.value === "Select Type") {
      setSrTime("");
    } else {
      setSrType(e.target.value);
    }
  };

  const handleSrCourseChange = (e) => {
    e.preventDefault();
    setSrBranches([]);
    setSrFacultyName([]);
    setSrCourseId(e.target.value);

    handleSrViewPortChange();

    if (subdomain !== null || subdomain !== "") {
      if (e.target.value !== "Select Course") {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/branches?subdomain=${subdomain}&course_id=${e.target.value}`,
            { headers }
          )
          .then((response) => {
            setSrBranches(response.data.data.branches);
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const handleSrBranchChange = (e) => {
    e.preventDefault();
    setFacultyName([]);

    handleSrViewPortChange();

    if (e.target.value !== "Select Branch") {
      setSrBranchId(e.target.value);
    } else {
      setSrBranchId("");
    }
  };

  const handleSrTimeChange = (e) => {
    e.preventDefault();
    setSrFacultyName([]);
    setSrTime(e.target.value);
    handleSrViewPortChange();
  };

  const createSrObject = (e, user_id) => {
    e.preventDefault();
    e.target.disable = true;
    e.target.classList.add("cursor-not-allowed");
    const sr_no_of_supervisions = document.getElementById(
      "sr-student-input-user-" + user_id
    ).value;

    let selectedFilter = {};
    let timeTableSelectedFilter = {};
    if (srExaminationName === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srSelectedYear === "") {
      toast.error("Please select academic year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srType === "Select Type" || srType === "") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srCourseId === "Select Course" || srCourseId === "") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srTime === "" || srTime === "Select time") {
      toast.error("Please select time", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: srExaminationName,
        academic_year: srSelectedYear,
        user_id: user_id,
        course_id: srCourseId,
        list_type: "Senior",
        supervision_type: srType,
        time: srTime,
        no_of_supervisions: sr_no_of_supervisions,
        time: srTime,
      };

      timeTableSelectedFilter = {
        name: srExaminationName,
        academic_year: srSelectedYear,
        course_id: srCourseId,
        time_table_type: srType,
        time: srTime,
      };

      if (srBranchId !== "") {
        selectedFilter["branch_id"] = srBranchId;
        timeTableSelectedFilter["branch_id"] = srBranchId;
      } else {
        delete selectedFilter["branch_id"];
        delete timeTableSelectedFilter["branch_id"];
      }

      if (e.target.innerHTML === "Update") {
        e.target.innerHTML = "Assigning ...";
        let supervision_id = e.target.getAttribute("data-supervision-id");

        axios
          .put(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions/${supervision_id}`,
            {
              subdomain: subdomain,
              supervision: {
                no_of_supervisions: sr_no_of_supervisions,
              },
              time_table: timeTableSelectedFilter,
              time_table: timeTableSelectedFilter,
            },
            {
              headers,
            }
          )
          .then((res) => {
            e.target.innerHTML = "Update";
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            if (res.data.status === "ok") {
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
        e.target.innerHTML = "Assigning ...";
        axios
          .post(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions`,
            {
              supervision: selectedFilter,
              subdomain: subdomain,
              time_table: timeTableSelectedFilter,
              time_table: timeTableSelectedFilter,
            },
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((res) => {
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            const sr_no_of_supervisions_input = document.getElementById(
              "sr-student-input-user-" + user_id
            );
            const sr_supervision_submit_button = document.getElementById(
              "sr-supervision-button-" + user_id
            );
            const delete_button = document.getElementById(
              "sr-delete-button-user-" + user_id
            );
            if (res.data.status === "created") {
              sr_supervision_submit_button.setAttribute(
                "data-supervision-id",
                res.data.data.supervision.id
              );
              delete_button.setAttribute(
                "data-supervision-id",
                res.data.data.supervision.id
              );
              delete_button.classList.remove("hidden");
              sr_no_of_supervisions_input.value =
                res.data.data.supervision.no_of_supervisions;
              sr_supervision_submit_button.innerHTML = "Update";
              toast.success(
                "Supervision has been assigned, you can view that in Reports!",
                {
                  position: toast.POSITION.BOTTOM_LEFT,
                }
              );
            } else {
              sr_no_of_supervisions_input.value = "";
              sr_supervision_submit_button.innerHTML = "Create";
              toast.error(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  const handleSrFilterSubmit = (e) => {
    let selectedFilter = {};
    let timeTableSelectedFilter = {};
    if (srExaminationName === "Select Examination") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srSelectedYear === "Select Year") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srType === "Select Type" || srType === "") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srCourseId === "Select Course" || srCourseId === "") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srTime === "" || srTime === "Select time") {
      toast.error("Please select time", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: srExaminationName,
        academic_year: srSelectedYear,
        course_id: srCourseId,
        user_type: 1,
        supervision_type: srType,
        list_type: "Senior",
        time: srTime,
      };

      timeTableSelectedFilter = {
        examination_name: srExaminationName,
        academic_year: srSelectedYear,
        course_id: srCourseId,
        user_type: 1,
        time_table_type: srType,
        list_type: "Senior",
        time: srTime,
      };

      if (srBranchId !== "") {
        selectedFilter["branch_id"] = srBranchId;
        timeTableSelectedFilter["branch_id"] = srBranchId;
      } else {
        delete selectedFilter["branch_id"];
        delete timeTableSelectedFilter["branch_id"];
      }

      if (subdomain !== null || subdomain !== "") {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculty_names`,
            {
              headers,
              params: {
                subdomain: subdomain,
                user: selectedFilter,
              },
            }
          )
          .then((res) => {
            console.log(res);
            const faculty_listing_viewport = document.getElementById(
              "sr_faculty_listing_viewport"
            );
            if (res.data.status === "ok") {
              if (res.data.data.users.length !== 0) {
                faculty_listing_viewport.classList.remove("hidden");
                faculty_listing_viewport.classList.add("flex");
                setSrFacultyName(res.data.data.users);
                res.data.data.users.map((faculty) => {
                  axios
                    .get(
                      `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions/${faculty.id}/fetch_details`,
                      {
                        headers,
                        params: {
                          subdomain: subdomain,
                          supervision: selectedFilter,
                        },
                      }
                    )
                    .then((res) => {
                      const sr_no_of_supervisions_input =
                        document.getElementById(
                          "sr-student-input-user-" + faculty.id
                        );
                      const sr_supervision_submit_button =
                        document.getElementById(
                          "sr-supervision-button-" + faculty.id
                        );
                      const delete_button = document.getElementById(
                        "sr-delete-button-user-" + faculty.id
                      );
                      if (res.data.status == "ok") {
                        sr_supervision_submit_button.innerHTML = "Update";
                        sr_supervision_submit_button.setAttribute(
                          "data-supervision-id",
                          res.data.data.supervision.id
                        );
                        delete_button.classList.remove("hidden");
                        delete_button.setAttribute(
                          "data-supervision-id",
                          res.data.data.supervision.id
                        );
                        sr_no_of_supervisions_input.value =
                          res.data.data.supervision.no_of_supervisions;
                      } else {
                        sr_supervision_submit_button.innerHTML = "Create";
                        sr_no_of_supervisions_input.value = "";
                        delete_button.classList.add("hidden");
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                });
              } else {
                toast.error("No Senior faculties found for selected criteria", {
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

  const handleSrViewPortChange = () => {
    const viewport = document.getElementById("sr_faculty_listing_viewport");
    viewport.classList.add("hidden");
    viewport.classList.remove("flex");
  };

  // # Other Duties API
  const handleODExaminationChange = (e) => {
    setOdExaminationName(e);
    handleOdViewPortChange();
  };

  const handleODYearChange = (e) => {
    setOdSelectedYear(e);
    handleOdViewPortChange();
  };

  const handleODTypeChange = (e) => {
    e.preventDefault();
    handleOdViewPortChange();
    if (e.target.value === "Select Type") {
      setOdType("");
    } else {
      setOdType(e.target.value);
    }
  };

  const handleODTimeChange = (e) => {
    e.preventDefault();
    setFacultyName([]);
    setJrTime(e.target.value);
    handleOdViewPortChange();
  };

  const handleODCourseChange = (e) => {
    e.preventDefault();
    setOdBranches([]);
    setOdFacultyName([]);
    setOtherDutyData([]);
    // setSrFacultyName([]);
    setOdCourseId(e.target.value);
    handleOdViewPortChange();
    if (subdomain !== null || subdomain !== "") {
      if (e.target.value !== "Select Course") {
        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/branches?subdomain=${subdomain}&course_id=${e.target.value}`,
            { headers }
          )
          .then((response) => {
            setOdBranches(response.data.data.branches);
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const handleODBranchChange = (e) => {
    e.preventDefault();
    setFacultyName([]);
    handleOdViewPortChange();
    if (e.target.value !== "Select Branch") {
      setOdBranchId(e.target.value);
    } else {
      setOdBranchId("");
    }
  };

  const handleODFilterSubmit = (e) => {
    let selectedFilter = {};
    if (odExaminationName === "Select examination") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odSelectedYear === "Select Year") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odType === "" || odType === "Select Type") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odCourseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odTime === "" || odTime === "Select Time") {
      toast.error("Please select time", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: odExaminationName,
        academic_year: odSelectedYear,
        course_id: odCourseId,
        time: odTime,
        other_duty_type: odType,
      };

      if (odBranchId !== "") {
        selectedFilter = {
          examination_name: odExaminationName,
          academic_year: odSelectedYear,
          course_id: odCourseId,
          branch_id: odBranchId,
          time: odTime,
          other_duty_type: odType,
        };
      }
    }

    if (subdomain !== null || subdomain !== "") {
      axios
        .get(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/users/users/faculties_for_other_duties`,
          {
            headers,
            params: {
              subdomain: subdomain,
              user: selectedFilter,
            },
          }
        )
        .then((res) => {
          console.log(res);
          const faculty_listing_viewport = document.getElementById(
            "od_faculty_listing_viewport"
          );

          if (res.data.status === "ok") {
            if (res.data.data.users.length !== 0) {
              faculty_listing_viewport.classList.remove("hidden");
              faculty_listing_viewport.classList.add("flex");
              setOdFacultyName(res.data.data.users);
              res.data.data.users.map((faculty) => {
                axios
                  .get(
                    `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties/${faculty.id}/fetch_details`,
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
                    const od_assigned_duty_input = document.getElementById(
                      "od-assigned-duty-user-" + faculty.id
                    );
                    const other_duty_submit_button = document.getElementById(
                      "other-duty-button-" + faculty.id
                    );
                    const delete_button = document.getElementById(
                      "od-delete-button-user-" + faculty.id
                    );
                    if (res.data.message == "Details found") {
                      other_duty_submit_button.setAttribute(
                        "data-other-duty-id",
                        res.data.data.other_duty.id
                      );
                      other_duty_submit_button.innerHTML = "Update";
                      delete_button.classList.remove("hidden");
                      delete_button.setAttribute(
                        "data-other-duty-id",
                        res.data.data.other_duty.id
                      );
                      od_assigned_duty_input.value =
                        res.data.data.other_duty.assigned_duties;
                    } else {
                      other_duty_submit_button.innerHTML = "Create";
                      od_assigned_duty_input.value = "";
                      delete_button.classList.add("hidden");
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              });
            } else {
              toast.error("No faculties found for selected criteria", {
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

  const createODObject = (e, user_id) => {
    e.preventDefault();
    e.target.disabled = true;
    e.target.classList.add("cursor-not-allowed");
    const od_assigned_duty = document.getElementById(
      "od-assigned-duty-user-" + user_id
    ).value;
    var request_body = {};
    if (odExaminationName === "Select Examination") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odSelectedYear === "Select Year") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odType === "" || odType === "Select Type") {
      toast.error("Please select type", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odCourseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odTime === "" || odTime === "Select time") {
      toast.error("Please select time", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      if (odBranchId !== "") {
        request_body = {
          examination_name: odExaminationName,
          academic_year: odSelectedYear,
          user_id: user_id,
          course_id: odCourseId,
          branch_id: odBranchId,
          assigned_duties: od_assigned_duty,
          time: odTime,
          other_duty_type: odType,
        };
      } else {
        request_body = {
          examination_name: odExaminationName,
          academic_year: odSelectedYear,
          user_id: user_id,
          course_id: odCourseId,
          assigned_duties: od_assigned_duty,
          time: odTime,
          other_duty_type: odType,
        };
      }

      if (e.target.innerHTML === "Update") {
        e.target.innerHTML = "Assigning ...";
        var other_duty_id = e.target.getAttribute("data-other-duty-id");

        axios
          .put(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties/${other_duty_id}`,
            {
              subdomain: subdomain,
              other_duty: {
                assigned_duties: od_assigned_duty,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((res) => {
            e.target.innerHTML = "Update";
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            if (res.data.status == "ok") {
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
        e.target.innerHTML = "Assigning ...";
        axios
          .post(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties`,
            {
              other_duty: request_body,
              subdomain: subdomain,
            },
            {
              headers: {
                Authorization: `Bearer ${acces_token}`,
              },
            }
          )
          .then((res) => {
            e.target.disabled = false;
            e.target.classList.remove("cursor-not-allowed");
            const od_assigned_duty_input = document.getElementById(
              "od-assigned-duty-user-" + user_id
            );
            const od_submit_button = document.getElementById(
              "other-duty-button-" + user_id
            );
            const delete_button = document.getElementById(
              "od-delete-button-user-" + user_id
            );
            if (res.data.status === "created") {
              od_submit_button.setAttribute(
                "data-other-duty-id",
                res.data.data.other_duty.id
              );
              delete_button.setAttribute(
                "data-other-duty-id",
                res.data.data.other_duty.id
              );
              delete_button.classList.remove("hidden");
              od_assigned_duty_input.value =
                res.data.data.other_duty.assigned_duties;
              od_submit_button.innerHTML = "Update";
              toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            } else {
              od_assigned_duty_input.value = "";
              od_submit_button.innerHTML = "Create";
              toast.error(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };

  const handleOdViewPortChange = () => {
    const viewport = document.getElementById("od_faculty_listing_viewport");
    viewport.classList.add("hidden");
    viewport.classList.remove("flex");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      {acces_token && roles.includes("Examination Controller") ? (
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
                      className="flex items-center p-2  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                      className="flex items-center p-2 bg-slate-600 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
              <div className="flex flex-col items-center mt-14">
                <div className="flex justify-center space-x-4 mb-5">
                  <button
                    className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                      activeButton === "button1" ? "bg-slate-800" : ""
                    }`}
                    onClick={() => toggleContent("button1")}
                  >
                    Assign Jr. Supervisors
                  </button>
                  <button
                    className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                      activeButton === "button2" ? "bg-slate-800" : ""
                    }`}
                    onClick={() => toggleContent("button2")}
                  >
                    Assign Sr. Supervisor
                  </button>
                  <button
                    className={`bg-slate-500  text-white font-bold py-2 px-4 rounded-lg ${
                      activeButton === "button3" ? "bg-slate-800" : ""
                    }`}
                    onClick={() => toggleContent("button3")}
                  >
                    Assign Other Duites
                  </button>
                </div>
                <div className="flex w-full">
                  <div
                    id="content1"
                    className={`min-w-full p-4 rounded-lg ${
                      activeButton === "button1" ? "block" : "hidden"
                    }`}
                  >
                    <div className="flex ml-2">
                      <select
                        className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={(e) => {
                          handleJrExaminationChange(e.target.value);
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

                      <select
                        className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={(e) => handleJrYearChange(e.target.value)}
                      >
                        <option value="Select Year">Year</option>
                        {academic_years.map((year) => {
                          return <option value={year}>{year}</option>;
                        })}
                      </select>

                      <select
                        className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                        onChange={handleJrTypeChange}
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
                        className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={handleJrCourseChange}
                      >
                        <option value="Select Course">Course</option>
                        {courses.map((course) => (
                          <option value={course.id}>{course.name}</option>
                        ))}
                      </select>

                      <select
                        className="w-auto form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2"
                        onChange={handleJrBranchChange}
                      >
                        <option value="Select Branch">Branch</option>
                        {branches.map((branch) => (
                          <option style={{ width: 100 }} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>

                      <select
                        className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={(e) => {
                          handleJrTimeChange(e);
                          if (e.target.value !== "Select Time") {
                            setJrTime(e.target.value);
                          } else {
                            setJrTime("");
                          }
                        }}
                      >
                        <option value="Select time"> Time </option>
                        {examinationTimes.map((examination_time) => {
                          return (
                            <option value={examination_time.name}>
                              {examination_time.name}
                            </option>
                          );
                        })}
                      </select>

                      <button
                        className="text-center ml-4 w-auto bg-transparent text-slate-950 p-3 rounded-2xl tracking-wide border border-slate-950
                      font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-700 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                        id="jr-submit-button"
                        onClick={handleFilterSubmit}
                      >
                        <p className="inline-flex">
                          Search <GiArchiveResearch className="mt-1 ml-2" />
                        </p>
                      </button>
                    </div>
                    <div
                      id="jr_faculty_listing_viewport"
                      className="hidden overflow-y-scroll h-[65vh] max-h-fit flex-col mt-5"
                    >
                      <div className="">
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
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Designation
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Department
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Enter No. Of Supervision
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {facultyName.map((item) => {
                                  if (Object.keys(facultyName).length !== 0) {
                                    return (
                                      <tr>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                          {item.first_name} {item.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                                          {item.designation}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                                          {item.department}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium flex justify-center whitespace-nowrap">
                                          <input
                                            className="shadow appearance-none border rounded w-52 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id={
                                              "jr-student-input-user-" + item.id
                                            }
                                            onChange={(e) =>
                                              setNoOfSupervisions(
                                                parseInt(e.target.value)
                                              )
                                            }
                                            type="text"
                                            placeholder="Enter No. Of Supervision"
                                          />
                                        </td>
                                        <td
                                          className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap"
                                          data-id={item.id}
                                        >
                                          <button
                                            className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                          font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                                            id={
                                              "jr-supervision-button-" + item.id
                                            }
                                            onClick={(e) =>
                                              createObject(
                                                e,
                                                item.id,
                                                noOfSupervisions
                                              )
                                            }
                                          >
                                            Create
                                          </button>

                                          <button
                                            id={
                                              "jr-delete-button-user-" + item.id
                                            }
                                            className="hidden text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-red-600 hover:text-slate-50 hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                                            onClick={(e) => {
                                              setJrSupervisionShowModal(true);
                                              setJrSupervisionId(
                                                e.target.getAttribute(
                                                  "data-supervision-id"
                                                )
                                              );
                                            }}
                                          >
                                            Delete
                                          </button>
                                          {jrSupervisionShowModal && (
                                            <JrSupervisionModal
                                              setOpenModal={
                                                setJrSupervisionShowModal
                                              }
                                              id={jrSupervisionId}
                                            />
                                          )}
                                        </td>
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
                  <div
                    id="content2"
                    className={`min-w-full p-4 rounded-lg ${
                      activeButton === "button2" ? "block" : "hidden"
                    }`}
                  >
                    <div className="flex ml-2">
                      <select
                        className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={(e) => {
                          handleSrExaminationChange(e.target.value);
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

                      <select
                        className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={(e) => handleSrYearChange(e.target.value)}
                      >
                        <option value="Select Year">Year</option>
                        {academic_years.map((year) => {
                          return <option value={year}>{year}</option>;
                        })}
                      </select>

                      <select
                        className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                        onChange={handleSrTypeChange}
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
                        className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={handleSrCourseChange}
                      >
                        <option value="Select Course">Course</option>
                        {srCourses.map((course) => (
                          <option value={course.id}>{course.name}</option>
                        ))}
                      </select>

                      <select
                        className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2"
                        onChange={handleSrBranchChange}
                      >
                        <option value="Select Branch">Branch</option>
                        {srBranches.map((branch) => (
                          <option value={branch.id}>{branch.name}</option>
                        ))}
                      </select>

                      <select
                        className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={(e) => {
                          handleSrTimeChange(e);
                          if (e.target.value !== "Select Time") {
                            setSrTime(e.target.value);
                          } else {
                            setSrTime("");
                          }
                        }}
                      >
                        <option value="Select time"> Time </option>
                        {examinationTimes.map((examination_time) => {
                          return (
                            <option value={examination_time.name}>
                              {examination_time.name}
                            </option>
                          );
                        })}
                      </select>
                      <button
                        className="text-center ml-4 w-auto bg-transparent text-slate-950 p-3 rounded-2xl tracking-wide border border-slate-950
                      font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-700 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                        id={"sr-submit-button"}
                        onClick={handleSrFilterSubmit}
                      >
                        <p className="inline-flex">
                          Search <GiArchiveResearch className="mt-1 ml-2" />
                        </p>
                      </button>
                    </div>
                    <div
                      id="sr_faculty_listing_viewport"
                      className="hidden flex-col overflow-y-scroll h-[65vh] max-h-fit mt-5"
                    >
                      <div className="">
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
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Designation
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Department
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Enter No. Of Supervision
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {srFacultyName.map((item) => {
                                  if (Object.keys(srFacultyName).length !== 0) {
                                    return (
                                      <tr>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                          {item.first_name} {item.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                                          {item.designation}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                                          {item.department}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium flex justify-center whitespace-nowrap">
                                          <input
                                            className="shadow appearance-none border rounded w-52 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id={
                                              "sr-student-input-user-" + item.id
                                            }
                                            onChange={(e) =>
                                              setSrNoOfSupervisions(
                                                parseInt(e.target.value)
                                              )
                                            }
                                            type="text"
                                            placeholder="Enter No. Of Supervision"
                                          />
                                        </td>
                                        <td
                                          className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap"
                                          data-id={item.id}
                                        >
                                          <button
                                            className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                          font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                                            id={
                                              "sr-supervision-button-" + item.id
                                            }
                                            onClick={(e) =>
                                              createSrObject(e, item.id)
                                            }
                                          >
                                            Create
                                          </button>

                                          <button
                                            id={
                                              "sr-delete-button-user-" + item.id
                                            }
                                            className="hidden text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-red-600 hover:text-slate-50 hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                                            onClick={(e) => {
                                              setSrSupervisionShowModal(true);
                                              setSrSupervisionId(
                                                e.target.getAttribute(
                                                  "data-supervision-id"
                                                )
                                              );
                                            }}
                                          >
                                            Delete
                                          </button>
                                          {srSupervisionShowModal && (
                                            <SrSupervisionModal
                                              setOpenModal={
                                                setSrSupervisionShowModal
                                              }
                                              id={srSupervisionId}
                                            />
                                          )}
                                        </td>
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
                  <div
                    id="content3"
                    className={`w-full p-4 rounded-lg ${
                      activeButton === "button3" ? "block" : "hidden"
                    }`}
                  >
                    <div className="flex ml-2">
                      <select
                        className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={(e) => {
                          handleODExaminationChange(e.target.value);
                        }}
                      >
                        <option value="Select examination">Examination</option>
                        {examinationNames.map((examination_name) => {
                          return (
                            <option value={examination_name.name}>
                              {examination_name.name}
                            </option>
                          );
                        })}
                      </select>

                      <select
                        className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={(e) => handleODYearChange(e.target.value)}
                      >
                        <option value="Select Year">Year</option>
                        {academic_years.map((year) => {
                          return <option value={year}>{year}</option>;
                        })}
                      </select>

                      <select
                        className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2 w-auto"
                        onChange={handleODTypeChange}
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
                        className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={handleODCourseChange}
                      >
                        <option value="Select Course">Course</option>
                        {odCourses.map((course) => (
                          <option value={course.id}>{course.name}</option>
                        ))}
                      </select>

                      <select
                        className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2"
                        onChange={handleODBranchChange}
                      >
                        <option value="Select Branch">Branch</option>
                        {odBranches.map((branch) => (
                          <option value={branch.id}>{branch.name}</option>
                        ))}
                      </select>

                      <select
                        className="w-auto form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                        onChange={(e) => {
                          handleODTimeChange(e);
                          if (e.target.value !== "Select Time") {
                            setOdTime(e.target.value);
                          } else {
                            setOdTime("");
                          }
                        }}
                      >
                        <option value="Select time"> Time </option>
                        {examinationTimes.map((examination_time) => {
                          return (
                            <option value={examination_time.name}>
                              {examination_time.name}
                            </option>
                          );
                        })}
                      </select>

                      <button
                        className="text-center ml-4 w-auto bg-transparent text-slate-950 p-3 rounded-2xl tracking-wide border border-slate-950
                      font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-700 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                        id={"od-submit-button"}
                        onClick={handleODFilterSubmit}
                      >
                        <p className="inline-flex">
                          Search <GiArchiveResearch className="mt-1 ml-2" />
                        </p>
                      </button>
                    </div>
                    <div
                      id="od_faculty_listing_viewport"
                      className="hidden overflow-y-scroll flex-col mt-5 h-[65vh] max-h-fit"
                      style={{ height: 445 }}
                    >
                      <div className="">
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
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Designation
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Department
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Assign Other Duty
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {odFacultyName.map((item) => {
                                  if (Object.keys(odFacultyName).length !== 0) {
                                    return (
                                      <tr>
                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                          {item.first_name} {item.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                                          {item.designation}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap">
                                          {item.course_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium flex justify-center whitespace-nowrap">
                                          <input
                                            className="shadow appearance-none border rounded w-52 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id={
                                              "od-assigned-duty-user-" + item.id
                                            }
                                            onChange={(e) =>
                                              setOdAssignedDuty(e.target.value)
                                            }
                                            type="text"
                                            placeholder="Assign Duty"
                                          />
                                        </td>
                                        <td
                                          className="px-6 py-4 text-sm text-center text-gray-800 whitespace-nowrap"
                                          data-id={item.id}
                                        >
                                          <button
                                            className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                          font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                                            id={"other-duty-button-" + item.id}
                                            onClick={(e) =>
                                              createODObject(e, item.id)
                                            }
                                          >
                                            Create
                                          </button>

                                          <button
                                            id={
                                              "od-delete-button-user-" + item.id
                                            }
                                            className="hidden text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                      font-semibold focus:outline-none focus:shadow-outline hover:bg-red-600 hover:text-slate-50 hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
                                            onClick={(e) => {
                                              setOtherDutyShowModal(true);
                                              setOtherDutyId(
                                                e.target.getAttribute(
                                                  "data-other-duty-id"
                                                )
                                              );
                                            }}
                                          >
                                            Delete
                                          </button>
                                          {otherDutyShowModal && (
                                            <OtherDutyModal
                                              setOpenModal={
                                                setOtherDutyShowModal
                                              }
                                              id={otherDutyId}
                                            />
                                          )}
                                        </td>
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
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExamAssignSupervision;
