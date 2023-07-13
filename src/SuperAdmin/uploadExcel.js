import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./modal";
import SignInSuperAdmin from "./signInSuperAdmin";

var acces_token = localStorage.getItem("access_token");
var headers = { Authorization: `Bearer ${acces_token}` };
var roles = localStorage.getItem("roles");
var subdomain;
const UploadExcel = () => {
  const navigate = useNavigate();
  const [uniName, setUniName] = useState("");
  const [faculty, setFaculty] = useState("");
  // const [subdomain, setSubdomain] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [clientId, setClentId] = useState("");
  const [clientSecret, setClentSecret] = useState("");
  const [excelSheets, setExcelSheets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteExcel, setDeleteExcel] = useState(false);

  useEffect(() => {
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
          `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/excel_sheets`,
          {
            headers,
            params: {
              subdomain: subdomain,
            },
          }
        )
        .then((res) => {
          if (res.data.data.excel_sheets.length !== 0) {
            setExcelSheets(res.data.data.excel_sheets);
          } else {
          }
        })
        .catch((err) => {
          console.error(err);
        });

      setFaculty("Super Admin");
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    acces_token = localStorage.getItem("access_token");
    const submit_button = document.getElementById("button-submit-excel-sheet");
    const file_select = document.getElementById("file_select");
    const file_input = document.getElementById("file_input");
    submit_button.disabled = true;
    submit_button.innerHTML = "Uploading ...";
    submit_button.classList.add("cursor-not-allowed");
    if (selectedFile !== null || selectedFile !== "") {
      axios
        .post(
          "http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/excel_sheets",
          {
            excel_sheet: {
              name: selectedValue,
              sheet: selectedFile,
            },
            subdomain: subdomain,
          },
          {
            headers: {
              Authorization: `Bearer ${acces_token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((responce) => {
          submit_button.disabled = false;
          submit_button.innerHTML = "Upload";
          submit_button.classList.remove("cursor-not-allowed");
          if (responce.data.status == "created") {
            axios
              .get(
                `http://ec2-13-234-111-241.ap-south-1.compute.amazonaws.com/api/v1/excel_sheets`,
                {
                  headers,
                  params: {
                    subdomain: subdomain,
                  },
                }
              )
              .then((res) => {
                if (res.data.data.excel_sheets.length !== 0) {
                  setExcelSheets(res.data.data.excel_sheets);
                }
              })
              .catch((err) => {
                console.error(err);
              });
            file_select.options.selectedIndex = 0;
            file_input.value = null;
            setSelectedFile("");
            setSelectedValue("");
            toast.success(responce.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          } else {
            toast.error(responce.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
        })
        .catch(function (err) {
          submit_button.disabled = false;
          submit_button.innerHTML = "Upload";
          submit_button.classList.remove("cursor-not-allowed");
          console.log(err.message);
        });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSheetNameChange = (e) => {
    setSelectedValue(e.target.value);
    setSelectedFile("");
    const hidden_div = document.getElementById("hidden_div");
    const file_input = document.getElementById("file_input");
    file_input.value = null;
    if (e.target.value !== "Select Sheet name") {
      hidden_div.classList.remove("hidden");
    } else {
      hidden_div.classList.add("hidden");
    }
  };

  const handleDeleteExcel = (e, id) => {
    e.preventDefault();
    console.log(id);
  };

  const not_authorized = () => {
    toast.error("You are not authorized to access that page!", {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 1000,
    });
    navigate(-1);
  };

  return (
    <div>
      {acces_token && roles.includes("super_admin") ? (
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
                    href="/uploadExcel"
                    className="flex items-center p-2 text-gray-900 rounded-lg bg-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Upload Excel File
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/assignRole"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="ml-3">Assign Roles</span>
                  </a>
                </li>

                <div className="p-4">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                    onClick={handleLogout}
                  >
                    <span className="">Logout</span>
                  </button>
                </div>
              </ul>
            </div>
          </aside>

          <div className="p-4 sm:ml-64">
            <div className="p-4 rounded-lg mt-14">
              <div className="text-center text-4xl mb-5">
                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  Upload Excel Sheet
                </h3>
              </div>

              <div className="flex justify-center">
                <form
                  onSubmit={handleSubmit}
                  class="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10"
                >
                  <div className="flex">
                    <select
                      id="file_select"
                      className="form-select w-full rounded justify-center text-sm md:text-base lg:text-base mr-2 border-0 border-b-2 border-b-gray-700 shadow-md px-3 py-2"
                      onChange={(e) => {
                        handleSheetNameChange(e);
                      }}
                    >
                      <option>Select Sheet name</option>
                      <option>Faculty Details</option>
                      <option>Course and Semester Details</option>
                      <option>Subject Details</option>
                      <option>Division Details</option>
                      <option>Student Details</option>
                    </select>
                  </div>

                  <div id="hidden_div" className="hidden">
                    <div className="text-center text-2xl mt-5"></div>

                    <div className="grid grid-cols-1 space-y-2">
                      <label className="text-start text-sm font-bold text-gray-500 tracking-wide">
                        Choose {selectedValue} Sheet
                      </label>
                      <div className="flex justify-center w-full">
                        <span class="sr-only">
                          Choose {selectedValue} Sheet
                        </span>
                        <input
                          type="file"
                          id="file_input"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-blue-100"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          accept=".xls,.xlsx"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center mt-5">
                      <button
                        type="submit"
                        id="button-submit-excel-sheet"
                        className="text-center w-full bg-green-600 text-gray-100 p-4 rounded-full tracking-wide
                font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-700 shadow-lg transition ease-in duration-300"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div
                id="sheets_viewport"
                className="flex flex-col mt-5"
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
                              Sheet Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-center divide-y divide-gray-200">
                          {excelSheets.length === 0 ? (
                            <tr className="items-center">
                              {" "}
                              <td colSpan={3}>
                                {" "}
                                No excel sheets uploaded yet! Please upload
                                first{" "}
                              </td>{" "}
                            </tr>
                          ) : (
                            excelSheets.map((excelSheet, index) => {
                              return (
                                <tr key={excelSheet.id}>
                                  <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                    {index + 1}
                                  </td>
                                  <td className="text-start px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                    {excelSheet.name}
                                  </td>
                                  <td className="text-center px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                    <button
                                      id={excelSheet.id}
                                      className="text-center w-auto bg-transparent text-gray-100 p-1 rounded-full tracking-wide
                                  font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-200 shadow-lg cursor-pointer transition ease-in duration-300"
                                      onClick={() => {
                                        setShowModal(true);
                                      }}
                                    >
                                      <RiDeleteBin6Line
                                        size={20}
                                        className="text-red-600"
                                      />
                                    </button>
                                    {showModal && (
                                      <Modal
                                        setOpenModal={setShowModal}
                                        id={excelSheet.id}
                                        setSheets={setExcelSheets}
                                      />
                                    )}
                                  </td>
                                </tr>
                              );
                            })
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
      ) : (
        (toast.error("You are not authorized to access that page!", {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 1000,
        }),
        navigate(-1))
      )}
    </div>
  );
};

export default UploadExcel;
