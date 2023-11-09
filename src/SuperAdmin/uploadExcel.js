import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./modal";
import SignInSuperAdmin from "./signInSuperAdmin";
import BookLoader from "../Admin/bookLoader";

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
  const [excelSheets, setExcelSheets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteExcel, setDeleteExcel] = useState(false);
  const [status, setStatus] = useState("accepted");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var acces_token = localStorage.getItem("access_token");
    setLoading(true);
    if (!acces_token) {
      toast.error("Not authorized to access the page.");
      navigate("/");
    } else {
      const host = window.location.host;
      const arr = host
        .split(".")
        .slice(0, host.includes("localhost") ? -1 : -2);
      if (arr.length > 0) {
        subdomain = arr[0];
      }

      if (subdomain !== null || subdomain !== "") {
        axios
          .get(`/universities/${subdomain}/get_authorization_details`)
          .then((response) => {
            if (response.data.status === "ok") {
              if (response.data.university.status === "accepted") {
                setUniName(response.data.university.name);
                axios
                  .get(`/users/users/find_user?subdomain=${subdomain}`, {
                    headers,
                  })
                  .then((responce) => {
                    // selectedFilter = responce.data.configuration;
                    if (responce.data.status === "ok") {
                      if (responce.data.roles.includes("super_admin")) {
                        axios
                          .get(`/excel_sheets`, {
                            headers,
                            params: {
                              subdomain: subdomain,
                            },
                          })
                          .then((res) => {
                            if (res.data.data.excel_sheets.length !== 0) {
                              setLoading(false);
                              setExcelSheets(res.data.data.excel_sheets);
                            } else {
                              setLoading(false);
                            }
                          })
                          .catch((err) => {
                            console.error(err);
                          })
                          .finally(() => {
                            setLoading(false);
                          });
                      } else {
                        localStorage.clear();
                        toast.error(
                          "You are not authorized to access the page."
                        );
                        navigate("/");
                      }
                      setFaculty(
                        responce.data.user.first_name +
                          " " +
                          responce.data.user.last_name
                      );
                    }
                  })
                  .catch((error) => console.log(error));
              } else {
                navigate("/");
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [acces_token, navigate]);

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
          "/excel_sheets",
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
              .get(`/excel_sheets`, {
                headers,
                params: {
                  subdomain: subdomain,
                },
              })
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
    toast.success("Log out Successfully!");
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
                        {"Super Admin"}
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

            <div className="flex flex-col justify-center">
              <div className="row">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-row w-full mt-5 bg-white rounded-xl z-10"
                >
                  <div className="flex flex-row">
                    <div className="relative text-left w-full">
                      <select
                        id="file_select"
                        className="appearance-none w-full py-2 pl-3 pr-10 text-sm font-medium leading-5 rounded-full transition duration-150 ease-in-out border-0 border-b-2 focus:outline-none focus:shadow-outline-blue focus:border-gray-300 sm:text-sm sm:leading-5"
                        onChange={(e) => {
                          handleSheetNameChange(e);
                        }}
                      >
                        <option className="text-gray-600">
                          Select Sheet name
                        </option>
                        <option className="text-black font-bold">
                          Faculty Details
                        </option>
                        <option className="text-black font-bold">
                          Course and Semester Details
                        </option>
                        <option className="text-black font-bold">
                          Subject Details
                        </option>
                        <option className="text-black font-bold">
                          Division Details
                        </option>
                        <option className="text-black font-bold">
                          Student Details
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                            clip-rule="evenodd"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M2 10a8 8 0 018-8 8 8 0 110 16 8 8 0 01-8-8zm1 0a7 7 0 1014 0 7 7 0 00-14 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div id="hidden_div" className="hidden">
                    <div className="flex flex-row justify-between ml-5 -mt-7">
                      <div className="mr-5">
                        <label className="text-start text-sm text-gray-500 tracking-wider">
                          Choose {selectedValue} Sheet
                        </label>
                        <div>
                          <input
                            type="file"
                            id="file_input"
                            className="block w-full border-2 border-gray-300 rounded-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-200"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            accept=".xls,.xlsx"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        id="button-submit-excel-sheet"
                        className="text-center bg-gray-600 text-gray-100 p-2 px-12 rounded-2xl tracking-wide
                font-semibold focus:outline-none focus:shadow-outline hover:bg-gray-700 shadow-lg transition ease-in duration-300 mt-5"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div
              id="sheets_viewport"
              className="flex flex-col mt-5"
              style={{ height: 390 }}
            >
              <div className="">
                <div className="p-1.5 w-full inline-block align-middle">
                  <div
                    className={`${
                      loading ? "border-none" : "border"
                    } rounded-lg`}
                  >
                    <table className="min-w-full divide-y table-auto divide-gray-200">
                      {loading ? (
                        <>
                          <div className="w-full flex items-center justify-center">
                            <BookLoader
                              message={"Fetching Uploaded Sheets ..."}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {excelSheets.length === 0 ? (
                            <>
                              <tbody className="text-center divide-y divide-gray-200">
                                <tr className="items-center">
                                  <td
                                    colSpan={3}
                                    className="bg-white border-2 border-red-900 border-collapse rounded-3xl text-black text-lg whitespace-nowrap"
                                  >
                                    No excel sheets uploaded yet, Please upload
                                    one to view here!
                                  </td>
                                </tr>
                              </tbody>
                            </>
                          ) : (
                            <>
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
                                {excelSheets.map((excelSheet, index) => {
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
                                })}
                              </tbody>
                            </>
                          )}
                        </>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadExcel;
