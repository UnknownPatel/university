import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { GiArchiveResearch, GiSausagesRibbon } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import numberToWords from "number-to-words";
import FeeModal from "./modals/feeModal";

var acces_token;
var headers;
var subdomain;

const FeeDetails = () => {
  const navigate = useNavigate();
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [academic_years, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [students, setStudents] = useState([]);
  const [hidden, setHidden] = useState(true);
  const [feeAmount, setFeeAmount] = useState("");
  const [feeDetails, setFeeDetails] = useState([]);
  const [feeShowModal, setFeeShowModal] = useState(false);
  const [feeDetailId, setFeeDetailId] = useState("");

  var year;

  useEffect(() => {
    acces_token = localStorage.getItem("access_token");
    const roles = localStorage.getItem("roles");

    year = new Date().getFullYear();
    setAcademicYears(
      Array.from(
        new Array(10),
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
        .get(`/universities/${subdomain}/get_authorization_details`)
        .then((response) => {
          //   console.log(response.data.university.name);
          setUniName(response.data.university.name);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`/users/users/find_user?subdomain=${subdomain}`, {
          headers,
        })
        .then((responce) => {
          setFaculty(
            responce.data.user.first_name + " " + responce.data.user.last_name
          );
          setCourseId(responce.data.user.course_id);
          axios
            .get(
              `/branches?subdomain=${subdomain}&course_id=${responce.data.user.course_id}`,
              { headers }
            )
            .then((response) => {
              if (response.data.status === "ok") {
                if (response.data.data.branches.length !== "0") {
                  setBranches(response.data.data.branches);
                }
              }
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }

    if (roles === null) {
      toast.error("Something went wrong, please Try Again!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, []);

  const handleYearChange = (date) => {
    setSelectedYear("");
    if (date !== "Select Year") {
      setSelectedYear(date);
    }
  };

  const handleBranchChange = (e) => {
    e.preventDefault();
    setSemesters([]);
    setBranchId("");
    setHidden(true);
    var branch_id = e.target.value;
    if (branch_id !== "Select Branch") {
      setBranchId(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    console.log(semesters);
    e.preventDefault();

    let selectedFilter = {};

    if (selectedYear === "") {
      toast.error("Please select a year");
    } else if (courseId === "") {
      toast.error("Please select course");
    } else if (branchId === "") {
      toast.error("Please select Branch");
    } else {
      selectedFilter = {
        academic_year: selectedYear,
        course_id: courseId,
        branch_id: branchId,
      };
      console.log(selectedFilter);
      if (subdomain !== null || subdomain !== "") {
        axios
          .get(`/semesters?subdomain=${subdomain}&branch_id=${branchId}`, {
            headers,
          })
          .then((response) => {
            setHidden(false);
            if (response.data.status === "ok") {
              if (response.data.data.semesters.length !== "0") {
                setSemesters(response.data.data.semesters);
                response.data.data.semesters.map((semester) => {
                  selectedFilter["semester_id"] = semester.id;
                  axios
                    .get(`/fee_details/${semester.id}/fetch_details`, {
                      headers,
                      params: {
                        fee_detail: selectedFilter,
                        subdomain: subdomain,
                      },
                    })
                    .then((response) => {
                      console.log(response);
                      const createButton = document.getElementById(
                        "button-semester-" + semester.id
                      );

                      const deleteButton = document.getElementById(
                        "delete-button-semester-" + semester.id
                      );
                      const fee_input = document.getElementById(
                        "amount-semester-" + semester.id
                      );

                      if (response.data.status === "ok") {
                        createButton.innerHTML = "Update";
                        deleteButton.setAttribute(
                          "data-fee-detail-id",
                          response.data.data.fee_detail.id
                        );
                        createButton.setAttribute(
                          "data-fee-detail-id",
                          response.data.data.fee_detail.id
                        );
                        deleteButton.classList.remove("hidden");
                        fee_input.value = response.data.data.fee_detail.amount;
                      } else {
                        createButton.innerHTML = "Create";
                        deleteButton.classList.add("hidden");
                        fee_input.value = "";
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
              } else {
                toast.error("NO Semester Found for the selected criteria! ");
              }
            } else {
              toast.error(response.data.message);
            }
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const createObject = (e, id) => {
    e.preventDefault();

    let selectedFilter = {};

    if (selectedYear === "") {
      toast.error("Please select a year");
    } else if (courseId === "") {
      toast.error("Please select course");
    } else if (branchId === "") {
      toast.error("Please select Branch");
    } else {
      selectedFilter = {
        academic_year: selectedYear,
        course_id: courseId,
        branch_id: branchId,
        semester_id: id,
      };
    }
    var semester_table_id = e.target.getAttribute("data-fee-detail-id");
    const fee_amount_input = document.getElementById("amount-semester-" + id);

    var feeAmount = fee_amount_input.value;

    if (feeAmount !== "") {
      selectedFilter["amount"] = feeAmount;
    } else {
      delete selectedFilter["amount"];
    }

    if (e.target.innerHTML === "Update") {
      axios
        .put(
          `/fee_details/${semester_table_id}`,
          {
            subdomain: subdomain,
            fee_detail: selectedFilter,
          },
          { headers }
        )
        .then((res) => {
          if (res.data.status === "ok") {
            if (res.data.data.fee_detail.length !== 0) {
              console.log("Updated");
              toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      axios
        .post(
          `/fee_details`,
          {
            fee_detail: selectedFilter,
            subdomain: subdomain,
          },
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
            },
          }
        )
        .then((responce) => {
          const button = document.getElementById("button-semester-" + id);
          const semesterAmount = document.getElementById(
            "amount-semester-" + id
          );
          const deleteButton = document.getElementById(
            "delete-button-semester-" + id
          );
          if (responce.data.status === "created") {
            button.innerHTML = "Update";
            deleteButton.setAttribute(
              "data-fee-detail-id",
              responce.data.data.fee_detail.id
            );
            button.setAttribute(
              "data-fee-detail-id",
              responce.data.data.fee_detail.id
            );
            deleteButton.classList.remove("hidden");
            semesterAmount.value = responce.data.data.fee_detail.amount;
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
                href="/feeDetails"
                className="flex items-center p-2 bg-slate-600 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Fee Details</span>
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
            <p>Fees Details</p>
          </div>

          <div className="flex mt-5 ml-2">
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
              onChange={handleBranchChange}
              isSearchable={true}
            >
              <option value="Select Branch">Branch</option>
              {branches.map((branch) => (
                <option value={branch.id}>{branch.name}</option>
              ))}
            </select>

            <button
              id="submit-button"
              className="text-center ml-4 w-auto bg-transparent text-slate-950 p-3 rounded-2xl tracking-wide border border-slate-950
              font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-700 hover:text-white hover:border-white shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={handleSubmit}
            >
              <p className="inline-flex">Submit</p>
            </button>
          </div>

          <div
            id="time_table_viewport"
            className={`${
              hidden ? "hidden" : "flex"
            } flex-col overflow-y-scroll mt-5 h-[60vh] max-h-fit`}
          >
            <div className="">
              <div className="p-1.5 w-full inline-block align-middle">
                <div className="border rounded-lg">
                  <table className="min-w-full divide-y table-auto divide-gray-200">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          semester
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                        >
                          Fee
                        </th>
                        <th
                          scope="col"
                          className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center divide-y divide-gray-200">
                      {semesters.map((semester) => (
                        <tr>
                          <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            {numberToWords.toOrdinal(semester.name) +
                              " semester"}
                          </td>
                          <td className="text-center flex justify-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <input
                              type="text"
                              id={"amount-semester-" + semester.id}
                              onChange={(e) => setFeeAmount(e.target.value)}
                              className="bg-gray-50  border-0 border-b-2 text-gray-900 text-sm rounded-lg block w-auto pl-5 p-2.5 border-gray-600 "
                              placeholder="Enter Fee Amount"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                            <button
                              className="text-center w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                              font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 hover:text-white hover:border-none shadow-lg cursor-pointer transition ease-in duration-300"
                              id={"button-semester-" + semester.id}
                              onClick={(e) => createObject(e, semester.id)}
                            >
                              Create
                            </button>
                            <button
                              id={"delete-button-semester-" + semester.id}
                              className="hidden text-center ml-4 w-auto bg-transparent text-slate-950 p-2 rounded-2xl tracking-wide border border-slate-950
                                    font-semibold focus:outline-none focus:shadow-outline hover:bg-red-600 hover:text-slate-50 hover:border-none shadow-lg cursor-pointer transition ease-in duration-300"
                              onClick={(e) => {
                                setFeeShowModal(true);
                                setFeeDetailId(
                                  e.target.getAttribute("data-fee-detail-id")
                                );
                              }}
                            >
                              Delete
                            </button>
                            {feeShowModal && (
                              <FeeModal
                                setOpenModal={setFeeShowModal}
                                id={feeDetailId}
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
    </div>
  );
};

export default FeeDetails;
