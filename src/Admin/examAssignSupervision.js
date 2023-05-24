import axios, { Axios } from "axios";
import moment from "moment/moment";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";

import { useReactToPrint } from "react-to-print";

var acces_token;
var headers;
var subdomain;

const ExamAssignSupervision = () => {
  const [uniName, setUniName] = useState("");
  const [dateCheckBox, setDateCheckBox] = useState([]);
  const [examinationName, setExaminationName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [facultyName, setFacultyName] = useState([]);
  const [noOfSupervisions, setNoOfSupervisions] = useState();
  const [branches, setBranches] = useState([]);
  const [storedTimeTables, setStoredTimeTable] = useState([]);
  const [supervisionData, setSupervisionData] = useState([]);
  const [academic_years, setAcademicYears] = useState([]);

  const [srExaminationName, setSrExaminationName] = useState("");
  const [srSelectedYear, setSrSelectedYear] = useState("");
  const [srCourses, setSrCourses] = useState([]);
  const [srBranches, setSrBranches] = useState([]);
  const [srCourseId, setSrCourseId] = useState([]);
  const [srBranchId, setSrBranchId] = useState([]);
  const [srFacultyName, setSrFacultyName] = useState([]);
  const [srNoOfSupervisions, setSrNoOfSupervisions] = useState();
  const [srSupervisionData, setSrSupervisionData] = useState([]);
  const [srStoredTimeTables, setSrStoredTimeTable] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [srDateCheckBox, setSrDateCheckBox] = useState([]);

  const [odExaminationName, setOdExaminationName] = useState("");
  const [odSelectedYear, setOdSelectedYear] = useState("");
  const [odCourses, setOdCourses] = useState([]);
  const [odCourseId, setOdCourseId] = useState("");
  const [odBranches, setOdBranches] = useState([]);
  const [odBranchId, setOdBranchId] = useState("");
  const [odFacultyName, setOdFacultyName] = useState([]);
  const [otherDutyData, setOtherDutyData] = useState([]);
  const [odAssignedDuty, setOdAssignedDuty] = useState("");

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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/courses?subdomain=${subdomain}`,
          { headers }
        )
        .then((response) => {
          setCourses(response.data.data.courses);
          setSrCourses(response.data.data.courses);
          setOdCourses(response.data.data.courses);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }
  const [activeButton, setActiveButton] = useState("button1");

  function toggleContent(buttonId) {
    setActiveButton(buttonId);
  }

  const handleJrExaminationChange = (examination) => {
    setExaminationName(examination);
  };

  const handleJrYearChange = (date) => {
    setSelectedYear(date);
  };

  const handleJrCourseChange = (e) => {
    e.preventDefault();
    setBranches([]);
    setFacultyName([]);
    setCourseId(e.target.value);
    const supervision_listing_table = document.getElementById(
      "supervision_list_table"
    );
    supervision_listing_table.classList.add("hidden");
    supervision_listing_table.classList.remove("flex");
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
    if (e.target.value === "Select Branch") {
      setBranchId("");
    } else {
      setBranchId(e.target.value);
    }
  };

  const createObject = (user_id, no_of_supervisions) => {
    console.log(user_id);
    console.log(no_of_supervisions);
    if (examinationName === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear === "") {
      toast.error("Please select academic year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      axios
        .post(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions?subdomain=${subdomain}`,
          {
            supervision: {
              examination_name: examinationName,
              academic_year: selectedYear,
              course_id: courseId,
              user_id: user_id,
              list_type: "Junior",
              no_of_supervisions: no_of_supervisions,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((res) => {
          const jr_no_of_supervisions_input = document.getElementById(
            "jr-student-input-user-" + user_id
          );
          const jr_supervision_submit_button = document.getElementById(
            "jr-supervision-button-" + user_id
          );
          if (res.data.status === "created") {
            jr_no_of_supervisions_input.disabled = true;
            jr_no_of_supervisions_input.value =
              res.data.data.supervision.no_of_supervisions;
            jr_no_of_supervisions_input.classList.add("cursor-not-allowed");
            jr_supervision_submit_button.disabled = true;
            jr_supervision_submit_button.innerHTML = "Created";
            jr_supervision_submit_button.classList.add("cursor-not-allowed");
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
    }
  };

  const handlechangeDateCheckBox = (event) => {
    setDateCheckBox({
      ...dateCheckBox,
      [event.target.name]: event.target.checked,
    });
  };

  const handleJuniorSupervisionSubmit = (e) => {
    e.preventDefault();
    const supervision_id = e.target.getAttribute("data-id");
    const access_token = localStorage.getItem("access_token");
    console.log(acces_token);
    const metadata = dateCheckBox;
    const requestBody = {
      supervision: {
        examination_name: examinationName,
        academic_year: selectedYear,
        metadata: { metadata },
      },
    };
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    axios
      .put(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions/${supervision_id}?subdomain=${subdomain}`,
        requestBody,
        config
      )
      .then((res) => {
        if (res.data.message == "Supervision Altered") {
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
  };

  const handleFilterSubmit = (e) => {
    console.log("Button clicked");
    let selectedFilter = {};
    if (examinationName === "Select Examination") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (selectedYear === "Select Year") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (courseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: examinationName,
        academic_year: selectedYear,
        course_id: courseId,
        user_type: 0,
      };

      if (branchId !== "") {
        selectedFilter = {
          examination_name: examinationName,
          academic_year: selectedYear,
          course_id: courseId,
          branch_id: branchId,
          user_type: 0,
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
              "faculty_listing_viewport"
            );
            if (res.data.status === "ok") {
              if (res.data.data.users.length !== 0) {
                faculty_listing_viewport.classList.remove("hidden");
                faculty_listing_viewport.classList.add("flex");
                setFacultyName(res.data.data.users);
                res.data.data.users.map((faculty) => {
                  axios
                    .get(
                      `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions/${faculty.id}/fetch_details?subdomain=${subdomain}`,
                      { headers }
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
                      if (res.data.message == "Details found") {
                        jr_supervision_submit_button.disabled = true;
                        jr_supervision_submit_button.innerHTML = "Created";
                        jr_supervision_submit_button.classList.add(
                          "cursor-not-allowed"
                        );

                        jr_no_of_supervisions_input.disabled = true;
                        jr_no_of_supervisions_input.value =
                          res.data.data.supervision.no_of_supervisions;
                        jr_no_of_supervisions_input.classList.add(
                          "cursor-not-allowed"
                        );
                      } else {
                        jr_supervision_submit_button.disabled = false;
                        jr_supervision_submit_button.innerHTML = "Create";
                        jr_supervision_submit_button.classList.remove(
                          "cursor-not-allowed"
                        );

                        jr_no_of_supervisions_input.disabled = false;
                        jr_no_of_supervisions_input.value = "";
                        jr_no_of_supervisions_input.classList.remove(
                          "cursor-not-allowed"
                        );
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                });
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });

        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions`,
            {
              headers,
              params: {
                supervision: selectedFilter,
                type: "Junior",
                subdomain: subdomain,
              },
            }
          )
          .then((res) => {
            if (res.data.message === "These are all the supervisions") {
              console.log(res.data.data.supervisions);
              if (res.data.data.supervisions.length !== 0) {
                setSupervisionData(res.data.data.supervisions);
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });

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
            const supervision_listing_table = document.getElementById(
              "supervision_list_table"
            );
            if (response.data.message === "Examination dates are as below") {
              if (response.data.data.dates.length !== 0) {
                setStoredTimeTable(response.data.data.dates);
                supervision_listing_table.classList.remove("hidden");
                supervision_listing_table.classList.add("flex");
              }
            }
          })
          .catch((error) => console.log(error));
      }
    }
  };

  // Senior Supervision API

  const handleSrExaminationChange = (examination) => {
    setSrExaminationName(examination);
  };

  const handleSrYearChange = (date) => {
    setSrSelectedYear(date);
  };

  const handleSrCourseChange = (e) => {
    e.preventDefault();
    setSrBranches([]);
    setSrFacultyName([]);
    setSrCourseId(e.target.value);
    const sr_supervision_listing_table = document.getElementById(
      "sr_supervision_listing_table"
    );
    // supervision_listing_table.classList.add("hidden");
    // supervision_listing_table.classList.remove("flex");
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
    if (e.target.value !== "Select Branch") {
      setSrBranchId(e.target.value);
    } else {
      setSrBranchId("");
    }
  };

  const createSrObject = (user_id, sr_no_of_supervisions) => {
    let request_body = {};
    if (srExaminationName === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srSelectedYear === "") {
      toast.error("Please select academic year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srCourseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      if (srBranchId !== "") {
        request_body = {
          examination_name: srExaminationName,
          academic_year: srSelectedYear,
          user_id: user_id,
          course_id: srCourseId,
          branch_id: srBranchId,
          list_type: "Senior",
          no_of_supervisions: sr_no_of_supervisions,
        };
      } else {
        request_body = {
          examination_name: srExaminationName,
          academic_year: srSelectedYear,
          user_id: user_id,
          course_id: srCourseId,
          list_type: "Senior",
          no_of_supervisions: sr_no_of_supervisions,
        };
      }

      console.log("Button Clicked");

      axios
        .post(
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions`,
          {
            supervision: request_body,
            subdomain: subdomain,
          },
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((res) => {
          const sr_no_of_supervisions_input = document.getElementById(
            "sr-student-input-user-" + user_id
          );
          const sr_supervision_submit_button = document.getElementById(
            "sr-supervision-button-" + user_id
          );
          if (res.data.status === "created") {
            sr_no_of_supervisions_input.disabled = true;
            sr_no_of_supervisions_input.value =
              res.data.data.supervision.no_of_supervisions;
            sr_no_of_supervisions_input.classList.add("cursor-not-allowed");
            sr_supervision_submit_button.disabled = true;
            sr_supervision_submit_button.innerHTML = "Created";
            sr_supervision_submit_button.classList.add("cursor-not-allowed");
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
    }
  };

  const handleSrFilterSubmit = (e) => {
    let selectedFilter = {};
    if (srExaminationName === "Select Examination") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srSelectedYear === "Select Year") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (srCourseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: srExaminationName,
        academic_year: srSelectedYear,
        course_id: srCourseId,
        user_type: 1,
      };

      if (srBranchId !== "") {
        selectedFilter = {
          examination_name: srExaminationName,
          academic_year: srSelectedYear,
          course_id: srCourseId,
          branch_id: srBranchId,
          user_type: 1,
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
                      `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions/${faculty.id}/fetch_details?subdomain=${subdomain}`,
                      { headers }
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
                      if (res.data.message == "Details found") {
                        sr_supervision_submit_button.disabled = true;
                        sr_supervision_submit_button.innerHTML = "Created";
                        sr_supervision_submit_button.classList.add(
                          "cursor-not-allowed"
                        );

                        sr_no_of_supervisions_input.disabled = true;
                        sr_no_of_supervisions_input.value =
                          res.data.data.supervision.no_of_supervisions;
                        sr_no_of_supervisions_input.classList.add(
                          "cursor-not-allowed"
                        );
                      } else {
                        sr_supervision_submit_button.disabled = false;
                        sr_supervision_submit_button.innerHTML = "Create";
                        sr_supervision_submit_button.classList.remove(
                          "cursor-not-allowed"
                        );

                        sr_no_of_supervisions_input.disabled = false;
                        sr_no_of_supervisions_input.value = "";
                        sr_no_of_supervisions_input.classList.remove(
                          "cursor-not-allowed"
                        );
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                });
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });

        axios
          .get(
            `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions`,
            {
              headers,
              params: {
                supervision: selectedFilter,
                type: "Senior",
                subdomain: subdomain,
              },
            }
          )
          .then((res) => {
            if (res.data.message === "These are all the supervisions") {
              console.log(res.data.data.supervisions);
              if (res.data.data.supervisions.length !== 0) {
                setSrSupervisionData(res.data.data.supervisions);
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });

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
            const supervision_listing_table = document.getElementById(
              "sr_supervision_list_table"
            );
            if (response.data.message === "Examination dates are as below") {
              if (response.data.data.dates.length !== 0) {
                setSrStoredTimeTable(response.data.data.dates);
                supervision_listing_table.classList.remove("hidden");
                supervision_listing_table.classList.add("flex");
              }
            }
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const handlechangeSrDateCheckBox = (event) => {
    setSrDateCheckBox({
      ...dateCheckBox,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSeniorSupervisionSubmit = (e) => {
    e.preventDefault();
    const supervision_id = e.target.getAttribute("data-id");
    const access_token = localStorage.getItem("access_token");
    console.log(acces_token);
    const metadata = srDateCheckBox;
    const requestBody = {
      supervision: {
        examination_name: examinationName,
        academic_year: selectedYear,
        metadata: { metadata },
      },
    };
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    axios
      .put(
        `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/supervisions/${supervision_id}?subdomain=${subdomain}`,
        requestBody,
        config
      )
      .then((res) => {
        if (res.data.message == "Supervision Altered") {
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
  };

  // # Other Duties API
  const handleODExaminationChange = (e) => {
    setOdExaminationName(e);
  };

  const handleODYearChange = (e) => {
    setOdSelectedYear(e);
  };

  const handleODCourseChange = (e) => {
    e.preventDefault();
    setOdBranches([]);
    // setSrFacultyName([]);
    setOdCourseId(e.target.value);
    const sr_supervision_listing_table = document.getElementById(
      "sr_supervision_listing_table"
    );
    // supervision_listing_table.classList.add("hidden");
    // supervision_listing_table.classList.remove("flex");
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
    if (e.target.value !== "Select Branch") {
      setOdBranchId(e.target.value);
    } else {
      setOdBranchId("");
    }
  };

  const handleODFilterSubmit = (e) => {
    let selectedFilter = {};
    if (odExaminationName === "Select Examination") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odSelectedYear === "Select Year") {
      toast.error("Please select year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odCourseId === "Select Course") {
      toast.error("Please select course", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      selectedFilter = {
        examination_name: odExaminationName,
        academic_year: odSelectedYear,
        course_id: odCourseId,
      };

      if (odBranchId !== "") {
        selectedFilter = {
          examination_name: odExaminationName,
          academic_year: odSelectedYear,
          course_id: odCourseId,
          branch_id: odBranchId,
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
            "od_faculty_list_viewport"
          );

          if (res.data.status === "ok") {
            if (res.data.data.users.length !== 0) {
              faculty_listing_viewport.classList.remove("hidden");
              faculty_listing_viewport.classList.add("flex");
              setOdFacultyName(res.data.data.users);
              res.data.data.users.map((faculty) => {
                axios
                  .get(
                    `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/other_duties/${faculty.id}/fetch_details?subdomain=${subdomain}`,
                    { headers }
                  )
                  .then((res) => {
                    console.log(res);
                    const od_assigned_duty_input = document.getElementById(
                      "od-student-input-user-" + faculty.id
                    );
                    const other_duty_submit_button =
                      document.getElementById(
                        "other-duty-button-" + faculty.id
                      );
                      if (res.data.message == "Details found") {
                        other_duty_submit_button.disabled = true;
                        other_duty_submit_button.innerHTML = "Created";
                        other_duty_submit_button.classList.add(
                          "cursor-not-allowed"
                        );

                        od_assigned_duty_input.disabled = true;
                        od_assigned_duty_input.value =
                          res.data.data.other_duty.assigned_duties;
                        od_assigned_duty_input.classList.add(
                          "cursor-not-allowed"
                        );
                      } else {
                        other_duty_submit_button.disabled = false;
                        other_duty_submit_button.innerHTML = "Create";
                        other_duty_submit_button.classList.remove(
                          "cursor-not-allowed"
                        );

                        od_assigned_duty_input.disabled = false;
                        od_assigned_duty_input.value = "";
                        od_assigned_duty_input.classList.remove(
                          "cursor-not-allowed"
                        );
                      }
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
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
          if (res.data.message === "These are the other duties") {
            if (res.data.data.other_duties.length !== 0) {
              setOtherDutyData(res.data.data.other_duties);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const createODObject = (user_id, od_assigned_duty) => {
    let request_body = {};
    if (odExaminationName === "") {
      toast.error("Please select examination name", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odSelectedYear === "") {
      toast.error("Please select academic year", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else if (odCourseId === "Select Course") {
      toast.error("Please select course", {
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
        };
      } else {
        request_body = {
          examination_name: odExaminationName,
          academic_year: odSelectedYear,
          user_id: user_id,
          course_id: odCourseId,
          assigned_duties: od_assigned_duty,
        };
      }

      console.log("Button Clicked");

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
          const od_assogned_duty_input = document.getElementById(
            "sr-student-input-user-" + user_id
          );
          const od_other_duty_submit_button = document.getElementById(
            "sr-supervision-button-" + user_id
          );
          if (res.data.status === "created") {
            od_assogned_duty_input.disabled = true;
            od_assogned_duty_input.value =
              res.data.data.supervision.no_of_supervisions;
            od_assogned_duty_input.classList.add("cursor-not-allowed");
            od_other_duty_submit_button.disabled = true;
            od_other_duty_submit_button.innerHTML = "Created";
            od_other_duty_submit_button.classList.add("cursor-not-allowed");
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
    }
  };

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
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white bg-slate-600 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <div className="flex justify-center space-x-4 mb-5">
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button1" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button1")}
              >
                Jr. Supervisors
              </button>
              <button
                className={`bg-slate-500 text-white font-bold py-2 px-4 rounded-lg ${
                  activeButton === "button2" ? "bg-slate-800" : ""
                }`}
                onClick={() => toggleContent("button2")}
              >
                Sr. Supervisor
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
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={(e) => {
                      handleJrExaminationChange(e.target.value);
                    }}
                  >
                    <option>Select Examination</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>

                  <select
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={(e) => handleJrYearChange(e.target.value)}
                  >
                    <option value="Select Year">Select Year</option>
                    {academic_years.map((year) => {
                      return <option value={year}>{year}</option>;
                    })}
                  </select>

                  <select
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={handleJrCourseChange}
                  >
                    <option>Select Course</option>
                    {courses.map((course) => (
                      <option value={course.id}>{course.name}</option>
                    ))}
                  </select>

                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2"
                    onChange={handleJrBranchChange}
                  >
                    <option>Select Branch</option>
                    {branches.map((branch) => (
                      <option value={branch.id}>{branch.name}</option>
                    ))}
                  </select>

                  <button
                    className="py-2 px-3 absolute right-0 mr-7 bg-gray-800 rounded-2xl text-white font-bold"
                    // id={"button-subject-" + subject.id}
                    onClick={handleFilterSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div
                  id="faculty_listing_viewport"
                  className="hidden overflow-y-scroll h-52 flex-col mt-5"
                >
                  <div className="">
                    <div className="p-1.5 w-full inline-block align-middle">
                      <div className="border rounded-lg">
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
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Enter No. Of Supervision
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
                            {facultyName.map((item) => {
                              if (Object.keys(facultyName).length !== 0) {
                                return (
                                  <tr>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {item.first_name} {item.last_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {item.designation}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {item.department}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                                      <input
                                        className="shadow appearance-none border rounded w-52 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id={"jr-student-input-user-" + item.id}
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
                                      className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                                      data-id={item.id}
                                    >
                                      <button
                                        className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                        id={"jr-supervision-button-" + item.id}
                                        onClick={() =>
                                          createObject(
                                            item.id,
                                            noOfSupervisions
                                          )
                                        }
                                      >
                                        Create
                                      </button>
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

                <div
                  id="supervision_list_table"
                  className="hidden overflow-y-scroll overflow-x-scroll h-52 flex-col mt-5"
                >
                  <div className="p-1.5 w-full inline-block align-middle">
                    <div className="border rounded-lg">
                      <table className="min-w-full w-max divide-y divide-gray-200">
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
                            {storedTimeTables.map((time_table) => {
                              return (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                                >
                                  {time_table.subject_name}({time_table.date})
                                </th>
                              );
                            })}
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {supervisionData.map((item) => {
                            return (
                              <tr>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {item.faculty_name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {item.designation}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {item.department}
                                </td>
                                {storedTimeTables.map((time_table) => {
                                  return (
                                    <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                      <input
                                        type="checkbox"
                                        // checked={
                                        //   item.metadata === null
                                        //     ? false
                                        //     : item.metadata.metadata[key]
                                        // }
                                        name={
                                          time_table.subject_name +
                                          "(" +
                                          time_table.date +
                                          ")"
                                        }
                                        onChange={handlechangeDateCheckBox}
                                      />
                                    </td>
                                  );
                                })}
                                <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                  <button
                                    className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                    data-id={item.id}
                                    onClick={handleJuniorSupervisionSubmit}
                                  >
                                    Submit
                                  </button>
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
                    <option>Select Examination</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>

                  <select
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={(e) => handleSrYearChange(e.target.value)}
                  >
                    <option value="Select Year">Select Year</option>
                    {academic_years.map((year) => {
                      return <option value={year}>{year}</option>;
                    })}
                  </select>

                  <select
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={handleSrCourseChange}
                  >
                    <option>Select Course</option>
                    {srCourses.map((course) => (
                      <option value={course.id}>{course.name}</option>
                    ))}
                  </select>

                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2"
                    onChange={handleSrBranchChange}
                  >
                    <option>Select Branch</option>
                    {srBranches.map((branch) => (
                      <option value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                  <button
                    className="py-2 px-3 absolute right-0 mr-7 bg-gray-800 rounded-2xl text-white font-bold"
                    // id={"button-subject-" + subject.id}
                    onClick={handleSrFilterSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div
                  id="sr_faculty_listing_viewport"
                  className="hidden overflow-y-scroll h-52 flex-col mt-5"
                >
                  <div className="">
                    <div className="p-1.5 w-full inline-block align-middle">
                      <div className="border rounded-lg">
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
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Enter No. Of Supervision
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
                            {srFacultyName.map((item) => {
                              if (Object.keys(srFacultyName).length !== 0) {
                                return (
                                  <tr>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {item.first_name} {item.last_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {item.designation}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {item.course_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                                      <input
                                        className="shadow appearance-none border rounded w-52 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id={"sr-student-input-user-" + item.id}
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
                                      className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                                      data-id={item.id}
                                    >
                                      <button
                                        className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                        id={"sr-supervision-button-" + item.id}
                                        onClick={() =>
                                          createSrObject(
                                            item.id,
                                            srNoOfSupervisions
                                          )
                                        }
                                      >
                                        Create
                                      </button>
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
                <div
                  id="sr_supervision_list_table"
                  className="hidden overflow-y-scroll overflow-x-scroll h-52 flex-col mt-5"
                >
                  <div className="p-1.5 w-full inline-block align-middle">
                    <div className="border rounded-lg">
                      <table className="min-w-full w-max divide-y divide-gray-200">
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
                            {srStoredTimeTables.map((time_table) => {
                              return (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-bold text-gray-500 uppercase "
                                >
                                  {time_table.subject_name}({time_table.date})
                                </th>
                              );
                            })}
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {srSupervisionData.map((item) => {
                            return (
                              <tr>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {item.faculty_name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {item.designation}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                  {item.department}
                                </td>
                                {srStoredTimeTables.map((time_table) => {
                                  return (
                                    <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                      <input
                                        type="checkbox"
                                        // checked={
                                        //   item.metadata === null
                                        //     ? false
                                        //     : item.metadata.metadata[key]
                                        // }
                                        name={
                                          time_table.subject_name +
                                          "(" +
                                          time_table.date +
                                          ")"
                                        }
                                        onChange={handlechangeSrDateCheckBox}
                                      />
                                    </td>
                                  );
                                })}
                                <td className="px-6 py-4 text-sm  whitespace-nowrap">
                                  <button
                                    className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                    data-id={item.id}
                                    onClick={handleSeniorSupervisionSubmit}
                                  >
                                    Submit
                                  </button>
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
              <div
                id="content3"
                className={`w-full p-4 rounded-lg ${
                  activeButton === "button3" ? "block" : "hidden"
                }`}
              >
                <div className="flex ml-2">
                  <select
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={(e) => {
                      handleODExaminationChange(e.target.value);
                    }}
                  >
                    <option>Select Examination</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>

                  <select
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={(e) => handleODYearChange(e.target.value)}
                  >
                    <option value="Select Year">Select Year</option>
                    {academic_years.map((year) => {
                      return <option value={year}>{year}</option>;
                    })}
                  </select>

                  <select
                    className="form-select rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                    onChange={handleODCourseChange}
                  >
                    <option>Select Course</option>
                    {odCourses.map((course) => (
                      <option value={course.id}>{course.name}</option>
                    ))}
                  </select>

                  <select
                    className="form-select text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 rounded justify-center shadow-md px-3 py-2"
                    onChange={handleODBranchChange}
                  >
                    <option>Select Branch</option>
                    {odBranches.map((branch) => (
                      <option value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                  <button
                    className="py-2 px-3 absolute right-0 mr-7 bg-gray-800 rounded-2xl text-white font-bold"
                    // id={"button-subject-" + subject.id}
                    onClick={handleODFilterSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div
                  id="od_faculty_list_viewport"
                  className="hidden overflow-y-scroll flex-col mt-5" style={{height: 445}}
                >
                  <div className="">
                    <div className="p-1.5 w-full inline-block align-middle">
                      <div className="border rounded-lg">
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
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                              >
                                Assign Other Duty
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
                            {odFacultyName.map((item) => {
                              if (Object.keys(odFacultyName).length !== 0) {
                                return (
                                  <tr>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {item.first_name} {item.last_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {item.designation}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                      {item.course_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-left whitespace-nowrap">
                                      <input
                                        className="shadow appearance-none border rounded w-52 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id={"od-student-input-user-" + item.id}
                                        onChange={(e) =>
                                          setOdAssignedDuty(e.target.value)
                                        }
                                        type="text"
                                        placeholder="Assign Duty"
                                      />
                                    </td>
                                    <td
                                      className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                                      data-id={item.id}
                                    >
                                      <button
                                        className="py-3 px-8 bg-gray-800 rounded-2xl text-white font-bold"
                                        id={"other-duty-button-" + item.id}
                                        onClick={() =>
                                          createODObject(
                                            item.id,
                                            odAssignedDuty
                                          )
                                        }
                                      >
                                        Create
                                      </button>
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
      <ToastContainer />
    </div>
  );
};

export default ExamAssignSupervision;
